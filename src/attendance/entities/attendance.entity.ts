import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' }) // 외래 키
  user: User;

  @Column()
  userId: number; // 외래 키 필드

  @Column()
  location: string;

  @CreateDateColumn()
  clockInTime: Date;

  @Column()
  date: string; // 중복 방지를 위한 날짜 필드
}
