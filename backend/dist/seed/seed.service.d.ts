import { Repository } from 'typeorm';
import { Site } from '../entities/site.entity';
import { Equipment } from '../entities/equipment.entity';
import { SitesService } from '../sites/sites.service';
import { EquipmentService } from '../equipment/equipment.service';
import { DepartmentsService } from '../departments/departments.service';
import { TeamsService } from '../teams/teams.service';
export declare class SeedService {
    private sitesRepository;
    private equipmentRepository;
    private readonly sitesService;
    private readonly equipmentService;
    private readonly departmentsService;
    private readonly teamsService;
    private readonly logger;
    constructor(sitesRepository: Repository<Site>, equipmentRepository: Repository<Equipment>, sitesService: SitesService, equipmentService: EquipmentService, departmentsService: DepartmentsService, teamsService: TeamsService);
    seedAll(): Promise<{
        departments: number;
        teams: number;
        sites: number;
        equipment: number;
    }>;
    private seedDepartments;
    private seedTeams;
    private seedSites;
    private seedEquipment;
}
