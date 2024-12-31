import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async createUser(name: string, studentNumber: string): Promise<User> {
    try {
      const user = this.userRepo.create({ name, studentNumber });
      return await this.userRepo.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Student number already exists');
      }
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.find();
  }
}
