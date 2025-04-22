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
var DepartmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const department_entity_1 = require("../entities/department.entity");
let DepartmentsService = DepartmentsService_1 = class DepartmentsService {
    constructor(departmentsRepository) {
        this.departmentsRepository = departmentsRepository;
        this.logger = new common_1.Logger(DepartmentsService_1.name);
    }
    async create(createDepartmentDto) {
        try {
            const existingDepartment = await this.departmentsRepository.findOne({
                where: { name: createDepartmentDto.name },
            });
            if (existingDepartment) {
                throw new common_1.ConflictException(`Un département avec le nom '${createDepartmentDto.name}' existe déjà`);
            }
            if (createDepartmentDto.managedEquipmentTypes && Array.isArray(createDepartmentDto.managedEquipmentTypes)) {
                createDepartmentDto.managedEquipmentTypes = createDepartmentDto.managedEquipmentTypes.join(',');
            }
            const department = this.departmentsRepository.create(createDepartmentDto);
            this.logger.log(`Création d'un nouveau département: ${department.name}`);
            const savedDepartment = await this.departmentsRepository.save(department);
            if (savedDepartment.managedEquipmentTypes && typeof savedDepartment.managedEquipmentTypes === 'string') {
                savedDepartment.managedEquipmentTypes = savedDepartment.managedEquipmentTypes
                    .split(',')
                    .filter(type => type)
                    .map(type => type);
            }
            return savedDepartment;
        }
        catch (error) {
            this.logger.error(`Erreur lors de la création du département: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findAll(filterDto = {}) {
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
                query.andWhere('(department.name LIKE :search OR department.description LIKE :search OR department.responsibleName LIKE :search)', { search: `%${search}%` });
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
            departments.forEach(department => {
                if (department.managedEquipmentTypes && typeof department.managedEquipmentTypes === 'string') {
                    department.managedEquipmentTypes = department.managedEquipmentTypes
                        .split(',')
                        .filter(type => type)
                        .map(type => type);
                }
            });
            this.logger.log(`Récupération de ${departments.length} départements`);
            return departments;
        }
        catch (error) {
            this.logger.error(`Erreur lors de la récupération des départements: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const department = await this.departmentsRepository.findOne({
                where: { id },
                relations: ['equipment', 'teams'],
            });
            if (!department) {
                throw new common_1.NotFoundException(`Département avec ID "${id}" non trouvé`);
            }
            if (department.managedEquipmentTypes && typeof department.managedEquipmentTypes === 'string') {
                department.managedEquipmentTypes = department.managedEquipmentTypes
                    .split(',')
                    .filter(type => type)
                    .map(type => type);
            }
            return department;
        }
        catch (error) {
            this.logger.error(`Erreur lors de la récupération du département ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async update(id, updateDepartmentDto) {
        try {
            const department = await this.findOne(id);
            if (updateDepartmentDto.name && updateDepartmentDto.name !== department.name) {
                const existingDepartment = await this.departmentsRepository.findOne({
                    where: { name: updateDepartmentDto.name },
                });
                if (existingDepartment) {
                    throw new common_1.ConflictException(`Un département avec le nom '${updateDepartmentDto.name}' existe déjà`);
                }
            }
            if (updateDepartmentDto.managedEquipmentTypes && Array.isArray(updateDepartmentDto.managedEquipmentTypes)) {
                updateDepartmentDto.managedEquipmentTypes = updateDepartmentDto.managedEquipmentTypes.join(',');
            }
            Object.assign(department, updateDepartmentDto);
            this.logger.log(`Mise à jour du département: ${department.name}`);
            const savedDepartment = await this.departmentsRepository.save(department);
            if (savedDepartment.managedEquipmentTypes && typeof savedDepartment.managedEquipmentTypes === 'string') {
                savedDepartment.managedEquipmentTypes = savedDepartment.managedEquipmentTypes
                    .split(',')
                    .filter(type => type)
                    .map(type => type);
            }
            return savedDepartment;
        }
        catch (error) {
            this.logger.error(`Erreur lors de la mise à jour du département ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async remove(id) {
        try {
            const department = await this.findOne(id);
            if ((department.equipment && department.equipment.length > 0) ||
                (department.teams && department.teams.length > 0)) {
                throw new common_1.ConflictException(`Impossible de supprimer le département car il contient des équipements ou des équipes`);
            }
            await this.departmentsRepository.remove(department);
            this.logger.log(`Département supprimé: ${department.name}`);
        }
        catch (error) {
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
        }
        catch (error) {
            this.logger.error(`Erreur lors de la récupération des statistiques: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = DepartmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map