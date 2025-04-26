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
exports.EquipmentController = void 0;
const common_1 = require("@nestjs/common");
const equipment_service_1 = require("./equipment.service");
const equipment_dto_1 = require("../dto/equipment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const department_admin_guard_1 = require("../auth/guards/department-admin.guard");
const swagger_1 = require("@nestjs/swagger");
let EquipmentController = class EquipmentController {
    constructor(equipmentService) {
        this.equipmentService = equipmentService;
    }
    create(createEquipmentDto) {
        return this.equipmentService.create(createEquipmentDto);
    }
    findAll(filterDto) {
        return this.equipmentService.findAll(filterDto);
    }
    getStatistics() {
        return this.equipmentService.getStatistics();
    }
    findOne(id) {
        return this.equipmentService.findOne(id);
    }
    update(id, updateEquipmentDto) {
        return this.equipmentService.update(id, updateEquipmentDto);
    }
    remove(id) {
        return this.equipmentService.remove(id);
    }
};
exports.EquipmentController = EquipmentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(department_admin_guard_1.DepartmentAdminGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [equipment_dto_1.CreateEquipmentDto]),
    __metadata("design:returntype", void 0)
], EquipmentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(department_admin_guard_1.DepartmentAdminGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [equipment_dto_1.EquipmentFilterDto]),
    __metadata("design:returntype", void 0)
], EquipmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, common_1.UseGuards)(department_admin_guard_1.DepartmentAdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EquipmentController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(department_admin_guard_1.DepartmentAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EquipmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(department_admin_guard_1.DepartmentAdminGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, equipment_dto_1.UpdateEquipmentDto]),
    __metadata("design:returntype", void 0)
], EquipmentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(department_admin_guard_1.DepartmentAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EquipmentController.prototype, "remove", null);
exports.EquipmentController = EquipmentController = __decorate([
    (0, swagger_1.ApiTags)('equipment'),
    (0, common_1.Controller)('equipment'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [equipment_service_1.EquipmentService])
], EquipmentController);
//# sourceMappingURL=equipment.controller.js.map