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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentFilterDto = exports.UpdateDepartmentDto = exports.CreateDepartmentDto = void 0;
const class_validator_1 = require("class-validator");
const department_entity_1 = require("../entities/department.entity");
const equipment_entity_1 = require("../entities/equipment.entity");
class CreateDepartmentDto {
    constructor() {
        this.isActive = true;
    }
}
exports.CreateDepartmentDto = CreateDepartmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(department_entity_1.DepartmentType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "responsibleName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "contactEmail", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDepartmentDto.prototype, "contactPhone", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDepartmentDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(equipment_entity_1.EquipmentType, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateDepartmentDto.prototype, "managedEquipmentTypes", void 0);
class UpdateDepartmentDto {
}
exports.UpdateDepartmentDto = UpdateDepartmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(department_entity_1.DepartmentType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "responsibleName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "contactEmail", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDepartmentDto.prototype, "contactPhone", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateDepartmentDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(equipment_entity_1.EquipmentType, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateDepartmentDto.prototype, "managedEquipmentTypes", void 0);
class DepartmentFilterDto {
}
exports.DepartmentFilterDto = DepartmentFilterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentFilterDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(department_entity_1.DepartmentType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentFilterDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DepartmentFilterDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(equipment_entity_1.EquipmentType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentFilterDto.prototype, "managesEquipmentType", void 0);
//# sourceMappingURL=department.dto.js.map