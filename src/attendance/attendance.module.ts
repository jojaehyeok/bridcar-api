import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { UserModule } from '../user/user.module'; // UserModule 가져오기

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]), // Attendance 엔티티 등록
    UserModule, // UserModule 가져오기
  ],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
