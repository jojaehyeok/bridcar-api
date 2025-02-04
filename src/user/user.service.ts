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

  /**
   * 단일 사용자 생성
   */
  async createUser(name: string, studentNumber: string): Promise<User> {
    const user = this.userRepository.create({ name, studentNumber });
    return await this.userRepository.save(user);
  }

  /**
   * 여러 사용자 생성
   */
  async createMultipleUsers(users: { name: string; studentNumber: string }[]): Promise<User[]> {
    const newUsers = users.map((user) => this.userRepository.create(user));
    return await this.userRepository.save(newUsers);
  }

  /**
   * 모든 사용자 조회
   */
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
