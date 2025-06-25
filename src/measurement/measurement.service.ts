// src/measurement/measurement.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Measurement } from './entities/measurement.entity';
import { CreateMeasurementDto } from './dto/create-measurement.dto';

@Injectable()
export class MeasurementService {
  constructor(
    @InjectRepository(Measurement)
    private readonly repo: Repository<Measurement>,
  ) {}

  create(dto: CreateMeasurementDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findByVehicle(vehicleId: string) {
    return this.repo.find({ where: { vehicleId } });
  }
}
