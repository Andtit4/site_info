import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Equipment } from './equipment.entity';
import { Team } from '../teams/entities/team.entity';
import { EquipmentType } from './equipment.entity';

// Types de départements
export enum DepartmentType {
  TRANSMISSION = 'TRANSMISSION',
  ENERGIE = 'ENERGIE',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  INFORMATIQUE = 'INFORMATIQUE',
  SECURITE = 'SECURITE',
}

@Entity()
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: DepartmentType,
  })
  type: DepartmentType;

  @Column({ nullable: true })
  description: string;

  @Column()
  responsibleName: string;

  @Column()
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Team, team => team.department)
  teams: Team[];

  @OneToMany(() => Equipment, equipment => equipment.department)
  equipment: Equipment[];

  @Column('simple-array', { nullable: true })
  managedEquipmentTypes: EquipmentType[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
} 