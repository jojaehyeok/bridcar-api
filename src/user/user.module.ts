import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // TypeOrmModule 등록
  providers:[UserService],
  controllers:[UserController],
  exports: [TypeOrmModule], // 필요 시 exports로 내보냄
})
export class UserModule {}


//   imports: [
//     TypeOrmModule.forFeature([Attendance]), // Attendance 엔티티 등록
//     UserModule, // UserModule 가져오기
//   ],
//   providers: [AttendanceService],
//   controllers: [AttendanceController],
// })