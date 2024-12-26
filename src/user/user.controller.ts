import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createUser(
    @Body() body: { name: string; studentNumber: string },
  ): Promise<User> {
    return this.userService.createUser(body.name, body.studentNumber);
  }
}
