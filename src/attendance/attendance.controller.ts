import { Controller, Post, Body, Get, Query, NotFoundException, Res } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiOperation } from '@nestjs/swagger';
import { createObjectCsvStringifier } from 'csv-writer';
import { Response as ExpressResponse } from 'express';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post()
  async clockIn(@Body() body: { name: string; studentNumber: string; location: string }) {
    console.log(body.name)
    return this.attendanceService.clockIn(body.name, body.studentNumber, body.location);
  }

  @Get('by-date')
  @ApiOperation({ summary: '날짜별 출석자 목록 조회' })
  async getAttendanceByDate(@Query('date') date: string) {
    if (!date) {
      throw new NotFoundException('날짜를 제공해야 합니다.');
    }

    return this.attendanceService.getAttendanceByDate(date);
  }

   /**
   * 날짜별 출석 데이터를 CSV로 내보내기
   * @param date - YYYY-MM-DD 형식의 날짜
   * @param res - Express Response 객체
   */
   @Get('export')
   @ApiOperation({ summary: '날짜별 출석 데이터를 CSV로 내보내기' })
   async exportAttendanceByDate(@Query('date') date: string, @Res() res: ExpressResponse) {
     if (!date) {
       throw new NotFoundException('날짜를 제공해야 합니다.');
     }
 
     // AttendanceService를 통해 날짜별 출석 데이터를 가져옵니다.
     const attendanceRecords = await this.attendanceService.getAttendanceByDate(date);
 
     // 타입 가드: attendanceRecords가 배열인지 확인
     if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
       throw new NotFoundException(`No attendance records found for the date: ${date}`);
     }
 
     // CSV 변환기 생성
     const csvStringifier = createObjectCsvStringifier({
       header: [
         { id: 'userId', title: 'User ID' },
         { id: 'name', title: 'Name' },
         { id: 'studentNumber', title: 'Student Number' },
         { id: 'location', title: 'Location' },
         { id: 'clockInTime', title: 'Clock-In Time' },
         { id: 'date', title: 'Date' },
       ],
     });
 
     // CSV 데이터 생성
     const csvData =
       csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(attendanceRecords);
 
     // 응답 헤더 및 파일 전송
     res.setHeader('Content-Type', 'text/csv');
     res.setHeader('Content-Disposition', `attachment; filename=attendance_${date}.csv`);
     res.send(csvData);
   }
}
