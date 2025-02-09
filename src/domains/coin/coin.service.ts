import { Inject, Injectable } from '@nestjs/common';
import { User } from '../user/entites/user.entity';
import { Web3Service } from '../../providers/web3/web3.service';
import { UserService } from '../user/user.service';
import { RabbitMQService } from '../../providers/rabbitmq/rabbitmq.service';
import { ViewService } from '../../providers/view/view.service';
import { APP } from '../../config/constants/constants';
import { FileService } from '../file/file.service';

export interface CoinService {
  sendCoin(
    user: any,
    index: number,
    type: number,
    uuid: any,
    retry?: number,
  ): Promise<number>;
}

@Injectable()
export class CoinServiceImpl implements CoinService {
  constructor(
    private readonly web3Service: Web3Service,
    private readonly userService: UserService,
    private readonly rabbitMQService: RabbitMQService,
    private readonly fileService: FileService,
    @Inject('ViewService') private readonly viewService: ViewService,
  ) {}

  async sendCoin(
    user: any,
    index: number,
    type: number,
    uuid: any,
    retry: number = APP.RETRY_COUNT,
  ): Promise<number> {
    if (index === 11) {
      return index;
    }
    try {
      await this.sendCoinTransaction(user.from, user.to, index, type, uuid);
    } catch (err) {
      if (retry > APP.ZERO) {
        return await this.retrySendCoin(user, index, type, retry, uuid);
      }
    }

    let nextFromId = user.to.user_id;
    let nextToId = nextFromId === 10 ? 1 : nextFromId + 1;

    return await this.sendCoin(
      await this.userService.findUsers(nextFromId, nextToId),
      index + 1,
      type,
      uuid,
      retry - 1,
    );
  }

  private async sendCoinTransaction(
    from: User,
    to: User,
    index: number,
    type: number,
    uuid: any,
  ) {
    return await this.web3Service
      .transaction(from?.address, from?.private_key, to?.address)
      .then(async (transaction) => {
        await this.rabbitMQService.publishCoin(transaction);
        await this.rabbitMQService.publishFile(uuid, transaction);
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
    uuid: any,
  ) {
    await new Promise((resolve) => setTimeout(resolve, APP.WAIT_TIME));
    return await this.sendCoin(user, index, type, uuid, retry);
  }
}
