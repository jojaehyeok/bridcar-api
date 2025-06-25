// src/measurement/dto/create-measurement.dto.ts
import { IsUUID, IsString, IsNumber } from 'class-validator';

export class CreateMeasurementDto {
  @IsUUID()
  vehicleId: string;

  @IsString()
  part: string;

  @IsNumber()
  thickness: number;
}
