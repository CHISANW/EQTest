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

  async findById(userId: number, transaction?: EntityManager): Promise<User> {
    return transaction
      ? await transaction
          .getRepository(User)
          .findOneOrFail({ where: { user_id: userId } })
      : await this.userRepository.findOneOrFail({ where: { user_id: userId } });
  }
}
