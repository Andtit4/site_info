import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Department } from '../entities/department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentFilterDto } from '../dto/department.dto';
import { EquipmentType } from '../entities/equipment.entity';

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
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
      
      const departmentsByType = await this.departmentsRepository
        .createQueryBuilder('department')
        .select('department.type', 'type')
        .addSelect('COUNT(department.id)', 'count')
        .groupBy('department.type')
        .getRawMany();
      
      const equipmentCountByDepartment = await this.departmentsRepository
        .createQueryBuilder('department')
        .leftJoinAndSelect('department.equipment', 'equipment')
        .select('department.name', 'departmentName')
        .addSelect('COUNT(equipment.id)', 'equipmentCount')
        .groupBy('department.name')
        .getRawMany();
      
      return {
        totalDepartments,
        activeDepartments,
        departmentsByType,
        equipmentCountByDepartment
      };
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des statistiques: ${error.message}`, error.stack);
      throw error;
    }
  }
} 