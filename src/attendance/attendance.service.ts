import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Attendance } from '../attendance/entities/attendance.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async clockIn(name: string, studentNumber: string, location: string) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { name, studentNumber } });
      if (!user) {
        throw new NotFoundException('사용자가 등록되지 않았습니다.');
      }

      const today = new Date().toISOString().split('T')[0];
      const existingRecord = await manager.findOne(Attendance, {
        where: { userId: user.id, date: today },
      });

      if (existingRecord) {
        throw new ConflictException('오늘 이미 출석하셨습니다.');
      }

      const attendance = manager.create(Attendance, {
        userId: user.id,
        location,
        date: today,
        clockInTime: new Date(),
      });

      return manager.save(Attendance, attendance);
    });
  }
}
