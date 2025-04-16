import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Department } from '../../entities/department.entity';
import { Site } from '../../entities/site.entity';
import { Equipment } from '../../entities/equipment.entity';
import { EquipmentType } from '../../entities/equipment.entity';

export enum TeamStatus {
  ACTIVE = 'ACTIVE',
  STANDBY = 'STANDBY',
  INACTIVE = 'INACTIVE',
}

@Entity()
export class Team {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TeamStatus,
    default: TeamStatus.ACTIVE
  })
  status: TeamStatus;

  @Column({ nullable: true })
  leadName: string;

  @Column({ nullable: true })
  leadContact: string;

  @Column()
  memberCount: number;

  @Column({ nullable: true })
  location: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date;

  @Column({ nullable: true })
  lastActiveDate: string;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @Column({
    type: 'enum',
    enum: EquipmentType,
    enumName: 'equipment_type_enum',
    nullable: true
  })
  equipmentType: EquipmentType;

  @ManyToOne(() => Department, department => department.teams, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column()
  departmentId: string;

  @ManyToMany(() => Site, site => site.teams)
  @JoinTable({
    name: 'team_sites',
    joinColumn: {
      name: 'teamId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'siteId',
      referencedColumnName: 'id',
    },
  })
  sites: Site[];

  @ManyToMany(() => Equipment, equipment => equipment.teams)
  equipment: Equipment[];
} 