import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Attendance extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column()
  location: string;

  @CreateDateColumn()
  clockInTime: Date;

  @Column({ type: 'timestamp', nullable: true }) // ✅ 조퇴 시간 추가
  clockOutTime?: Date;

  @Column()
  date: string;
}
