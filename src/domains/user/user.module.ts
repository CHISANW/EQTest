import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './entites/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User], 'connection'), UserModule],
  controllers: [],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class UserModule {}
