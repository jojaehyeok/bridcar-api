import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AttendanceService {
  private attendanceRecords: any[] = [];
  private leaveRecords: any[] = [];

  async clockIn(name: string, studentNumber: string, location: string) {
    const record = {
      userId: Date.now(),
      name,
      studentNumber,
      location,
      clockInTime: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
    };
    this.attendanceRecords.push(record);
    return record;
  }

  async clockOut(name: string, studentNumber: string, location: string) {
    const record = {
      userId: Date.now(),
      name,
      studentNumber,
      location,
      clockOutTime: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
    };
    this.leaveRecords.push(record);
    return record;
  }

  async getAttendanceByDate(date: string) {
    return this.attendanceRecords.filter((record) => record.date === date);
  }

  async getLeavesByDate(date: string) {
    return this.leaveRecords.filter((record) => record.date === date);
  }

  async getWeeklyAttendance() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.attendanceRecords.filter((record) => new Date(record.date) >= sevenDaysAgo);
  }

  async getWeeklyLeaves() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.leaveRecords.filter((record) => new Date(record.date) >= sevenDaysAgo);
  }
}
