import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Department } from '../entities/department.entity';
import { CreateAdminDto } from '../auth/dto/create-admin.dto';
import { CreateDepartmentUserDto, UpdateProfileDto } from '../dto/users.dto';
import { EmailService } from '../services/email.service';
export declare class UsersService {
    private usersRepository;
    private departmentsRepository;
    private emailService;
    private readonly logger;
    constructor(usersRepository: Repository<User>, departmentsRepository: Repository<Department>, emailService: EmailService);
    findOneByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<User>;
    create(username: string, password: string): Promise<User>;
    createAdmin(createAdminDto: CreateAdminDto): Promise<User>;
    createDepartmentUser(createDepartmentUserDto: CreateDepartmentUserDto): Promise<User>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User>;
    isUsernameAvailable(username: string, currentUserId?: string): Promise<boolean>;
    changePassword(userId: string, newPassword: string): Promise<boolean>;
}
