import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  @ApiProperty({ description: 'Unique student number', example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  studentNumber: string;
}
