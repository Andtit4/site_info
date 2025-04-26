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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const users_dto_1 = require("../dto/users.dto");
const swagger_1 = require("@nestjs/swagger");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async createDepartmentUser(createDepartmentUserDto) {
        const user = await this.usersService.createDepartmentUser(createDepartmentUserDto);
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            departmentId: user.departmentId,
            isDepartmentAdmin: user.isDepartmentAdmin,
            createdAt: user.createdAt
        };
    }
    async checkUsernameAvailability(username, req) {
        const currentUser = req.user ? req.user.id : null;
        const available = await this.usersService.isUsernameAvailable(username, currentUser);
        return { available };
    }
    async changePassword(req, changePasswordDto) {
        if (!changePasswordDto.password || changePasswordDto.password.trim() === '') {
            throw new common_1.BadRequestException('Le mot de passe ne peut pas être vide');
        }
        const success = await this.usersService.changePassword(req.user.id, changePasswordDto.password);
        if (!success) {
            throw new common_1.InternalServerErrorException('Erreur lors du changement de mot de passe');
        }
        return {
            message: 'Mot de passe modifié avec succès',
            success: true
        };
    }
    async updateProfile(req, updateProfileDto) {
        const user = await this.usersService.updateProfile(req.user.id, updateProfileDto);
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
            departmentId: user.departmentId,
            isDepartmentAdmin: user.isDepartmentAdmin,
            updatedAt: user.updatedAt
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Créer un utilisateur département', description: 'Permet à un administrateur de créer un utilisateur lié à un département' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Utilisateur département créé avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé - Token JWT manquant ou invalide' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Interdit - L\'utilisateur n\'est pas administrateur' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Post)('department'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.CreateDepartmentUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createDepartmentUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Vérifier la disponibilité d\'un nom d\'utilisateur', description: 'Vérifie si un nom d\'utilisateur est disponible' }),
    (0, swagger_1.ApiQuery)({ name: 'username', description: 'Le nom d\'utilisateur à vérifier', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Résultat de la vérification', type: 'object', schema: { properties: { available: { type: 'boolean' } } } }),
    (0, common_1.Get)('check-username'),
    __param(0, (0, common_1.Query)('username')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkUsernameAvailability", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Changer le mot de passe', description: 'Permet à un utilisateur de changer son mot de passe' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mot de passe changé avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé - Token JWT manquant ou invalide' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Requête invalide - Le mot de passe est requis' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('change-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, users_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour le profil', description: 'Permet à un utilisateur de mettre à jour son profil' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profil mis à jour avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé - Token JWT manquant ou invalide' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, users_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map