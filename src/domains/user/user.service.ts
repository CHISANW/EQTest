import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserRepository } from './repositories/user.repository';
import { User } from './entites/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectDataSource('connection')
    private readonly connection1: DataSource,
    private readonly userRepository: UserRepository,
  ) {}

  async save(accounts: any[]): Promise<any> {
    for (const account of accounts) {
      const { address, privateKey } = account;
      await this.userRepository.save(User.of(address, privateKey));
    }
  }

  async findUsers(formUserId: number, toUserId: number) {
    const from = await this.userRepository.findById(formUserId);
    const to = await this.userRepository.findById(toUserId);
    return { from, to };
  }
}
