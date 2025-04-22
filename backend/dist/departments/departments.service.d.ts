import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentFilterDto } from '../dto/department.dto';
export declare class DepartmentsService {
    private departmentsRepository;
    private readonly logger;
    constructor(departmentsRepository: Repository<Department>);
    create(createDepartmentDto: CreateDepartmentDto): Promise<Department>;
    findAll(filterDto?: DepartmentFilterDto): Promise<Department[]>;
    findOne(id: string): Promise<Department>;
    update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department>;
    remove(id: string): Promise<void>;
    getStatistics(): Promise<{
        totalDepartments: number;
        activeDepartments: number;
        departmentsByType: any[];
        equipmentCountByDepartment: any[];
    }>;
}
