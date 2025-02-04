import { Controller, Post, Body, Get, Query, NotFoundException, Res } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiOperation } from '@nestjs/swagger';
import { createObjectCsvStringifier } from 'csv-writer';
import { Response as ExpressResponse } from 'express';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: '출석 등록' })
  async clockIn(@Body() body: { name: string; studentNumber: string; location: string }) {
    return this.attendanceService.clockIn(body.name, body.studentNumber, body.location);
  }

  @Post('clock-out')
  @ApiOperation({ summary: '조퇴 등록' })
  async clockOut(@Body() body: { name: string; studentNumber: string; location: string }) {
    return this.attendanceService.clockOut(body.name, body.studentNumber, body.location);
  }

  @Get('by-date')
  @ApiOperation({ summary: '날짜별 출석자 목록 조회' })
  async getAttendanceByDate(@Query('date') date: string) {
    if (!date) throw new NotFoundException('날짜를 제공해야 합니다.');
    return this.attendanceService.getAttendanceByDate(date);
  }

  @Get('leaves-by-date')
  @ApiOperation({ summary: '날짜별 조퇴자 목록 조회' })
  async getLeavesByDate(@Query('date') date: string) {
    if (!date) throw new NotFoundException('날짜를 제공해야 합니다.');
    return this.attendanceService.getLeavesByDate(date);
  }

  /**
   * CSV 변환 및 다운로드 공통 함수
   */
  private exportToCSV(
    res: ExpressResponse,
    data: any[],
    filename: string,
    headers: { id: string; title: string }[]
  ) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new NotFoundException(`No records found for export`);
    }

    const csvStringifier = createObjectCsvStringifier({ header: headers });
    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(csvData);
  }

  @Get('export')
  @ApiOperation({ summary: '날짜별 출석 데이터를 CSV로 내보내기 (KST 시간 적용)' })
  async exportAttendanceByDate(@Query('date') date: string, @Res() res: ExpressResponse) {
    if (!date) throw new NotFoundException('날짜를 제공해야 합니다.');

    const attendanceRecords = await this.attendanceService.getAttendanceByDate(date);
    this.exportToCSV(res, attendanceRecords, `attendance_${date}.csv`, [
      { id: 'userId', title: 'User ID' },
      { id: 'name', title: 'Name' },
      { id: 'studentNumber', title: 'Student Number' },
      { id: 'location', title: 'Location' },
      { id: 'clockInTime', title: 'Clock-In Time (KST)' },
      { id: 'date', title: 'Date' },
    ]);
  }

  @Get('export-leaves')
  @ApiOperation({ summary: '날짜별 조퇴 데이터를 CSV로 내보내기 (KST 시간 적용)' })
  async exportLeavesByDate(@Query('date') date: string, @Res() res: ExpressResponse) {
    if (!date) throw new NotFoundException('날짜를 제공해야 합니다.');

    const leaveRecords = await this.attendanceService.getLeavesByDate(date);
    this.exportToCSV(res, leaveRecords, `leaves_${date}.csv`, [
      { id: 'userId', title: 'User ID' },
      { id: 'name', title: 'Name' },
      { id: 'studentNumber', title: 'Student Number' },
      { id: 'location', title: 'Location' },
      { id: 'clockOutTime', title: 'Clock-Out Time (KST)' },
      { id: 'date', title: 'Date' },
    ]);
  }

  @Get('weekly')
  @ApiOperation({ summary: '최근 7일간 출석자 목록 조회' })
  async getWeeklyAttendance() {
    return this.attendanceService.getWeeklyAttendance();
  }

  @Get('weekly-leaves')
  @ApiOperation({ summary: '최근 7일간 조퇴자 목록 조회' })
  async getWeeklyLeaves() {
    return this.attendanceService.getWeeklyLeaves();
  }

  @Get('export-weekly')
  @ApiOperation({ summary: '최근 7일간 출석 데이터를 CSV로 내보내기 (KST 시간 적용)' })
  async exportWeeklyAttendance(@Res() res: ExpressResponse) {
    const attendanceRecords = await this.attendanceService.getWeeklyAttendance();
    this.exportToCSV(res, attendanceRecords, `weekly_attendance.csv`, [
      { id: 'userId', title: 'User ID' },
      { id: 'name', title: 'Name' },
      { id: 'studentNumber', title: 'Student Number' },
      { id: 'location', title: 'Location' },
      { id: 'clockInTime', title: 'Clock-In Time (KST)' },
      { id: 'date', title: 'Date' },
    ]);
  }

  @Get('export-weekly-leaves')
  @ApiOperation({ summary: '최근 7일간 조퇴 데이터를 CSV로 내보내기 (KST 시간 적용)' })
  async exportWeeklyLeaves(@Res() res: ExpressResponse) {
    const leaveRecords = await this.attendanceService.getWeeklyLeaves();
    this.exportToCSV(res, leaveRecords, `weekly_leaves.csv`, [
      { id: 'userId', title: 'User ID' },
      { id: 'name', title: 'Name' },
      { id: 'studentNumber', title: 'Student Number' },
      { id: 'location', title: 'Location' },
      { id: 'clockOutTime', title: 'Clock-Out Time (KST)' },
      { id: 'date', title: 'Date' },
    ]);
  }
}
