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
  
}
