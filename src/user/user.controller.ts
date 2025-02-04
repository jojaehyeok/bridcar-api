import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto, CreateMultipleUsersDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 여러 사용자 등록
   * @param createUsersDto - 사용자 생성 DTO 배열
   * @returns 생성된 사용자 목록
   */
  @Post('register-multiple')
  @ApiOperation({ summary: 'Register multiple users at once' })
  @ApiResponse({
    status: 201,
    description: 'Users have been successfully created.',
    type: [User],
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Some users have duplicate student numbers.',
  })
  async createMultipleUsers(@Body() createUsersDto: CreateMultipleUsersDto): Promise<User[]> {
    try {
      return await this.userService.createMultipleUsers(createUsersDto.users);
    } catch (error) {
      if (error === 'ER_DUP_ENTRY') {
        throw new HttpException('Some users have duplicate student numbers.', HttpStatus.CONFLICT);
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
