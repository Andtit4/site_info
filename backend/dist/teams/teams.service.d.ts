import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto, UpdateTeamDto, TeamFilterDto } from './dto/team.dto';
import { DepartmentsService } from '../departments/departments.service';
import { EquipmentType } from '../entities/equipment.entity';
export declare class TeamsService {
    private teamsRepository;
    private departmentsService;
    constructor(teamsRepository: Repository<Team>, departmentsService: DepartmentsService);
    create(createTeamDto: CreateTeamDto): Promise<Team>;
    findAll(filterDto?: TeamFilterDto): Promise<Team[]>;
    findByDepartment(departmentId: string): Promise<Team[]>;
    findByEquipmentType(equipmentType: EquipmentType): Promise<Team[]>;
    findOne(id: string): Promise<Team>;
    update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team>;
    remove(id: string): Promise<void>;
    getStatistics(): Promise<any>;
}
