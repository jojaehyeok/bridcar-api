import { Controller, Post, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async clockIn(@Body() body: { name: string; studentNumber: string; location: string }) {
    console.log(body.name)
    return this.attendanceService.clockIn(body.name, body.studentNumber, body.location);
  }
}
