import { Controller, Post, Body, Get, Query, NotFoundException, Res } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiOperation } from '@nestjs/swagger';
import { createObjectCsvStringifier } from 'csv-writer';
import { Response as ExpressResponse } from 'express';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
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
    if (!date) {
      throw new NotFoundException('날짜를 제공해야 합니다.');
    }
    return this.attendanceService.getAttendanceByDate(date);
  }

  @Get('leaves-by-date')
  @ApiOperation({ summary: '날짜별 조퇴자 목록 조회' })
  async getLeavesByDate(@Query('date') date: string) {
    if (!date) {
      throw new NotFoundException('날짜를 제공해야 합니다.');
    }
    return this.attendanceService.getLeavesByDate(date);
  }

  /**
   * 날짜별 출석 데이터를 CSV로 내보내기
   */
  @Get('export')
  @ApiOperation({ summary: '날짜별 출석 데이터를 CSV로 내보내기 (KST 시간으로 변환)' })
  async exportAttendanceByDate(@Query('date') date: string, @Res() res: ExpressResponse) {
    if (!date) {
      throw new NotFoundException('날짜를 제공해야 합니다.');
    }

    const attendanceRecords = await this.attendanceService.getAttendanceByDate(date);

    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      throw new NotFoundException(`No attendance records found for the date: ${date}`);
    }

    const formatter = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const recordsWithKST = attendanceRecords.map((record) => ({
      ...record,
      clockInTime: formatter.format(new Date(record.clockInTime)),
    }));

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'userId', title: 'User ID' },
        { id: 'name', title: 'Name' },
        { id: 'studentNumber', title: 'Student Number' },
        { id: 'location', title: 'Location' },
        { id: 'clockInTime', title: 'Clock-In Time (KST)' },
        { id: 'date', title: 'Date' },
      ],
    });

    const csvData =
      csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(recordsWithKST);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=attendance_${date}.csv`);
    res.send(csvData);
  }

  /**
   * 날짜별 조퇴 데이터를 CSV로 내보내기
   */
  @Get('export-leaves')
  @ApiOperation({ summary: '날짜별 조퇴 데이터를 CSV로 내보내기 (KST 시간으로 변환)' })
  async exportLeavesByDate(@Query('date') date: string, @Res() res: ExpressResponse) {
    if (!date) {
      throw new NotFoundException('날짜를 제공해야 합니다.');
    }

    const leaveRecords = await this.attendanceService.getLeavesByDate(date);

    if (!Array.isArray(leaveRecords) || leaveRecords.length === 0) {
      throw new NotFoundException(`No leave records found for the date: ${date}`);
    }

    const formatter = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const recordsWithKST = leaveRecords.map((record) => ({
      ...record,
      clockOutTime: formatter.format(new Date(record.clockOutTime)),
    }));

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'userId', title: 'User ID' },
        { id: 'name', title: 'Name' },
        { id: 'studentNumber', title: 'Student Number' },
        { id: 'location', title: 'Location' },
        { id: 'clockOutTime', title: 'Clock-Out Time (KST)' },
        { id: 'date', title: 'Date' },
      ],
    });

    const csvData =
      csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(recordsWithKST);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=leaves_${date}.csv`);
    res.send(csvData);
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

  /**
   * 일주일치 출석 데이터를 CSV로 내보내기
   */
  @Get('export-weekly')
  @ApiOperation({ summary: '최근 7일간 출석 데이터를 CSV로 내보내기' })
  async exportWeeklyAttendance(@Res() res: ExpressResponse) {
    const attendanceRecords = await this.attendanceService.getWeeklyAttendance();

    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      throw new NotFoundException(`No attendance records found for the last 7 days`);
    }

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'userId', title: 'User ID' },
        { id: 'name', title: 'Name' },
        { id: 'studentNumber', title: 'Student Number' },
        { id: 'location', title: 'Location' },
        { id: 'clockInTime', title: 'Clock-In Time (KST)' },
        { id: 'date', title: 'Date' },
      ],
    });

    const csvData =
      csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(attendanceRecords);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=weekly_attendance.csv`);
    res.send(csvData);
  }

  /**
   * 일주일치 조퇴 데이터를 CSV로 내보내기
   */
  @Get('export-weekly-leaves')
  @ApiOperation({ summary: '최근 7일간 조퇴 데이터를 CSV로 내보내기' })
  async exportWeeklyLeaves(@Res() res: ExpressResponse) {
    const leaveRecords = await this.attendanceService.getWeeklyLeaves();

    if (!Array.isArray(leaveRecords) || leaveRecords.length === 0) {
      throw new NotFoundException(`No leave records found for the last 7 days`);
    }

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'userId', title: 'User ID' },
        { id: 'name', title: 'Name' },
        { id: 'studentNumber', title: 'Student Number' },
        { id: 'location', title: 'Location' },
        { id: 'clockOutTime', title: 'Clock-Out Time (KST)' },
        { id: 'date', title: 'Date' },
      ],
    });

    const csvData =
      csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(leaveRecords);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=weekly_leaves.csv`);
    res.send(csvData);
  }
}
