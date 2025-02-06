import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entites/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User, 'connection')
    private readonly userRepository: Repository<User>,
  ) {}

  async save(user: User, transaction?: EntityManager): Promise<User> {
    console.log(user);
    if (transaction) {
      return transaction.getRepository(User).save(user);
    }
    return this.userRepository.save(user);
  }

  async findById(userId: number, transaction?: EntityManager) {
    if (transaction) {
      return transaction
        .getRepository(User)
        .findOne({ where: { user_id: userId } });
    }

    return await this.userRepository.findOne({
      where: { user_id: userId },
    });
  }
}
