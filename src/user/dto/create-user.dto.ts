import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name of the user (can include Korean characters)',
    example: '홍길동',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required and cannot be empty' })
  @Length(1, 50, { message: 'Name must be between 1 and 50 characters long' })
  name: string;

  @ApiProperty({
    description: 'Unique student number (alphanumeric, max 20 characters)',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty({ message: 'Student number is required and cannot be empty' })
  @Length(1, 20, { message: 'Student number must be between 1 and 20 characters long' })
  @Matches(/^[0-9]*$/, { message: 'Student number must only contain numbers' })
  studentNumber: string;
}
