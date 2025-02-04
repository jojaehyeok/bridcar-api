import { IsString, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '홍길동', description: '사용자 이름' })
  @IsString()
  name: string;

  @ApiProperty({ example: '20230001', description: '학번', uniqueItems: true })
  @IsString()
  studentNumber: string;
}

export class CreateMultipleUsersDto {
  @ApiProperty({ type: [CreateUserDto], description: '사용자 리스트' })
  @IsArray()
  @ArrayMinSize(1)
  users: CreateUserDto[];
}
