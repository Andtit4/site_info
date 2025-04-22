import { Department } from '../entities/team.entity';
export declare class CreateTeamDto {
    name: string;
    department: Department;
    members?: number;
    leader?: string;
}
