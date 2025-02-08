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
    const { image: txHash } = msg;
    await this.eqHubService.getTransactionReceipt(txHash);
  }

  publishCoin(txHash: string) {
    this.amqpConnection.publish('bot', 'test-rt', {
      image: txHash,
    });
  }

  // @RabbitSubscribe({
  //   exchange: 'bot',
  //   routingKey: 'bot-tokenTx',
  //   queue: 'BotQ',
  // })
  // public async subscribeTokenTransaction(msg: any) {
  //   const { txHash } = msg;
  //   await this.eqHubService.getTransactionReceipt(txHash);
  // }



  // async tokenPublish(txHash: string) {
  //   await this.amqpConnection.publish('test', 'test-rt1', {
  //     txHash: txHash,
  //   });
  // }
}
