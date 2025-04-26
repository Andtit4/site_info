import { Department } from './department.entity';
export declare class User {
    id: string;
    generateId(): void;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    isDepartmentAdmin: boolean;
    isActive: boolean;
    lastLogin: Date;
    department: Department;
    departmentId: string;
    createdAt: Date;
    updatedAt: Date;
}
