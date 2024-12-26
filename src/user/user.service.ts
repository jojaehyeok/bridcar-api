import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(name: string, studentNumber: string): Promise<User> {
    const user = this.userRepository.create({ name, studentNumber });
    return this.userRepository.save(user);
  }

  async findUserByStudentNumber(studentNumber: string): Promise<User> {
    return this.userRepository.findOne({ where: { studentNumber } });
  }
}
