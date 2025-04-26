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
const core_1 = require("@nestjs/core");
let TeamsService = class TeamsService {
    constructor(teamsRepository, departmentsService, request) {
        this.teamsRepository = teamsRepository;
        this.departmentsService = departmentsService;
        this.request = request;
    }
    getCurrentUser() {
        return this.request.user;
    }
    applyDepartmentFilter(query) {
        const user = this.getCurrentUser();
        if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
            if (query.where && typeof query.where === 'object') {
                query.where.departmentId = user.departmentId;
            }
            else {
                query.where = { departmentId: user.departmentId };
            }
        }
        return query;
    }
    async create(createTeamDto) {
        const user = this.getCurrentUser();
        if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
            createTeamDto.departmentId = user.departmentId;
        }
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
        const user = this.getCurrentUser();
        if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
            where.departmentId = user.departmentId;
        }
        if (search) {
            const searchQuery = [
                { name: (0, typeorm_2.Like)(`%${search}%`) },
                { description: (0, typeorm_2.Like)(`%${search}%`) },
                { leadName: (0, typeorm_2.Like)(`%${search}%`) },
                { location: (0, typeorm_2.Like)(`%${search}%`) }
            ];
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
    async findByDepartment(departmentId) {
        const user = this.getCurrentUser();
        if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId && user.departmentId !== departmentId) {
            throw new common_1.NotFoundException(`Département avec l'ID ${departmentId} introuvable ou accès non autorisé`);
        }
        return this.teamsRepository.find({
            where: { departmentId },
            relations: ['department', 'sites'],
        });
    }
    async findByEquipmentType(equipmentType) {
        const query = {
            where: { equipmentType },
            relations: ['department', 'sites'],
        };
        return this.teamsRepository.find(this.applyDepartmentFilter(query));
    }
    async findOne(id) {
        const team = await this.teamsRepository.findOne({
            where: { id },
            relations: ['department', 'sites'],
        });
        if (!team) {
            throw new common_1.NotFoundException(`Équipe avec l'ID ${id} introuvable`);
        }
        const user = this.getCurrentUser();
        if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId && team.departmentId !== user.departmentId) {
            throw new common_1.NotFoundException(`Équipe avec l'ID ${id} introuvable ou accès non autorisé`);
        }
        return team;
    }
    async update(id, updateTeamDto) {
        const team = await this.findOne(id);
        const user = this.getCurrentUser();
        if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
            if (team.departmentId !== user.departmentId) {
                throw new common_1.NotFoundException(`Équipe avec l'ID ${id} introuvable ou accès non autorisé`);
            }
            if (updateTeamDto.departmentId && updateTeamDto.departmentId !== user.departmentId) {
                throw new common_1.ConflictException(`Vous ne pouvez pas changer le département de cette équipe`);
            }
            updateTeamDto.departmentId = user.departmentId;
        }
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
        const team = await this.findOne(id);
        await this.teamsRepository.remove(team);
    }
    async getStatistics() {
        const user = this.getCurrentUser();
        let queryBuilder = this.teamsRepository.createQueryBuilder('team');
        if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
            queryBuilder = queryBuilder.where('team.departmentId = :departmentId', { departmentId: user.departmentId });
        }
        const totalTeams = await queryBuilder.getCount();
        queryBuilder = this.teamsRepository.createQueryBuilder('team');
        if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
            queryBuilder = queryBuilder.where('team.departmentId = :departmentId', { departmentId: user.departmentId });
        }
        const activeTeams = await queryBuilder.andWhere('team.status = :status', { status: team_entity_1.TeamStatus.ACTIVE }).getCount();
        queryBuilder = this.teamsRepository.createQueryBuilder('team');
        if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
            queryBuilder = queryBuilder.where('team.departmentId = :departmentId', { departmentId: user.departmentId });
        }
        const standbyTeams = await queryBuilder.andWhere('team.status = :status', { status: team_entity_1.TeamStatus.STANDBY }).getCount();
        queryBuilder = this.teamsRepository.createQueryBuilder('team');
        if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
            queryBuilder = queryBuilder.where('team.departmentId = :departmentId', { departmentId: user.departmentId });
        }
        const inactiveTeams = await queryBuilder.andWhere('team.status = :status', { status: team_entity_1.TeamStatus.INACTIVE }).getCount();
        let teamsByDepartment = [];
        if (user && user.isDepartmentAdmin && !user.isAdmin && user.departmentId) {
            const department = await this.departmentsService.findOne(user.departmentId);
            teamsByDepartment = [{
                    departmentName: department.name,
                    count: totalTeams
                }];
        }
        else {
            teamsByDepartment = await this.teamsRepository
                .createQueryBuilder('team')
                .select('department.name', 'departmentName')
                .addSelect('COUNT(team.id)', 'count')
                .leftJoin('team.department', 'department')
                .groupBy('department.name')
                .getRawMany();
        }
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
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __param(2, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        departments_service_1.DepartmentsService, Object])
], TeamsService);
//# sourceMappingURL=teams.service.js.map