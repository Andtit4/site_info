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
exports.Equipment = exports.EquipmentStatus = exports.EquipmentType = void 0;
const typeorm_1 = require("typeorm");
const site_entity_1 = require("./site.entity");
const department_entity_1 = require("./department.entity");
const team_entity_1 = require("../teams/entities/team.entity");
var EquipmentType;
(function (EquipmentType) {
    EquipmentType["ANTENNA"] = "ANTENNE";
    EquipmentType["ROUTER"] = "ROUTEUR";
    EquipmentType["BATTERY"] = "BATTERIE";
    EquipmentType["GENERATOR"] = "G\u00C9N\u00C9RATEUR";
    EquipmentType["COOLING"] = "REFROIDISSEMENT";
    EquipmentType["SHELTER"] = "SHELTER";
    EquipmentType["TOWER"] = "PYL\u00D4NE";
    EquipmentType["SECURITY"] = "S\u00C9CURIT\u00C9";
})(EquipmentType || (exports.EquipmentType = EquipmentType = {}));
var EquipmentStatus;
(function (EquipmentStatus) {
    EquipmentStatus["ACTIVE"] = "ACTIF";
    EquipmentStatus["MAINTENANCE"] = "MAINTENANCE";
    EquipmentStatus["INACTIVE"] = "INACTIF";
    EquipmentStatus["PLANNED"] = "PLANIFI\u00C9";
    EquipmentStatus["UNDER_INSTALLATION"] = "EN_INSTALLATION";
})(EquipmentStatus || (exports.EquipmentStatus = EquipmentStatus = {}));
let Equipment = class Equipment {
};
exports.Equipment = Equipment;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Equipment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255
    }),
    __metadata("design:type", String)
], Equipment.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Equipment.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Equipment.prototype, "manufacturer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Equipment.prototype, "serialNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Equipment.prototype, "installDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Equipment.prototype, "lastMaintenanceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        default: EquipmentStatus.ACTIVE
    }),
    __metadata("design:type", String)
], Equipment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], Equipment.prototype, "specifications", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => site_entity_1.Site, site => site.equipment, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'siteId' }),
    __metadata("design:type", site_entity_1.Site)
], Equipment.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Equipment.prototype, "siteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_entity_1.Department, department => department.equipment),
    (0, typeorm_1.JoinColumn)({ name: 'departmentId' }),
    __metadata("design:type", department_entity_1.Department)
], Equipment.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Equipment.prototype, "departmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => team_entity_1.Team, team => team.equipment),
    (0, typeorm_1.JoinTable)({
        name: 'team_equipment',
        joinColumn: {
            name: 'equipmentId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'teamId',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Equipment.prototype, "teams", void 0);
exports.Equipment = Equipment = __decorate([
    (0, typeorm_1.Entity)()
], Equipment);
//# sourceMappingURL=equipment.entity.js.map