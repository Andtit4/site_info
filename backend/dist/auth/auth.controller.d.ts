import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            firstName: any;
            lastName: any;
            email: any;
            isAdmin: any;
        };
    }>;
    getProfile(req: any): Promise<any>;
    createAdmin(createAdminDto: CreateAdminDto): Promise<{
        id: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        isAdmin: boolean;
        createdAt: Date;
    }>;
    setupInitialAdmin(createAdminDto: CreateAdminDto, setupKey: string): Promise<{
        message: string;
        admin: {
            id: string;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            isAdmin: boolean;
            createdAt: Date;
        };
    }>;
}
