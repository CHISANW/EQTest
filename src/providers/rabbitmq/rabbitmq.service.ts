import { Injectable } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EqHubService } from '../web3/eqbr.service';

@Injectable()
export class RabbitMQService {
  constructor(
    private readonly eqHubService: EqHubService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: 'bot',
    routingKey: 'bot-coinTx',
    queue: 'BotQ',
  })
  public async subscribeCoinTransaction(msg: any) {
    const { hash: txHash } = msg;
    await this.eqHubService.getTransactionReceipt(txHash);
  }

  publishCoin(txHash: string) {
    this.amqpConnection.publish('bot', 'bot-coinTx', {
      hash: txHash,
    });
  }
}
