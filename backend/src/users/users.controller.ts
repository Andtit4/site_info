import { Controller, Post, Body, Patch, Param, Get, UseGuards, Request, HttpStatus, HttpCode, Query, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateDepartmentUserDto, ChangePasswordDto, UpdateProfileDto } from '../dto/users.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Créer un utilisateur département', description: 'Permet à un administrateur de créer un utilisateur lié à un département' })
  @ApiResponse({ status: 201, description: 'Utilisateur département créé avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Interdit - L\'utilisateur n\'est pas administrateur' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('department')
  async createDepartmentUser(@Body() createDepartmentUserDto: CreateDepartmentUserDto) {
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

  @ApiOperation({ summary: 'Vérifier la disponibilité d\'un nom d\'utilisateur', description: 'Vérifie si un nom d\'utilisateur est disponible' })
  @ApiQuery({ name: 'username', description: 'Le nom d\'utilisateur à vérifier', required: true })
  @ApiResponse({ status: 200, description: 'Résultat de la vérification', type: 'object', schema: { properties: { available: { type: 'boolean' } } } })
  @Get('check-username')
  async checkUsernameAvailability(@Query('username') username: string, @Request() req) {
    // Si l'utilisateur est connecté, on exclut son propre nom d'utilisateur de la vérification
    const currentUser = req.user ? req.user.id : null;
    
    const available = await this.usersService.isUsernameAvailable(username, currentUser);
    return { available };
  }

  @ApiOperation({ summary: 'Changer le mot de passe', description: 'Permet à un utilisateur de changer son mot de passe' })
  @ApiResponse({ status: 200, description: 'Mot de passe changé avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 400, description: 'Requête invalide - Le mot de passe est requis' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    if (!changePasswordDto.password || changePasswordDto.password.trim() === '') {
      throw new BadRequestException('Le mot de passe ne peut pas être vide');
    }
    
    const success = await this.usersService.changePassword(req.user.id, changePasswordDto.password);
    
    if (!success) {
      throw new InternalServerErrorException('Erreur lors du changement de mot de passe');
    }
    
    return { 
      message: 'Mot de passe modifié avec succès',
      success: true
    };
  }

  @ApiOperation({ summary: 'Mettre à jour le profil', description: 'Permet à un utilisateur de mettre à jour son profil' })
  @ApiResponse({ status: 200, description: 'Profil mis à jour avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT manquant ou invalide' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
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
} 