import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, ValidateNested, IsArray, IsLatitude, IsLongitude } from 'class-validator';
import { Type } from 'class-transformer';
import { SiteStatus } from '../entities/site.entity';
import { CreateEquipmentDto } from './equipment.dto';

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsNumber()
  @IsLongitude()
  longitude: number;

  @IsNumber()
  @IsLatitude()
  latitude: number;

  @IsEnum(SiteStatus)
  @IsOptional()
  status?: SiteStatus = SiteStatus.ACTIVE;

  @IsString()
  @IsOptional()
  oldBase?: string;

  @IsString()
  @IsOptional()
  newBase?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateEquipmentDto)
  equipment?: CreateEquipmentDto[];
}

export class UpdateSiteDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsNumber()
  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @IsNumber()
  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @IsEnum(SiteStatus)
  @IsOptional()
  status?: SiteStatus;

  @IsString()
  @IsOptional()
  oldBase?: string;

  @IsString()
  @IsOptional()
  newBase?: string;
}

export class SiteFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsEnum(SiteStatus, { each: true })
  @IsOptional()
  status?: SiteStatus[];
} 