import { Controller, Get, Post, Body, Param, Delete, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentFilterDto } from '../dto/department.dto';
import { Department } from '../entities/department.entity';
import { EquipmentType } from '../entities/equipment.entity';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() filterDto: DepartmentFilterDto): Promise<Department[]> {
    return this.departmentsService.findAll(filterDto);
  }

  @Get('statistics')
  getStatistics() {
    return this.departmentsService.getStatistics();
  }

  @Get('equipment-type/:type')
  findByEquipmentType(@Param('type') type: EquipmentType): Promise<Department[]> {
    const filterDto: DepartmentFilterDto = { managesEquipmentType: type };
    return this.departmentsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentsService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.departmentsService.remove(id);
  }
} 