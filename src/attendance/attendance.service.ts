import { Injectable } from '@nestjs/common';

@Injectable()
export class AttendanceService {
  private attendanceRecords: any[] = [];
  private leaveRecords: any[] = [];

  /**
   * 현재 시간을 한국(KST) 시간으로 변환하여 반환
   */
  private getCurrentKSTTime(): string {
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000; // UTC +9 시간 보정
    const kstTime = new Date(now.getTime() + kstOffset);
    return kstTime.toISOString();
  }

  /**
   * 출석 기록 추가
   */
  async clockIn(name: string, studentNumber: string, location: string) {
    const record = {
      userId: Date.now(),
      name,
      studentNumber,
      location,
      clockInTime: this.getCurrentKSTTime(),
      date: this.getCurrentKSTTime().split('T')[0], // YYYY-MM-DD 형식
    };
    this.attendanceRecords.push(record);
    return record;
  }

  /**
   * 조퇴 기록 추가
   */
  async clockOut(name: string, studentNumber: string, location: string) {
    const record = {
      userId: Date.now(),
      name,
      studentNumber,
      location,
      clockOutTime: this.getCurrentKSTTime(),
      date: this.getCurrentKSTTime().split('T')[0], // YYYY-MM-DD 형식
    };
    this.leaveRecords.push(record);
    return record;
  }

  /**
   * 특정 날짜의 출석자 목록 조회 (KST 변환)
   */
  async getAttendanceByDate(date: string) {
    return this.attendanceRecords
      .filter((record) => record.date === date)
      .map((record) => ({
        ...record,
        clockInTime: this.formatToKST(record.clockInTime),
      }));
  }

  /**
   * 특정 날짜의 조퇴자 목록 조회 (KST 변환)
   */
  async getLeavesByDate(date: string) {
    return this.leaveRecords
      .filter((record) => record.date === date)
      .map((record) => ({
        ...record,
        clockOutTime: this.formatToKST(record.clockOutTime),
      }));
  }

  /**
   * 최근 7일간 출석자 목록 조회
   */
  async getWeeklyAttendance() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.attendanceRecords
      .filter((record) => new Date(record.date) >= sevenDaysAgo)
      .map((record) => ({
        ...record,
        clockInTime: this.formatToKST(record.clockInTime),
      }));
  }

  /**
   * 최근 7일간 조퇴자 목록 조회
   */
  async getWeeklyLeaves() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.leaveRecords
      .filter((record) => new Date(record.date) >= sevenDaysAgo)
      .map((record) => ({
        ...record,
        clockOutTime: this.formatToKST(record.clockOutTime),
      }));
  }

  /**
   * UTC 시간을 KST(한국 시간)으로 변환하여 반환
   */
  private formatToKST(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
