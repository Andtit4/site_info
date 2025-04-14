import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Site } from './site.entity';
import { Department } from './department.entity';

// Types d'équipement possibles
export enum EquipmentType {
  ANTENNA = 'ANTENNE',
  ROUTER = 'ROUTEUR',
  BATTERY = 'BATTERIE',
  GENERATOR = 'GÉNÉRATEUR',
  COOLING = 'REFROIDISSEMENT',
  SHELTER = 'SHELTER',
  TOWER = 'PYLÔNE',
  SECURITY = 'SÉCURITÉ',
}

// Statut des équipements
export enum EquipmentStatus {
  ACTIVE = 'ACTIF',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIF',
  PLANNED = 'PLANIFIÉ',
  UNDER_INSTALLATION = 'EN_INSTALLATION',
}

@Entity()
export class Equipment {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: EquipmentType,
  })
  type: EquipmentType;

  @Column()
  model: string;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column()
  installDate: string;

  @Column({ nullable: true })
  lastMaintenanceDate: string;

  @Column({
    type: 'enum',
    enum: EquipmentStatus,
    default: EquipmentStatus.ACTIVE,
  })
  status: EquipmentStatus;

  @Column('json', { nullable: true })
  specifications: Record<string, string>;

  @ManyToOne(() => Site, site => site.equipment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'siteId' })
  site: Site;

  @Column()
  siteId: string;
  
  @ManyToOne(() => Department, department => department.equipment)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ nullable: true })
  departmentId: string;
} 