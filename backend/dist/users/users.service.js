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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const department_entity_1 = require("../entities/department.entity");
const bcrypt = require("bcrypt");
const email_service_1 = require("../services/email.service");
const common_2 = require("@nestjs/common");
let UsersService = UsersService_1 = class UsersService {
    constructor(usersRepository, departmentsRepository, emailService) {
        this.usersRepository = usersRepository;
        this.departmentsRepository = departmentsRepository;
        this.emailService = emailService;
        this.logger = new common_2.Logger(UsersService_1.name);
    }
    async findOneByUsername(username) {
        return this.usersRepository.findOne({ where: { username } });
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
        }
        return user;
    }
    async create(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({ username, password: hashedPassword });
        return this.usersRepository.save(user);
    }
    async createAdmin(createAdminDto) {
        try {
            const { username, password, email, firstName, lastName } = createAdminDto;
            const existingUser = await this.findOneByUsername(username);
            if (existingUser) {
                throw new common_1.ConflictException(`L'utilisateur avec le nom d'utilisateur ${username} existe déjà`);
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = this.usersRepository.create({
                username,
                password: hashedPassword,
                email,
                firstName,
                lastName,
                isAdmin: true,
            });
            return await this.usersRepository.save(admin);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Erreur lors de la création de l\'administrateur');
        }
    }
    async createDepartmentUser(createDepartmentUserDto) {
        try {
            const { username, password, email, firstName, lastName, departmentId } = createDepartmentUserDto;
            const existingUser = await this.findOneByUsername(username);
            if (existingUser) {
                throw new common_1.ConflictException(`L'utilisateur avec le nom d'utilisateur ${username} existe déjà`);
            }
            const department = await this.departmentsRepository.findOne({ where: { id: departmentId } });
            if (!department) {
                throw new common_1.NotFoundException(`Le département avec l'ID ${departmentId} n'existe pas`);
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const departmentUser = this.usersRepository.create({
                username,
                password: hashedPassword,
                email,
                firstName,
                lastName,
                departmentId,
                isDepartmentAdmin: true,
                isAdmin: false,
            });
            const savedUser = await this.usersRepository.save(departmentUser);
            await this.emailService.sendCredentialsEmail(email, username, password, firstName, lastName, true);
            return savedUser;
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Erreur lors de la création de l\'utilisateur du département');
        }
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.findById(userId);
        if (updateProfileDto.username && updateProfileDto.username !== user.username) {
            const existingUser = await this.findOneByUsername(updateProfileDto.username);
            if (existingUser) {
                throw new common_1.ConflictException(`L'utilisateur avec le nom d'utilisateur ${updateProfileDto.username} existe déjà`);
            }
        }
        Object.assign(user, updateProfileDto);
        return this.usersRepository.save(user);
    }
    async isUsernameAvailable(username, currentUserId) {
        const query = this.usersRepository.createQueryBuilder('user')
            .where('user.username = :username', { username });
        if (currentUserId) {
            query.andWhere('user.id != :currentUserId', { currentUserId });
        }
        const count = await query.getCount();
        return count === 0;
    }
    async changePassword(userId, newPassword) {
        try {
            if (!newPassword || newPassword.trim() === '') {
                throw new Error('Le mot de passe ne peut pas être vide');
            }
            const user = await this.findById(userId);
            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                return true;
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await this.usersRepository.save(user);
            if (user.email) {
                try {
                    await this.emailService.sendPasswordChangedEmail(user.email, user.username, user.firstName, user.lastName);
                }
                catch (emailError) {
                    this.logger.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
                }
            }
            return true;
        }
        catch (error) {
            this.logger.error(`Erreur lors du changement de mot de passe: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Erreur lors du changement de mot de passe');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], UsersService);
//# sourceMappingURL=users.service.js.map