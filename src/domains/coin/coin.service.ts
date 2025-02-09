import { Inject, Injectable } from '@nestjs/common';
import { User } from '../user/entites/user.entity';
import { Web3Service } from '../../providers/web3/web3.service';
import { UserService } from '../user/user.service';
import { RabbitMQService } from '../../providers/rabbitmq/rabbitmq.service';
import { ViewService } from '../../providers/view/view.service';
import { APP } from '../../config/constants/constants';

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
    retry: number = APP.RETRY_COUNT,
  ): Promise<number> {
    if (index === 11) {
      return index;
    }

    try {
      await this.sendCoinTransaction(user.from, user.to, index, type);
    } catch (err) {
      if (retry > APP.ZERO) {
        return await this.retrySendCoin(user, index, type, retry);
      }
    }

    let nextFromId = user.to.user_id;
    let nextToId = nextFromId === 10 ? 1 : nextFromId + 1;

    return await this.sendCoin(
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

  private async retrySendCoin(
    user: any,
    index: number,
    type: number,
    retry: number,
  ) {
    await new Promise((resolve) => setTimeout(resolve, APP.WAIT_TIME));
    return await this.sendCoin(user, index, type, retry);
  }
}
