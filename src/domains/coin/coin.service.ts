import { Inject, Injectable } from '@nestjs/common';
import { User } from '../user/entites/user.entity';
import { Web3Service } from '../../providers/web3/web3.service';
import { UserService } from '../user/user.service';
import { RabbitMQService } from '../../providers/rabbitmq/rabbitmq.service';
import { ViewService } from '../../providers/view/view.service';

export interface CoinService {
  sendCoin(
    user: any,
    index: number,
    type: number,
    retry?: number,
  ): Promise<number>;
}

@Injectable()
export class CoinServiceImpl implements CoinService {
  constructor(
    private readonly web3Service: Web3Service,
    private readonly userService: UserService,
    private readonly rabbitMQService: RabbitMQService,
    @Inject('ViewService') private readonly viewService: ViewService,
  ) {}

  async sendCoin(
    user: any,
    index: number,
    type: number,
    retry: number = 3,
  ): Promise<number> {
    if (index === 11) {
      return index;
    }

    try {
      await this.sendCoinTransaction(user.from, user.to, index, type);
    } catch (err) {
      if (retry > 0) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return await this.sendCoin(user, index, type, retry);
      }
    }

    let nextFromId = user.to.user_id;
    let nextToId = nextFromId === 10 ? 1 : nextFromId + 1;

    return this.sendCoin(
      await this.userService.findUsers(nextFromId, nextToId),
      index + 1,
      type,
      retry - 1,
    );
  }

  private async sendCoinTransaction(
    from: User,
    to: User,
    index: number,
    type: number,
  ) {
    return await this.web3Service
      .transaction(from?.address, from?.private_key, to?.address)
      .then(async (transaction) => {
        this.rabbitMQService.publishCoin(transaction);
        this.viewService.printCoinTransactionLog(
          from,
          to,
          index,
          type,
          transaction,
        );
        return transaction;
      });
  }
}
