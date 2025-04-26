export declare class CreateDepartmentUserDto {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    departmentId: string;
}
export declare class ChangePasswordDto {
    password: string;
}
export declare class UpdateProfileDto {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}
