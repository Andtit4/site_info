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
exports.CreateAdminDto = void 0;
const class_validator_1 = require("class-validator");
class CreateAdminDto {
}
exports.CreateAdminDto = CreateAdminDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom d\'utilisateur est requis' }),
    (0, class_validator_1.IsString)({ message: 'Le nom d\'utilisateur doit être une chaîne de caractères' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Le mot de passe est requis' }),
    (0, class_validator_1.IsString)({ message: 'Le mot de passe doit être une chaîne de caractères' }),
    (0, class_validator_1.MinLength)(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'L\'email doit être valide' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'email est requis' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le prénom doit être une chaîne de caractères' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le prénom est requis' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le nom doit être une chaîne de caractères' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom est requis' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "lastName", void 0);
//# sourceMappingURL=create-admin.dto.js.map