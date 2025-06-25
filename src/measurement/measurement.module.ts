// src/measurement/measurement.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measurement } from './entities/measurement.entity';
import { MeasurementService } from './measurement.service';
import { MeasurementController } from './measurement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Measurement])],
  providers: [MeasurementService],
  controllers: [MeasurementController],
})
export class MeasurementModule {}
