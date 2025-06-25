/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 출석 기록 추가 (DB 저장)
   */
  async clockIn(name: string, studentNumber: string, location: string) {
    const koreaTime = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
    const today = koreaTime.toISOString().split("T")[0];
    const currentHour = koreaTime.getHours();

    if (currentHour < 9 || currentHour >= 18) {
      throw new HttpException("출석 가능 시간은 오전 9시부터 오후 6시까지입니다.", HttpStatus.BAD_REQUEST);
    }

    // ✅ studentNumber로 userId 조회
    const user = await this.userRepository.findOne({ where: { studentNumber } });
    if (!user) {
      throw new HttpException("해당 수강번호의 사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }

    // ✅ 기존 출석 기록 확인
    const existingRecord = await this.attendanceRepository.findOne({
      where: { userId: user.id, date: today },
    });

    if (existingRecord) {
      throw new HttpException("이미 오늘 출석하셨습니다.", HttpStatus.CONFLICT);
    }

    // ✅ 출석 정보 저장
    const attendance = this.attendanceRepository.create({
      userId: user.id,
      location,
      clockInTime: koreaTime,
      date: today,
    });

    await this.attendanceRepository.save(attendance);
    return { status: 200, data: attendance };
  }

  /**
   * 조퇴 기록 추가
   */
  async clockOut(name: string, studentNumber: string, location: string) {
    const koreaTime = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
    const today = koreaTime.toISOString().split("T")[0];

    // ✅ studentNumber로 userId 조회
    const user = await this.userRepository.findOne({ where: { studentNumber } });
    if (!user) {
      throw new HttpException("해당 수강번호의 사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }

    // ✅ 기존 출석 기록 확인
    const existingRecord = await this.attendanceRepository.findOne({
      where: { userId: user.id, date: today },
    });

    if (!existingRecord) {
      throw new HttpException("출석 기록이 없어 조퇴할 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    // ✅ 이미 조퇴한 경우 중복 조퇴 방지
    if (existingRecord.clockOutTime) {
      throw new HttpException("이미 조퇴하셨습니다.", HttpStatus.CONFLICT);
    }

    // ✅ 조퇴 정보 저장
    existingRecord.clockOutTime = koreaTime;
    await this.attendanceRepository.save(existingRecord);

    return { status: 200, data: existingRecord };
  }

  /**
   * 특정 날짜의 출석자 목록 조회
   */
  async getAttendanceByDate(date: string) {
    const records = await this.attendanceRepository.find({
      where: { date },
      relations: ['user'],
    });

    if (!records.length) {
      throw new NotFoundException(`해당 날짜(${date})에 대한 출석 기록이 없습니다.`);
    }

    return records.map((record) => ({
      userId: record.user.id,
      name: record.user.name,
      studentNumber: record.user.studentNumber,
      location: record.location,
      clockInTime: record.clockInTime,
      date: record.date,
      clockOutTime: record.clockOutTime || null,
    }));
  }

  /**
   * 특정 날짜의 조퇴자 목록 조회
   */
  async getLeavesByDate(date: string) {
    const records = await this.attendanceRepository.find({
      where: { date, clockOutTime: Not(IsNull()) },
      relations: ['user'],
    });

    if (!records.length) {
      throw new NotFoundException(`해당 날짜(${date})에 대한 조퇴 기록이 없습니다.`);
    }

    return records.map((record) => ({
      userId: record.user.id,
      name: record.user.name,
      studentNumber: record.user.studentNumber,
      location: record.location,
      clockOutTime: record.clockOutTime,
      date: record.date,
    }));
  }

  /**
   * 최근 7일간 출석자 목록 조회
   */
  async getWeeklyAttendance() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(sevenDaysAgo.getHours() + 9);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.attendanceRepository.find({ where: { date: Not(IsNull()) }, relations: ['user'] });
  }

  /**
   * 최근 7일간 조퇴자 목록 조회
   */
  async getWeeklyLeaves() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(sevenDaysAgo.getHours() + 9);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.attendanceRepository.find({
      where: { date: Not(IsNull()), clockOutTime: Not(IsNull()) },
      relations: ['user'],
    });
  }
}
