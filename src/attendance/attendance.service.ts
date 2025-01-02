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

  /**
   * 출석 처리 (Clock In)
   * @param name 사용자 이름
   * @param studentNumber 사용자 학번
   * @param location 출석 위치
   * @returns 저장된 출석 데이터
   */
  async clockIn(name: string, studentNumber: string, location: string): Promise<Attendance> {
    console.log(`clockIn 호출됨: name=${name}, studentNumber=${studentNumber}, location=${location}`);

    return this.dataSource.transaction(async (manager) => {
      const user = await this.findUser(manager, name, studentNumber);

      if (!user) {
        console.error(`사용자 조회 실패: name=${name}, studentNumber=${studentNumber}`);
        throw new NotFoundException('사용자가 등록되지 않았습니다.');
      }

      console.log(`사용자 조회 성공: ${JSON.stringify(user)}`);

      // 오늘 날짜 기준으로 이미 출석 기록이 있는지 확인
      const today = this.getCurrentDate();
      console.log(`오늘 날짜: ${today}`);

      const existingRecord = await this.checkExistingAttendance(manager, user.id, today);

      if (existingRecord) {
        console.error(`이미 출석 기록이 존재함: userId=${user.id}, date=${today}`);
        throw new ConflictException('오늘 이미 출석하셨습니다.');
      }

      // 출석 데이터 생성
      const attendance = manager.create(Attendance, {
        userId: user.id,
        location,
        date: today,
        clockInTime: new Date(),
      });

      console.log(`출석 데이터 생성: ${JSON.stringify(attendance)}`);

      const savedAttendance = await manager.save(Attendance, attendance);
      console.log(`출석 데이터 저장 완료: ${JSON.stringify(savedAttendance)}`);

      return savedAttendance;
    });
  }

  /**
   * 사용자 찾기
   * @param manager 트랜잭션 매니저
   * @param name 사용자 이름
   * @param studentNumber 사용자 학번
   * @returns 사용자 데이터
   */
  private async findUser(manager: any, name: string, studentNumber: string): Promise<User> {
    const user = await manager.findOne(User, { where: { name, studentNumber } });

    if (!user) {
      console.error(`사용자 없음: name=${name}, studentNumber=${studentNumber}`);
      throw new NotFoundException('사용자가 등록되지 않았습니다.');
    }

    return user;
  }

  /**
   * 기존 출석 기록 확인
   * @param manager 트랜잭션 매니저
   * @param userId 사용자 ID
   * @param date 날짜 (YYYY-MM-DD)
   * @returns 출석 기록 데이터 또는 null
   */
  private async checkExistingAttendance(manager: any, userId: number, date: string): Promise<Attendance | null> {
    const record = await manager.findOne(Attendance, { where: { userId, date } });

    if (record) {
      console.log(`기존 출석 기록 확인됨: ${JSON.stringify(record)}`);
    } else {
      console.log(`기존 출석 기록 없음: userId=${userId}, date=${date}`);
    }

    return record;
  }

  /**
   * 현재 날짜를 YYYY-MM-DD 형식으로 반환
   * @returns 오늘 날짜 (YYYY-MM-DD)
   */
  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
