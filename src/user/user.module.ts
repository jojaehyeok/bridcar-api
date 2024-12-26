import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // TypeOrmModule 등록
  exports: [TypeOrmModule], // 필요 시 exports로 내보냄
})
export class UserModule {}
