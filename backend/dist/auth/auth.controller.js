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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const users_service_1 = require("../users/users.service");
const admin_guard_1 = require("./guards/admin.guard");
let AuthController = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async getProfile(req) {
        return req.user;
    }
    async createAdmin(createAdminDto) {
        const admin = await this.usersService.createAdmin(createAdminDto);
        return {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            isAdmin: admin.isAdmin,
            createdAt: admin.createdAt
        };
    }
    async setupInitialAdmin(createAdminDto, setupKey) {
        const expectedSetupKey = process.env.ADMIN_SETUP_KEY;
        if (!expectedSetupKey || setupKey !== expectedSetupKey) {
            throw new Error('Clé de configuration invalide ou manquante');
        }
        const adminsCount = await this.authService.countAdmins();
        if (adminsCount > 0) {
            throw new Error('Un administrateur existe déjà. Utilisez la route protégée pour créer des administrateurs supplémentaires.');
        }
        const admin = await this.usersService.createAdmin(createAdminDto);
        return {
            message: 'Administrateur initial créé avec succès',
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
                isAdmin: admin.isAdmin,
                createdAt: admin.createdAt
            }
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Post)('admin/create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Post)('setup/admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('setupKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setupInitialAdmin", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map