import { UsersService } from './users.service';
import { CreateDepartmentUserDto, ChangePasswordDto, UpdateProfileDto } from '../dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createDepartmentUser(createDepartmentUserDto: CreateDepartmentUserDto): Promise<{
        id: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        departmentId: string;
        isDepartmentAdmin: boolean;
        createdAt: Date;
    }>;
    checkUsernameAvailability(username: string, req: any): Promise<{
        available: boolean;
    }>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
        success: boolean;
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        isAdmin: boolean;
        departmentId: string;
        isDepartmentAdmin: boolean;
        updatedAt: Date;
    }>;
}
