import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('specifications')
export class Specification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: [
      'ANTENNE',
      'ROUTEUR',
      'BATTERIE',
      'GÉNÉRATEUR',
      'REFROIDISSEMENT',
      'SHELTER',
      'PYLÔNE',
      'SÉCURITÉ'
    ],
    enumName: 'equipment_type_enum',
    nullable: false
  })
  equipmentType: string;

  @Column('json', { nullable: false })
  columns: Array<{
    name: string;
    type: string;
    length?: number;
    nullable?: boolean;
    defaultValue?: string;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 