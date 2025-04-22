import { Department } from '../../entities/department.entity';
import { Site } from '../../entities/site.entity';
import { Equipment } from '../../entities/equipment.entity';
export declare enum TeamStatus {
    ACTIVE = "ACTIVE",
    STANDBY = "STANDBY",
    INACTIVE = "INACTIVE"
}
export declare class Team {
    id: string;
    name: string;
    description: string;
    status: string;
    leadName: string;
    leadContact: string;
    memberCount: number;
    location: string;
    createdAt: Date;
    lastActiveDate: Date;
    metadata: Record<string, any>;
    equipmentType: string;
    department: Department;
    departmentId: string;
    sites: Site[];
    equipment: Equipment[];
}
