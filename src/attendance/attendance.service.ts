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
    const now = new Date();
    const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9로 변환
    const today = koreaTime.toISOString().split("T")[0]; // YYYY-MM-DD 형식
    const currentHour = koreaTime.getHours();
  
    // ⏰ 9시~18시까지만 출석 가능
    if (currentHour < 9 || currentHour >= 18) {
      return {
        status: 400,
        message: "출석 가능 시간은 오전 9시부터 오후 6시까지입니다.",
      };
    }
  
    // 오늘 이미 출석했는지 확인
    const existingRecord = this.attendanceRecords.find(
      (record) => record.studentNumber === studentNumber && record.date === today
    );
  
    if (existingRecord) {
      return { status: 400, message: "이미 오늘 출석하셨습니다." };
    }
  
    // 조퇴 후 다시 출석하는 것을 막기
    const hasClockedOut = this.leaveRecords.some(
      (record) => record.studentNumber === studentNumber && record.date === today
    );
  
    if (hasClockedOut) {
      return { status: 400, message: "이미 조퇴한 상태에서는 다시 출석할 수 없습니다." };
    }
  
    const record = {
      userId: Date.now(),
      name,
      studentNumber,
      location,
      clockInTime: koreaTime.toISOString(),
      date: today,
    };
  
    this.attendanceRecords.push(record);
    return { status: 200, data: record };
  }
  
  /**
   * 조퇴 기록 추가 (KST 시간 저장)
   */
  async clockOut(name: string, studentNumber: string, location: string) {
    const koreaTime = new Date(new Date().getTime() + 9 * 60 * 60 * 1000); // UTC+9 변환
    const today = koreaTime.toISOString().split("T")[0];
  
    // 🛑 조퇴할 때 출석 가능 시간(9~18시) 제한 제거
    const existingRecord = this.attendanceRecords.find(
      (record) => record.studentNumber === studentNumber && record.date === today
    );
  
    if (!existingRecord) {
      return { status: 400, message: "출석 기록이 없어 조퇴할 수 없습니다." };
    }
  
    const record = {
      userId: Date.now(),
      name,
      studentNumber,
      location,
      clockOutTime: koreaTime.toISOString(),
      date: today,
    };
  
    this.leaveRecords.push(record);
    return { status: 200, data: record };
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
