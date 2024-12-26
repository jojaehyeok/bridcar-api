import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  studentNumber: string;

  @Column()
  location: string;

  @CreateDateColumn()
  clockInTime: Date;

  @Column()
  date: string; // 중복 방지를 위한 날짜 필드
}
