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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const team_entity_1 = require("./entities/team.entity");
const departments_service_1 = require("../departments/departments.service");
let TeamsService = class TeamsService {
    constructor(teamsRepository, departmentsService) {
        this.teamsRepository = teamsRepository;
        this.departmentsService = departmentsService;
    }
    async create(createTeamDto) {
        if (createTeamDto.departmentId) {
            const department = await this.departmentsService.findOne(createTeamDto.departmentId);
            if (!department) {
                throw new common_1.NotFoundException(`Département avec l'ID ${createTeamDto.departmentId} introuvable`);
            }
        }
        const team = this.teamsRepository.create({
            id: (0, uuid_1.v4)(),
            ...createTeamDto,
            createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        });
        try {
            return await this.teamsRepository.save(team);
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new common_1.ConflictException('Une équipe avec ce nom existe déjà');
            }
            throw error;
        }
    }
    async findAll(filterDto) {
        const { status, departmentId, equipmentType, search } = filterDto || {};
        const where = {};
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
                    { name: (0, typeorm_2.Like)(`%${search}%`) },
                    { description: (0, typeorm_2.Like)(`%${search}%`) },
                    { leadName: (0, typeorm_2.Like)(`%${search}%`) },
                    { location: (0, typeorm_2.Like)(`%${search}%`) }
                ],
                relations: ['department', 'sites'],
            });
        }
        return this.teamsRepository.find({
            where,
            relations: ['department', 'sites'],
        });
    }
    async findByDepartment(departmentId) {
        return this.teamsRepository.find({
            where: { departmentId },
            relations: ['department', 'sites'],
        });
    }
    async findByEquipmentType(equipmentType) {
        return this.teamsRepository.find({
            where: { equipmentType },
            relations: ['department', 'sites'],
        });
    }
    async findOne(id) {
        const team = await this.teamsRepository.findOne({
            where: { id },
            relations: ['department', 'sites'],
        });
        if (!team) {
            throw new common_1.NotFoundException(`Équipe avec l'ID ${id} introuvable`);
        }
        return team;
    }
    async update(id, updateTeamDto) {
        const team = await this.findOne(id);
        if (updateTeamDto.departmentId) {
            const department = await this.departmentsService.findOne(updateTeamDto.departmentId);
            if (!department) {
                throw new common_1.NotFoundException(`Département avec l'ID ${updateTeamDto.departmentId} introuvable`);
            }
        }
        Object.assign(team, updateTeamDto);
        return this.teamsRepository.save(team);
    }
    async remove(id) {
        const result = await this.teamsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Équipe avec l'ID ${id} introuvable`);
        }
    }
    async getStatistics() {
        const totalTeams = await this.teamsRepository.count();
        const activeTeams = await this.teamsRepository.count({ where: { status: team_entity_1.TeamStatus.ACTIVE } });
        const standbyTeams = await this.teamsRepository.count({ where: { status: team_entity_1.TeamStatus.STANDBY } });
        const inactiveTeams = await this.teamsRepository.count({ where: { status: team_entity_1.TeamStatus.INACTIVE } });
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
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        departments_service_1.DepartmentsService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map