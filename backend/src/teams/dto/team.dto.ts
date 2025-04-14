import { IsEnum, IsString, IsOptional, IsNumber, IsObject, IsNotEmpty, IsUUID } from 'class-validator';
import { TeamStatus } from '../entities/team.entity';
import { EquipmentType } from '../../entities/equipment.entity';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TeamStatus)
  @IsOptional()
  status?: TeamStatus;

  @IsString()
  @IsOptional()
  leadName?: string;

  @IsString()
  @IsOptional()
  leadContact?: string;

  @IsNumber()
  @IsOptional()
  memberCount?: number = 0;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  lastActiveDate?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsEnum(EquipmentType)
  @IsOptional()
  equipmentType?: EquipmentType;

  @IsUUID()
  @IsOptional()
  departmentId?: string;
}

export class UpdateTeamDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TeamStatus)
  @IsOptional()
  status?: TeamStatus;

  @IsString()
  @IsOptional()
  leadName?: string;

  @IsString()
  @IsOptional()
  leadContact?: string;

  @IsNumber()
  @IsOptional()
  memberCount?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  lastActiveDate?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsEnum(EquipmentType)
  @IsOptional()
  equipmentType?: EquipmentType;

  @IsUUID()
  @IsOptional()
  departmentId?: string;
}

export class TeamFilterDto {
  @IsOptional()
  @IsEnum(TeamStatus)
  status?: TeamStatus;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsEnum(EquipmentType)
  equipmentType?: EquipmentType;

  @IsOptional()
  @IsString()
  search?: string;
} 