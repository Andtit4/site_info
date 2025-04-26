import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Department } from '../entities/department.entity';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from '../auth/dto/create-admin.dto';
import { CreateDepartmentUserDto, UpdateProfileDto } from '../dto/users.dto';
import { EmailService } from '../services/email.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    private emailService: EmailService
  ) {}

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    }
    return user;
  }

  async create(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<User> {
    try {
      const { username, password, email, firstName, lastName } = createAdminDto;
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await this.findOneByUsername(username);
      if (existingUser) {
        throw new ConflictException(`L'utilisateur avec le nom d'utilisateur ${username} existe déjà`);
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Création de l'utilisateur administrateur
      const admin = this.usersRepository.create({
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        isAdmin: true,
      });
      
      return await this.usersRepository.save(admin);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la création de l\'administrateur');
    }
  }

  async createDepartmentUser(createDepartmentUserDto: CreateDepartmentUserDto): Promise<User> {
    try {
      const { username, password, email, firstName, lastName, departmentId } = createDepartmentUserDto;
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await this.findOneByUsername(username);
      if (existingUser) {
        throw new ConflictException(`L'utilisateur avec le nom d'utilisateur ${username} existe déjà`);
      }

      // Vérifier si le département existe
      const department = await this.departmentsRepository.findOne({ where: { id: departmentId } });
      if (!department) {
        throw new NotFoundException(`Le département avec l'ID ${departmentId} n'existe pas`);
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Création de l'utilisateur du département
      const departmentUser = this.usersRepository.create({
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        departmentId,
        isDepartmentAdmin: true,
        isAdmin: false,
      });
      
      const savedUser = await this.usersRepository.save(departmentUser);
      
      // Envoyer un email avec les identifiants
      await this.emailService.sendCredentialsEmail(
        email, 
        username, 
        password, 
        firstName, 
        lastName, 
        true
      );
      
      return savedUser;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la création de l\'utilisateur du département');
    }
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);
    
    // Vérifier si username existe déjà
    if (updateProfileDto.username && updateProfileDto.username !== user.username) {
      const existingUser = await this.findOneByUsername(updateProfileDto.username);
      if (existingUser) {
        throw new ConflictException(`L'utilisateur avec le nom d'utilisateur ${updateProfileDto.username} existe déjà`);
      }
    }
    
    // Mettre à jour les propriétés
    Object.assign(user, updateProfileDto);
    
    return this.usersRepository.save(user);
  }

  /**
   * Vérifie si un nom d'utilisateur est disponible
   * @param username Le nom d'utilisateur à vérifier
   * @param currentUserId ID de l'utilisateur actuel à exclure de la vérification (optionnel)
   * @returns true si le nom d'utilisateur est disponible, false sinon
   */
  async isUsernameAvailable(username: string, currentUserId?: string): Promise<boolean> {
    const query = this.usersRepository.createQueryBuilder('user')
      .where('user.username = :username', { username });
    
    // Exclure l'utilisateur actuel de la recherche s'il est fourni
    if (currentUserId) {
      query.andWhere('user.id != :currentUserId', { currentUserId });
    }
    
    const count = await query.getCount();
    return count === 0;
  }

  async changePassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      if (!newPassword || newPassword.trim() === '') {
        throw new Error('Le mot de passe ne peut pas être vide');
      }
      
      const user = await this.findById(userId);
      
      // Vérifier que le nouveau mot de passe est différent de l'ancien
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        // Ce n'est pas une erreur critique, on peut simplement indiquer que rien n'a changé
        return true;
      }
      
      // Hachage du nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Mise à jour du mot de passe
      user.password = hashedPassword;
      await this.usersRepository.save(user);
      
      // Envoyer un email de confirmation
      if (user.email) {
        try {
          await this.emailService.sendPasswordChangedEmail(
            user.email,
            user.username,
            user.firstName,
            user.lastName
          );
        } catch (emailError) {
          // On ne bloque pas la mise à jour du mot de passe si l'envoi d'email échoue
          this.logger.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
        }
      }
      
      return true;
    } catch (error) {
      this.logger.error(`Erreur lors du changement de mot de passe: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors du changement de mot de passe');
    }
  }
} 