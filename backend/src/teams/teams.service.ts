import { Injectable, NotFoundException, ConflictException, Inject, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Team, TeamStatus } from './entities/team.entity';
import { CreateTeamDto, UpdateTeamDto, TeamFilterDto } from './dto/team.dto';
import { DepartmentsService } from '../departments/departments.service';
import { EquipmentType } from '../entities/equipment.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    private departmentsService: DepartmentsService,
    @Inject(REQUEST) private request: Request,
  ) {}

  private getCurrentUser() {
    return this.request.user as any;
  }

  private applyDepartmentFilter(query: any) {
    const user = this.getCurrentUser();
    if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
      // Si c'est un admin de département, filtrer par son département
      if (query.where && typeof query.where === 'object') {
        query.where.departmentId = user.departmentId;
      } else {
        query.where = { departmentId: user.departmentId };
      }
    }
    return query;
  }

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const user = this.getCurrentUser();

    // Si c'est un admin de département, forcer l'utilisation de son propre département
    if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
      createTeamDto.departmentId = user.departmentId;
    }
    
    // Vérifier si le département existe si un ID est fourni
    if (createTeamDto.departmentId) {
      const department = await this.departmentsService.findOne(createTeamDto.departmentId);
      if (!department) {
        throw new NotFoundException(`Département avec l'ID ${createTeamDto.departmentId} introuvable`);
      }
    }

    const team = this.teamsRepository.create({
      id: uuidv4(),
      ...createTeamDto,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });

    try {
      return await this.teamsRepository.save(team);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Une équipe avec ce nom existe déjà');
      }
      throw error;
    }
  }

  async findAll(filterDto?: TeamFilterDto): Promise<Team[]> {
    const { status, departmentId, equipmentType, search } = filterDto || {};
    const where: FindOptionsWhere<Team> = {};

    // Appliquer les filtres standard
    if (status) {
      where.status = status;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (equipmentType) {
      where.equipmentType = equipmentType;
    }

    // Appliquer le filtre de département basé sur l'utilisateur
    const user = this.getCurrentUser();
    if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
      where.departmentId = user.departmentId;
    }

    if (search) {
      const searchQuery = [
          { name: Like(`%${search}%`) },
          { description: Like(`%${search}%`) },
          { leadName: Like(`%${search}%`) },
          { location: Like(`%${search}%`) }
      ];

      // Appliquer le filtre de département à chaque condition de recherche si nécessaire
      if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
        for (const condition of searchQuery) {
          condition['departmentId'] = user.departmentId;
        }
      }

      return this.teamsRepository.find({
        where: searchQuery,
        relations: ['department', 'sites'],
      });
    }

    return this.teamsRepository.find({
      where,
      relations: ['department', 'sites'],
    });
  }

  async findByDepartment(departmentId: string): Promise<Team[]> {
    const user = this.getCurrentUser();
    
    // Si c'est un admin de département, vérifier qu'il a accès à ce département
    if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId && user.departmentId !== departmentId) {
      throw new NotFoundException(`Département avec l'ID ${departmentId} introuvable ou accès non autorisé`);
    }

    return this.teamsRepository.find({
      where: { departmentId },
      relations: ['department', 'sites'],
    });
  }

  async findByEquipmentType(equipmentType: EquipmentType): Promise<Team[]> {
    const query = {
      where: { equipmentType },
      relations: ['department', 'sites'],
    };
    
    return this.teamsRepository.find(this.applyDepartmentFilter(query));
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: ['department', 'sites'],
    });

    if (!team) {
      throw new NotFoundException(`Équipe avec l'ID ${id} introuvable`);
    }

    // Vérifier si l'utilisateur a accès à cette équipe
    const user = this.getCurrentUser();
    if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId && team.departmentId !== user.departmentId) {
      throw new NotFoundException(`Équipe avec l'ID ${id} introuvable ou accès non autorisé`);
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    const user = this.getCurrentUser();

    // Si c'est un admin de département, vérifier qu'il a accès à cette équipe
    if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
      if (team.departmentId !== user.departmentId) {
        throw new NotFoundException(`Équipe avec l'ID ${id} introuvable ou accès non autorisé`);
      }
      
      // Forcer l'utilisation du même département
      if (updateTeamDto.departmentId && updateTeamDto.departmentId !== user.departmentId) {
        throw new ConflictException(`Vous ne pouvez pas changer le département de cette équipe`);
      }
      
      // S'assurer que le département reste le même
      updateTeamDto.departmentId = user.departmentId;
    }

    // Vérifier si le département existe si un ID est fourni
    if (updateTeamDto.departmentId) {
      const department = await this.departmentsService.findOne(updateTeamDto.departmentId);
      if (!department) {
        throw new NotFoundException(`Département avec l'ID ${updateTeamDto.departmentId} introuvable`);
      }
    }

    Object.assign(team, updateTeamDto);
    return this.teamsRepository.save(team);
  }

  async remove(id: string): Promise<void> {
    const team = await this.findOne(id);
    
    // La méthode findOne a déjà vérifié l'accès
    await this.teamsRepository.remove(team);
  }

  async getStatistics(): Promise<any> {
    const user = this.getCurrentUser();
    let queryBuilder = this.teamsRepository.createQueryBuilder('team');
    
    // Filtrer par département si c'est un admin de département
    if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
      queryBuilder = queryBuilder.where('team.departmentId = :departmentId', { departmentId: user.departmentId });
    }
    
    const totalTeams = await queryBuilder.getCount();
    
    // Réinitialiser le queryBuilder pour chaque requête
    queryBuilder = this.teamsRepository.createQueryBuilder('team');
    if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
      queryBuilder = queryBuilder.where('team.departmentId = :departmentId', { departmentId: user.departmentId });
    }
    const activeTeams = await queryBuilder.andWhere('team.status = :status', { status: TeamStatus.ACTIVE }).getCount();
    
    queryBuilder = this.teamsRepository.createQueryBuilder('team');
    if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
      queryBuilder = queryBuilder.where('team.departmentId = :departmentId', { departmentId: user.departmentId });
    }
    const standbyTeams = await queryBuilder.andWhere('team.status = :status', { status: TeamStatus.STANDBY }).getCount();
    
    queryBuilder = this.teamsRepository.createQueryBuilder('team');
    if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
      queryBuilder = queryBuilder.where('team.departmentId = :departmentId', { departmentId: user.departmentId });
    }
    const inactiveTeams = await queryBuilder.andWhere('team.status = :status', { status: TeamStatus.INACTIVE }).getCount();
    
    // Pour les statistiques par département, si c'est un admin de département, montrer uniquement son département
    let teamsByDepartment = [];
    if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
      const department = await this.departmentsService.findOne(user.departmentId);
      teamsByDepartment = [{
        departmentName: department.name,
        count: totalTeams
      }];
    } else {
      teamsByDepartment = await this.teamsRepository
      .createQueryBuilder('team')
      .select('department.name', 'departmentName')
      .addSelect('COUNT(team.id)', 'count')
      .leftJoin('team.department', 'department')
      .groupBy('department.name')
      .getRawMany();
    }
    
    // Pour les statistiques par type d'équipement
    let queryBuilderByType = this.teamsRepository.createQueryBuilder('team');
    if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
      queryBuilderByType = queryBuilderByType.where('team.departmentId = :departmentId', { departmentId: user.departmentId });
    }
    const teamsByEquipmentType = await queryBuilderByType
      .select('team.equipmentType', 'equipmentType')
      .addSelect('COUNT(team.id)', 'count')
      .groupBy('team.equipmentType')
      .getRawMany();

    return {
      total: totalTeams,
      byStatus: {
        active: activeTeams,
        standby: standbyTeams,
        inactive: inactiveTeams
      },
      byDepartment: teamsByDepartment,
      byEquipmentType: teamsByEquipmentType
    };
  }
} 