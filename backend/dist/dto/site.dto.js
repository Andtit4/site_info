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
exports.SiteFilterDto = exports.UpdateSiteDto = exports.CreateSiteDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const site_entity_1 = require("../entities/site.entity");
const equipment_dto_1 = require("./equipment.dto");
class CreateSiteDto {
    constructor() {
        this.status = site_entity_1.SiteStatus.ACTIVE;
    }
}
exports.CreateSiteDto = CreateSiteDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "region", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreateSiteDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreateSiteDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(site_entity_1.SiteStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "oldBase", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "newBase", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => equipment_dto_1.CreateEquipmentDto),
    __metadata("design:type", Array)
], CreateSiteDto.prototype, "equipment", void 0);
class UpdateSiteDto {
}
exports.UpdateSiteDto = UpdateSiteDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSiteDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSiteDto.prototype, "region", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLongitude)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSiteDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLatitude)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSiteDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(site_entity_1.SiteStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSiteDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSiteDto.prototype, "oldBase", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSiteDto.prototype, "newBase", void 0);
class SiteFilterDto {
}
exports.SiteFilterDto = SiteFilterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SiteFilterDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SiteFilterDto.prototype, "region", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(site_entity_1.SiteStatus, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SiteFilterDto.prototype, "status", void 0);
//# sourceMappingURL=site.dto.js.map