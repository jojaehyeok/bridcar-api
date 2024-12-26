import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // UserRepository 주입
  ) {}

  async clockIn(name: string, studentNumber: string, location: string) {
    const user = await this.userRepository.findOne({ where: { name, studentNumber } });
    if (!user) {
      throw new ConflictException('등록되지 않은 사용자입니다.');
    }

    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜
    const existingRecord = await this.attendanceRepository.findOne({
      where: { userId: user.id, date: today },
    });

    if (existingRecord) {
      throw new ConflictException('이미 오늘 출석하셨습니다.');
    }

    const attendance = this.attendanceRepository.create({
      userId: user.id,
      location,
      date: today,
      clockInTime: new Date(),
    });

    return this.attendanceRepository.save(attendance);
  }
}
