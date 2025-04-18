import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from '../auth/dto/create-admin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
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
} 