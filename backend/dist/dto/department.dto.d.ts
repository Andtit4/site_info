import { DepartmentType } from '../entities/department.entity';
import { EquipmentType } from '../entities/equipment.entity';
export declare class CreateDepartmentDto {
    name: string;
    type: DepartmentType;
    description?: string;
    responsibleName: string;
    contactEmail: string;
    contactPhone?: string;
    isActive?: boolean;
    managedEquipmentTypes?: EquipmentType[];
}
export declare class UpdateDepartmentDto {
    name?: string;
    type?: DepartmentType;
    description?: string;
    responsibleName?: string;
    contactEmail?: string;
    contactPhone?: string;
    isActive?: boolean;
    managedEquipmentTypes?: EquipmentType[];
}
export declare class DepartmentFilterDto {
    search?: string;
    type?: DepartmentType;
    isActive?: boolean;
    managesEquipmentType?: EquipmentType;
}
