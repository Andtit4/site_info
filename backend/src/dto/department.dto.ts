import { IsString, IsOptional, IsBoolean, IsEmail, IsNotEmpty, IsEnum, IsArray } from 'class-validator';
import { DepartmentType } from '../entities/department.entity';
import { EquipmentType } from '../entities/equipment.entity';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(DepartmentType)
  @IsNotEmpty()
  type: DepartmentType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  responsibleName: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
  
  @IsArray()
  @IsEnum(EquipmentType, { each: true })
  @IsOptional()
  managedEquipmentTypes?: EquipmentType[];
}

export class UpdateDepartmentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(DepartmentType)
  @IsOptional()
  type?: DepartmentType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  responsibleName?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
  
  @IsArray()
  @IsEnum(EquipmentType, { each: true })
  @IsOptional()
  managedEquipmentTypes?: EquipmentType[];
}

export class DepartmentFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(DepartmentType)
  @IsOptional()
  type?: DepartmentType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
  
  @IsEnum(EquipmentType)
  @IsOptional()
  managesEquipmentType?: EquipmentType;
} 