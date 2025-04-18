import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UsersService } from '../users/users.service';
import { AdminGuard } from './guards/admin.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/create')
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
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

  @Post('setup/admin')
  @HttpCode(HttpStatus.CREATED)
  async setupInitialAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @Query('setupKey') setupKey: string
  ) {
    // Vérifier la clé de configuration
    const expectedSetupKey = process.env.ADMIN_SETUP_KEY;
    if (!expectedSetupKey || setupKey !== expectedSetupKey) {
      throw new Error('Clé de configuration invalide ou manquante');
    }

    // Vérifier si des administrateurs existent déjà
    const adminsCount = await this.authService.countAdmins();
    if (adminsCount > 0) {
      throw new Error('Un administrateur existe déjà. Utilisez la route protégée pour créer des administrateurs supplémentaires.');
    }

    // Créer le premier administrateur
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
} 