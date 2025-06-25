// src/measurement/entities/measurement.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleId: string;

  @Column()
  part: string; // ex: 'roof'

  @Column('float')
  thickness: number;

  @CreateDateColumn()
  createdAt: Date;
}
