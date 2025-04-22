import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    private usersRepository;
    constructor(usersService: UsersService, jwtService: JwtService, usersRepository: Repository<User>);
    validateUser(username: string, password: string): Promise<any>;
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
    countAdmins(): Promise<number>;
}
