import { Injectable } from '@nestjs/common';

@Injectable()
export class AttendanceService {
  private attendanceRecords: any[] = [];
  private leaveRecords: any[] = [];

  /**
   * 현재 시간을 한국(KST) 기준으로 변환 (ISO 형식 유지)
   */
  private getCurrentKSTTime(): string {
    const now = new Date();
    now.setHours(now.getHours() + 9); // UTC +9로 변환
    return now.toISOString();
  }

  /**
   * 출석 기록 추가 (KST 시간 저장)
   */
  async clockIn(name: string, studentNumber: string, location: string) {
    const record = {
      userId: Date.now(),
      name,
      studentNumber,
      location,
      clockInTime: this.getCurrentKSTTime(), // KST 기준 저장
      date: this.getCurrentKSTTime().split('T')[0], // YYYY-MM-DD 형식
    };
    this.attendanceRecords.push(record);
    return record;
  }

  /**
   * 조퇴 기록 추가 (KST 시간 저장)
   */
  async clockOut(name: string, studentNumber: string, location: string) {
    const record = {
      userId: Date.now(),
      name,
      studentNumber,
      location,
      clockOutTime: this.getCurrentKSTTime(), // KST 기준 저장
      date: this.getCurrentKSTTime().split('T')[0], // YYYY-MM-DD 형식
    };
    this.leaveRecords.push(record);
    return record;
  }

  /**
   * 특정 날짜의 출석자 목록 조회 (KST 변환)
   */
  async getAttendanceByDate(date: string) {
    return this.attendanceRecords.filter((record) => record.date === date);
  }

  /**
   * 특정 날짜의 조퇴자 목록 조회 (KST 변환)
   */
  async getLeavesByDate(date: string) {
    return this.leaveRecords.filter((record) => record.date === date);
  }

  /**
   * 최근 7일간 출석자 목록 조회
   */
  async getWeeklyAttendance() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(sevenDaysAgo.getHours() + 9); // UTC → KST 변환
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // 7일 전 날짜 계산

    return this.attendanceRecords.filter((record) => new Date(record.date) >= sevenDaysAgo);
  }

  /**
   * 최근 7일간 조퇴자 목록 조회
   */
  async getWeeklyLeaves() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(sevenDaysAgo.getHours() + 9); // UTC → KST 변환
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // 7일 전 날짜 계산

    return this.leaveRecords.filter((record) => new Date(record.date) >= sevenDaysAgo);
  }
}
