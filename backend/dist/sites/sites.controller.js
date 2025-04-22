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
exports.SitesController = void 0;
const common_1 = require("@nestjs/common");
const sites_service_1 = require("./sites.service");
const site_dto_1 = require("../dto/site.dto");
const swagger_1 = require("@nestjs/swagger");
let SitesController = class SitesController {
    constructor(sitesService) {
        this.sitesService = sitesService;
    }
    create(createSiteDto) {
        return this.sitesService.create(createSiteDto);
    }
    findAll(filterDto) {
        return this.sitesService.findAll(filterDto);
    }
    getStatistics() {
        return this.sitesService.getStatistics();
    }
    findOne(id) {
        return this.sitesService.findOne(id);
    }
    update(id, updateSiteDto) {
        return this.sitesService.update(id, updateSiteDto);
    }
    remove(id) {
        return this.sitesService.remove(id);
    }
    async assignTeams(id, body) {
        return this.sitesService.assignTeams(id, body.teamIds);
    }
    async removeTeams(id, body) {
        return this.sitesService.removeTeams(id, body.teamIds);
    }
    async getSiteTeams(id) {
        return this.sitesService.getSiteTeams(id);
    }
};
exports.SitesController = SitesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [site_dto_1.CreateSiteDto]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [site_dto_1.SiteFilterDto]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, site_dto_1.UpdateSiteDto]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/teams'),
    (0, swagger_1.ApiOperation)({ summary: 'Assigner des equipes à un site' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'equipes assignees avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Site ou equipe non trouve' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "assignTeams", null);
__decorate([
    (0, common_1.Delete)(':id/teams'),
    (0, swagger_1.ApiOperation)({ summary: 'Retirer des equipes d\'un site' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'equipes retirees avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Site non trouve' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "removeTeams", null);
__decorate([
    (0, common_1.Get)(':id/teams'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les equipes d\'un site' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des equipes du site' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Site non trouve' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "getSiteTeams", null);
exports.SitesController = SitesController = __decorate([
    (0, swagger_1.ApiTags)('sites'),
    (0, common_1.Controller)('sites'),
    __metadata("design:paramtypes", [sites_service_1.SitesService])
], SitesController);
//# sourceMappingURL=sites.controller.js.map