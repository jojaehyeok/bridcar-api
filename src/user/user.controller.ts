import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users') // Swagger에서 사용할 태그 지정
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 등록
   * @param createUserDto - 사용자 생성 DTO
   * @returns 생성된 사용자 정보
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: User with the same studentNumber already exists.',
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.createUser(
        createUserDto.name,
        createUserDto.studentNumber,
      );
    } catch (error) {
      if (error === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'User with the same student number already exists.',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 모든 사용자 조회
   * @returns 사용자 리스트
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [User],
  })
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
}
