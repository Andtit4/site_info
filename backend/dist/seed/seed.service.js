"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const site_entity_1 = require("../entities/site.entity");
const equipment_entity_1 = require("../entities/equipment.entity");
const sites_service_1 = require("../sites/sites.service");
const equipment_service_1 = require("../equipment/equipment.service");
const departments_service_1 = require("../departments/departments.service");
const teams_service_1 = require("../teams/teams.service");
const uuid_1 = require("uuid");
const department_entity_1 = require("../entities/department.entity");
const team_entity_1 = require("../teams/entities/team.entity");
let SeedService = SeedService_1 = class SeedService {
    constructor(sitesRepository, equipmentRepository, sitesService, equipmentService, departmentsService, teamsService) {
        this.sitesRepository = sitesRepository;
        this.equipmentRepository = equipmentRepository;
        this.sitesService = sitesService;
        this.equipmentService = equipmentService;
        this.departmentsService = departmentsService;
        this.teamsService = teamsService;
        this.logger = new common_1.Logger(SeedService_1.name);
    }
    async seedAll() {
        this.logger.log('Démarrage du seed de toutes les données...');
        const departments = await this.seedDepartments();
        const teams = await this.seedTeams(departments);
        const sites = await this.seedSites();
        const equipment = await this.seedEquipment(sites, departments);
        this.logger.log('Seed terminé avec succès !');
        return {
            departments: departments.length,
            teams: teams.length,
            sites: sites.length,
            equipment: equipment.length,
        };
    }
    async seedDepartments() {
        this.logger.log('Seeding départements...');
        const departments = [];
        const deptData = [
            {
                name: 'Transmission',
                type: department_entity_1.DepartmentType.TRANSMISSION,
                description: 'Gestion des équipements de transmission et des antennes',
                responsibleName: 'Marie Dupont',
                contactEmail: 'marie.dupont@telco.fr',
                contactPhone: '+33123456789',
            },
            {
                name: 'Énergie',
                type: department_entity_1.DepartmentType.ENERGIE,
                description: 'Gestion des alimentations et batteries de secours',
                responsibleName: 'Thomas Martin',
                contactEmail: 'thomas.martin@telco.fr',
                contactPhone: '+33123456790',
            },
            {
                name: 'Infrastructure',
                type: department_entity_1.DepartmentType.INFRASTRUCTURE,
                description: 'Gestion des bâtiments et pylônes',
                responsibleName: 'Sophie Bernard',
                contactEmail: 'sophie.bernard@telco.fr',
                contactPhone: '+33123456791',
            },
            {
                name: 'Informatique',
                type: department_entity_1.DepartmentType.INFORMATIQUE,
                description: 'Gestion des serveurs et réseaux',
                responsibleName: 'Pierre Leroy',
                contactEmail: 'pierre.leroy@telco.fr',
                contactPhone: '+33123456792',
            },
            {
                name: 'Sécurité',
                type: department_entity_1.DepartmentType.SECURITE,
                description: 'Supervision des accès et alarmes',
                responsibleName: 'Julie Moreau',
                contactEmail: 'julie.moreau@telco.fr',
                contactPhone: '+33123456793',
            },
        ];
        for (const data of deptData) {
            try {
                const department = await this.departmentsService.create({
                    ...data,
                    isActive: true,
                });
                departments.push(department);
                this.logger.log(`Département créé : ${department.name} (${department.id})`);
            }
            catch (error) {
                this.logger.error(`Erreur lors de la création du département ${data.name}: ${error.message}`);
            }
        }
        return departments;
    }
    async seedTeams(departments) {
        this.logger.log('Seeding équipes...');
        const teams = [];
        const teamData = [
            {
                name: 'Équipe Antennes Paris',
                description: 'Maintenance des antennes Île-de-France',
                status: team_entity_1.TeamStatus.ACTIVE,
                leadName: 'Alexandre Dubois',
                leadContact: '+33678901234',
                memberCount: 5,
                location: 'Paris',
                departmentId: departments[0]?.id,
            },
            {
                name: 'Équipe Énergie Nord',
                description: 'Gestion des batteries dans la région Nord',
                status: team_entity_1.TeamStatus.ACTIVE,
                leadName: 'Émilie Petit',
                leadContact: '+33678901235',
                memberCount: 4,
                location: 'Lille',
                departmentId: departments[1]?.id,
            },
            {
                name: 'Équipe Pylônes Sud',
                description: 'Maintenance des pylônes dans le Sud',
                status: team_entity_1.TeamStatus.ACTIVE,
                leadName: 'Nicolas Blanc',
                leadContact: '+33678901236',
                memberCount: 6,
                location: 'Marseille',
                departmentId: departments[2]?.id,
            },
            {
                name: 'Équipe Réseau Ouest',
                description: 'Support réseau pour la zone Ouest',
                status: team_entity_1.TeamStatus.ACTIVE,
                leadName: 'Claire Richard',
                leadContact: '+33678901237',
                memberCount: 3,
                location: 'Nantes',
                departmentId: departments[3]?.id,
            },
            {
                name: 'Équipe Sécurité Centrale',
                description: 'Équipe centrale de surveillance',
                status: team_entity_1.TeamStatus.ACTIVE,
                leadName: 'Paul Simon',
                leadContact: '+33678901238',
                memberCount: 7,
                location: 'Lyon',
                departmentId: departments[4]?.id,
            },
        ];
        for (const data of teamData) {
            try {
                if (data.departmentId) {
                    const team = await this.teamsService.create({
                        ...data,
                        lastActiveDate: new Date().toISOString(),
                    });
                    teams.push(team);
                    this.logger.log(`Équipe créée : ${team.name} (${team.id})`);
                }
            }
            catch (error) {
                this.logger.error(`Erreur lors de la création de l'équipe ${data.name}: ${error.message}`);
            }
        }
        return teams;
    }
    async seedSites() {
        this.logger.log('Seeding sites...');
        const sites = [];
        const siteData = [
            {
                id: 'SITE001',
                name: 'Tour Lomé Centre',
                region: 'Maritime',
                zone: 'Urbaine',
                longitude: 1.2219,
                latitude: 6.1375,
                status: site_entity_1.SiteStatus.ACTIVE,
                oldBase: 'LBE-254',
                newBase: 'LMC-001'
            },
            {
                id: 'SITE002',
                name: 'Station Kpalimé',
                region: 'Plateaux',
                zone: 'Périurbaine',
                longitude: 0.6333,
                latitude: 6.9000,
                status: site_entity_1.SiteStatus.MAINTENANCE,
                oldBase: 'KPE-118',
                newBase: 'KPL-002'
            },
            {
                id: 'SITE003',
                name: 'Relais Atakpamé',
                region: 'Plateaux',
                zone: 'Urbaine',
                longitude: 1.1200,
                latitude: 7.5300,
                status: site_entity_1.SiteStatus.ACTIVE,
                oldBase: 'ATK-076',
                newBase: 'ATK-003'
            },
            {
                id: 'SITE004',
                name: 'Tour Sokodé',
                region: 'Centrale',
                zone: 'Urbaine',
                longitude: 1.1400,
                latitude: 8.9900,
                status: site_entity_1.SiteStatus.INACTIVE,
                oldBase: 'SKD-042',
                newBase: 'SKD-004'
            },
            {
                id: 'SITE005',
                name: 'Station Kara',
                region: 'Kara',
                zone: 'Urbaine',
                longitude: 1.1900,
                latitude: 9.5500,
                status: site_entity_1.SiteStatus.ACTIVE,
                oldBase: 'KRA-033',
                newBase: 'KRA-005'
            },
            {
                id: 'SITE006',
                name: 'Relais Dapaong',
                region: 'Savanes',
                zone: 'Rurale',
                longitude: 0.2072,
                latitude: 10.8627,
                status: site_entity_1.SiteStatus.UNDER_CONSTRUCTION,
                oldBase: 'DPG-021',
                newBase: 'DPG-006'
            },
            {
                id: 'SITE007',
                name: 'Tour Aného',
                region: 'Maritime',
                zone: 'Côtière',
                longitude: 1.5919,
                latitude: 6.2275,
                status: site_entity_1.SiteStatus.ACTIVE,
                oldBase: 'ANH-156',
                newBase: 'ANH-007'
            },
            {
                id: 'SITE008',
                name: 'Station Tsévié',
                region: 'Maritime',
                zone: 'Périurbaine',
                longitude: 1.2133,
                latitude: 6.4261,
                status: site_entity_1.SiteStatus.MAINTENANCE,
                oldBase: 'TSV-198',
                newBase: 'TSV-008'
            }
        ];
        for (const siteData of siteData) {
            const site = this.sitesRepository.create(siteData);
            await this.sitesRepository.save(site);
            if (site.id === 'SITE001') {
                const equipment1 = this.equipmentRepository.create({
                    id: 'EQ001',
                    type: equipment_entity_1.EquipmentType.ANTENNA,
                    model: 'Huawei RTN 900',
                    manufacturer: 'Huawei',
                    serialNumber: 'HW-RTN-2023-001',
                    installDate: '2023-01-15',
                    lastMaintenanceDate: '2024-01-10',
                    status: equipment_entity_1.EquipmentStatus.ACTIVE,
                    specifications: {
                        hauteur: '45m',
                        puissance: '1000W',
                        fréquence: '900MHz'
                    },
                    site
                });
                await this.equipmentRepository.save(equipment1);
                const equipment2 = this.equipmentRepository.create({
                    id: 'EQ002',
                    type: equipment_entity_1.EquipmentType.BATTERY,
                    model: 'Tesla Powerpack',
                    manufacturer: 'Tesla',
                    serialNumber: 'TP-2023-1234',
                    installDate: '2023-01-15',
                    lastMaintenanceDate: '2024-01-10',
                    status: equipment_entity_1.EquipmentStatus.ACTIVE,
                    specifications: {
                        capacité: '210 kWh',
                        tension: '380-480V',
                        autonomie: '4 heures'
                    },
                    site
                });
                await this.equipmentRepository.save(equipment2);
            }
            else if (site.id === 'SITE002') {
                const equipment = this.equipmentRepository.create({
                    id: 'EQ003',
                    type: equipment_entity_1.EquipmentType.ANTENNA,
                    model: 'Nokia AirScale',
                    manufacturer: 'Nokia',
                    serialNumber: 'NK-AIR-2022-004',
                    installDate: '2022-05-20',
                    lastMaintenanceDate: '2023-11-05',
                    status: equipment_entity_1.EquipmentStatus.ACTIVE,
                    specifications: {},
                    site
                });
                await this.equipmentRepository.save(equipment);
            }
            else if (site.id === 'SITE003') {
                const equipment = this.equipmentRepository.create({
                    id: 'EQ004',
                    type: equipment_entity_1.EquipmentType.TOWER,
                    model: 'Structure TS-500',
                    manufacturer: 'TowerCo',
                    serialNumber: 'TC-TS500-2021-007',
                    installDate: '2021-08-10',
                    lastMaintenanceDate: '2024-03-15',
                    status: equipment_entity_1.EquipmentStatus.MAINTENANCE,
                    specifications: {},
                    site
                });
                await this.equipmentRepository.save(equipment);
            }
            this.logger.log(`Site créé: ${site.name}`);
            sites.push(site);
        }
        return sites;
    }
    async seedEquipment(sites, departments) {
        this.logger.log('Seeding équipements...');
        const equipment = [];
        if (sites.length === 0 || departments.length === 0) {
            this.logger.warn('Aucun site ou département trouvé pour créer des équipements');
            return equipment;
        }
        const equipmentByDepartment = {
            [department_entity_1.DepartmentType.TRANSMISSION]: [
                { type: equipment_entity_1.EquipmentType.ANTENNA, model: 'Huawei AA5220' },
                { type: equipment_entity_1.EquipmentType.ROUTER, model: 'Cisco XR9000' },
            ],
            [department_entity_1.DepartmentType.ENERGIE]: [
                { type: equipment_entity_1.EquipmentType.BATTERY, model: 'PowerCell E450' },
                { type: equipment_entity_1.EquipmentType.GENERATOR, model: 'GenPower G3000' },
            ],
            [department_entity_1.DepartmentType.INFRASTRUCTURE]: [
                { type: equipment_entity_1.EquipmentType.TOWER, model: 'TowerTech T100' },
                { type: equipment_entity_1.EquipmentType.SHELTER, model: 'SafeShelter S200' },
            ],
            [department_entity_1.DepartmentType.INFORMATIQUE]: [
                { type: equipment_entity_1.EquipmentType.ROUTER, model: 'Juniper MX240' },
            ],
            [department_entity_1.DepartmentType.SECURITE]: [
                { type: equipment_entity_1.EquipmentType.SECURITY, model: 'SecureAccess SA500' },
            ],
        };
        for (const site of sites.slice(0, 3)) {
            for (const department of departments) {
                const equipmentList = equipmentByDepartment[department.type] || [];
                for (const equipmentTemplate of equipmentList) {
                    try {
                        const installDate = new Date();
                        installDate.setMonth(installDate.getMonth() - Math.floor(Math.random() * 24));
                        const maintDate = new Date();
                        maintDate.setMonth(maintDate.getMonth() - Math.floor(Math.random() * 6));
                        const equipmentData = {
                            id: (0, uuid_1.v4)(),
                            ...equipmentTemplate,
                            manufacturer: 'TelcoTech',
                            serialNumber: `SN-${Math.floor(Math.random() * 100000)}`,
                            installDate: installDate.toISOString(),
                            lastMaintenanceDate: maintDate.toISOString(),
                            status: Math.random() > 0.2 ? equipment_entity_1.EquipmentStatus.ACTIVE : equipment_entity_1.EquipmentStatus.MAINTENANCE,
                            siteId: site.id,
                            departmentId: department.id,
                            specifications: {
                                power: `${Math.floor(Math.random() * 500) + 100}W`,
                                weight: `${Math.floor(Math.random() * 50) + 5}kg`,
                                dimensions: `${Math.floor(Math.random() * 100) + 20}x${Math.floor(Math.random() * 100) + 20}x${Math.floor(Math.random() * 50) + 10}cm`,
                            },
                        };
                        const newEquipment = await this.equipmentService.create(equipmentData);
                        equipment.push(newEquipment);
                        this.logger.log(`Équipement créé : ${newEquipment.type} - ${newEquipment.model} (${newEquipment.id})`);
                    }
                    catch (error) {
                        this.logger.error(`Erreur lors de la création de l'équipement pour le site ${site.id}: ${error.message}`);
                    }
                }
            }
        }
        return equipment;
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(site_entity_1.Site)),
    __param(1, (0, typeorm_1.InjectRepository)(equipment_entity_1.Equipment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        sites_service_1.SitesService,
        equipment_service_1.EquipmentService,
        departments_service_1.DepartmentsService,
        teams_service_1.TeamsService])
], SeedService);
//# sourceMappingURL=seed.service.js.map