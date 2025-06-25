// src/measurement/measurement.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';

@Controller('measurements')
export class MeasurementController {
  constructor(private readonly service: MeasurementService) {}

  @Post()
  create(@Body() dto: CreateMeasurementDto) {
    return this.service.create(dto);
  }

  @Get('vehicle/:vehicleId')
  findByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.service.findByVehicle(vehicleId);
  }
}
