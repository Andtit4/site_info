import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Team, TeamStatus } from './entities/team.entity';
import { CreateTeamDto, UpdateTeamDto, TeamFilterDto } from './dto/team.dto';
import { DepartmentsService } from '../departments/departments.service';
import { EquipmentType } from '../entities/equipment.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    private departmentsService: DepartmentsService,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
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

    if (status) {
      where.status = status;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (equipmentType) {
      where.equipmentType = equipmentType;
    }

    if (search) {
      return this.teamsRepository.find({
        where: [
          { name: Like(`%${search}%`) },
          { description: Like(`%${search}%`) },
          { leadName: Like(`%${search}%`) },
          { location: Like(`%${search}%`) }
        ],
        relations: ['department', 'sites'],
      });
    }

    return this.teamsRepository.find({
      where,
      relations: ['department', 'sites'],
    });
  }

  async findByDepartment(departmentId: string): Promise<Team[]> {
    return this.teamsRepository.find({
      where: { departmentId },
      relations: ['department', 'sites'],
    });
  }

  async findByEquipmentType(equipmentType: EquipmentType): Promise<Team[]> {
    return this.teamsRepository.find({
      where: { equipmentType },
      relations: ['department', 'sites'],
    });
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: ['department', 'sites'],
    });

    if (!team) {
      throw new NotFoundException(`Équipe avec l'ID ${id} introuvable`);
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);

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
    const result = await this.teamsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Équipe avec l'ID ${id} introuvable`);
    }
  }

  async getStatistics(): Promise<any> {
    const totalTeams = await this.teamsRepository.count();
    const activeTeams = await this.teamsRepository.count({ where: { status: TeamStatus.ACTIVE } });
    const standbyTeams = await this.teamsRepository.count({ where: { status: TeamStatus.STANDBY } });
    const inactiveTeams = await this.teamsRepository.count({ where: { status: TeamStatus.INACTIVE } });
    
    const teamsByDepartment = await this.teamsRepository
      .createQueryBuilder('team')
      .select('department.name', 'departmentName')
      .addSelect('COUNT(team.id)', 'count')
      .leftJoin('team.department', 'department')
      .groupBy('department.name')
      .getRawMany();
    
    const teamsByEquipmentType = await this.teamsRepository
      .createQueryBuilder('team')
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