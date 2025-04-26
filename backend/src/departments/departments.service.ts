import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Department } from '../entities/department.entity';
import { User } from '../entities/user.entity';
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentFilterDto } from '../dto/department.dto';
import { EquipmentType } from '../entities/equipment.entity';
import { EmailService } from '../services/email.service';
import { CreateDepartmentUserDto } from '../auth/dto/create-department-user.dto';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    try {
      // Vérifier si un département avec le même nom existe déjà
      const existingDepartment = await this.departmentsRepository.findOne({
        where: { name: createDepartmentDto.name },
      });

      if (existingDepartment) {
        throw new ConflictException(`Un département avec le nom '${createDepartmentDto.name}' existe déjà`);
      }

      // Convertir le tableau en chaîne pour le stockage
      if (createDepartmentDto.managedEquipmentTypes && Array.isArray(createDepartmentDto.managedEquipmentTypes)) {
        (createDepartmentDto as any).managedEquipmentTypes = createDepartmentDto.managedEquipmentTypes.join(',');
      }

      const department = this.departmentsRepository.create(createDepartmentDto);
      this.logger.log(`Création d'un nouveau département: ${department.name}`);
      
      const savedDepartment = await this.departmentsRepository.save(department);
      
      // Créer un compte utilisateur pour le département si demandé
      if (createDepartmentDto.createAccount !== false) {
        await this.createDepartmentUser(savedDepartment, createDepartmentDto.password);
      }
      
      // Reconvertir la chaîne en tableau pour la réponse
      if (savedDepartment.managedEquipmentTypes && typeof savedDepartment.managedEquipmentTypes === 'string') {
        savedDepartment.managedEquipmentTypes = (savedDepartment.managedEquipmentTypes as string)
          .split(',')
          .filter(type => type) // Filtrer les valeurs vides
          .map(type => type as EquipmentType); // Convertir en type EquipmentType
      }
      
      return savedDepartment;
    } catch (error) {
      this.logger.error(`Erreur lors de la création du département: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async createDepartmentUser(department: Department, providedPassword?: string): Promise<void> {
    try {
      // Générer un nom d'utilisateur basé sur le nom du département
      const username = `dept_${department.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      
      // Utiliser le mot de passe fourni ou en générer un aléatoire
      const password = providedPassword || this.generateRandomPassword();
      
      // Créer le DTO pour l'utilisateur du département
      const createUserDto: CreateDepartmentUserDto = {
        username,
        password,
        email: department.contactEmail,
        firstName: department.responsibleName.split(' ')[0] || 'Admin',
        lastName: department.responsibleName.split(' ').slice(1).join(' ') || department.name,
        departmentId: department.id
      };
      
      // Créer l'utilisateur du département
      const user = await this.usersService.createDepartmentUser(createUserDto);
      
      // Envoyer un email avec les identifiants
      await this.emailService.sendCredentialsEmail(
        department.contactEmail,
        username,
        password,
        createUserDto.firstName,
        createUserDto.lastName,
        true
      );
      
      this.logger.log(`Compte utilisateur créé pour le département: ${department.name}`);
    } catch (error) {
      this.logger.error(`Erreur lors de la création du compte pour le département ${department.id}: ${error.message}`);
      // Ne pas bloquer la création du département si la création du compte échoue
    }
  }

  private generateRandomPassword(): string {
    // Générer un mot de passe aléatoire (12 caractères)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async findAll(filterDto: DepartmentFilterDto = {}): Promise<Department[]> {
    try {
      const { type, isActive, search, managesEquipmentType } = filterDto;
      const query = this.departmentsRepository.createQueryBuilder('department');

      if (type) {
        query.andWhere('department.type = :type', { type });
      }

      if (isActive !== undefined) {
        query.andWhere('department.isActive = :isActive', { isActive });
      }

      if (search) {
        query.andWhere(
          '(department.name LIKE :search OR department.description LIKE :search OR department.responsibleName LIKE :search)',
          { search: `%${search}%` },
        );
      }
      
      if (managesEquipmentType) {
        query.andWhere('department.managedEquipmentTypes LIKE :equipType', { equipType: `%${managesEquipmentType}%` });
      }

      query
        .select([
          'department.id',
          'department.name',
          'department.type',
          'department.description',
          'department.responsibleName',
          'department.contactEmail',
          'department.contactPhone',
          'department.isActive',
          'department.managedEquipmentTypes',
          'department.createdAt',
          'department.updatedAt'
        ])
        .leftJoinAndSelect('department.equipment', 'equipment')
        .leftJoinAndSelect('department.teams', 'teams');

      const departments = await query.getMany();
      
      // Conversion des chaînes managedEquipmentTypes en tableaux
      departments.forEach(department => {
        if (department.managedEquipmentTypes && typeof department.managedEquipmentTypes === 'string') {
          department.managedEquipmentTypes = (department.managedEquipmentTypes as string)
            .split(',')
            .filter(type => type) // Filtrer les valeurs vides
            .map(type => type as EquipmentType); // Convertir en type EquipmentType
        }
      });
      
      this.logger.log(`Récupération de ${departments.length} départements`);
      return departments;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des départements: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<Department> {
    try {
      const department = await this.departmentsRepository.findOne({
        where: { id },
        relations: ['equipment', 'teams'],
      });

      if (!department) {
        throw new NotFoundException(`Département avec ID "${id}" non trouvé`);
      }
      
      // Conversion des chaînes managedEquipmentTypes en tableaux
      if (department.managedEquipmentTypes && typeof department.managedEquipmentTypes === 'string') {
        department.managedEquipmentTypes = (department.managedEquipmentTypes as string)
          .split(',')
          .filter(type => type) // Filtrer les valeurs vides
          .map(type => type as EquipmentType); // Convertir en type EquipmentType
      }

      return department;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération du département ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    try {
      const department = await this.findOne(id);

      // si le nom est modifié et s'il existe déjà faire une vérification
      if (updateDepartmentDto.name && updateDepartmentDto.name !== department.name) {
        const existingDepartment = await this.departmentsRepository.findOne({
          where: { name: updateDepartmentDto.name },
        });

        if (existingDepartment) {
          throw new ConflictException(`Un département avec le nom '${updateDepartmentDto.name}' existe déjà`);
        }
      }
      
      // Convertir le tableau en chaîne pour le stockage
      if (updateDepartmentDto.managedEquipmentTypes && Array.isArray(updateDepartmentDto.managedEquipmentTypes)) {
        (updateDepartmentDto as any).managedEquipmentTypes = updateDepartmentDto.managedEquipmentTypes.join(',');
      }

      Object.assign(department, updateDepartmentDto);
      this.logger.log(`Mise à jour du département: ${department.name}`);
      
      const savedDepartment = await this.departmentsRepository.save(department);
      
      // Reconvertir la chaîne en tableau pour la réponse
      if (savedDepartment.managedEquipmentTypes && typeof savedDepartment.managedEquipmentTypes === 'string') {
        savedDepartment.managedEquipmentTypes = (savedDepartment.managedEquipmentTypes as string)
          .split(',')
          .filter(type => type) // Filtrer les valeurs vides
          .map(type => type as EquipmentType); // Convertir en type EquipmentType
      }
      
      return savedDepartment;
    } catch (error) {
      this.logger.error(`Erreur lors de la mise à jour du département ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const department = await this.findOne(id);
      
      // si le département a des équipements ou des équipes
      if ((department.equipment && department.equipment.length > 0) || 
          (department.teams && department.teams.length > 0)) {
        throw new ConflictException(`Impossible de supprimer le département car il contient des équipements ou des équipes`);
      }
      
      await this.departmentsRepository.remove(department);
      this.logger.log(`Département supprimé: ${department.name}`);
    } catch (error) {
      this.logger.error(`Erreur lors de la suppression du département ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getStatistics() {
    try {
      const totalDepartments = await this.departmentsRepository.count();
      const activeDepartments = await this.departmentsRepository.count({ where: { isActive: true } });
      const inactiveDepartments = await this.departmentsRepository.count({ where: { isActive: false } });
      
      // Compter par type
      const departmentsByType = {};
      for (const type of Object.values(EquipmentType)) {
        departmentsByType[type] = await this.departmentsRepository.count({
          where: {
            type: type as any
          }
        });
      }
      
      return {
        total: totalDepartments,
        active: activeDepartments,
        inactive: inactiveDepartments,
        byType: departmentsByType
      };
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des statistiques: ${error.message}`, error.stack);
      throw error;
    }
  }
} 