import { Injectable } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EqHubService } from '../../providers/web3/eqbr.service';

@Injectable()
export class RabbitMQService {
  constructor(
    private readonly eqHubService: EqHubService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: 'test',
    routingKey: 'test-rt',
    queue: 'test',
  })
  public async publicHandler(msg: any) {
    const { image } = msg;
    await this.eqHubService.getTransactionReceipt(image);
  }

  @RabbitSubscribe({
    exchange: 'test',
    routingKey: 'test-rt1',
    queue: 'test',
  })
  public async publicTokenHandler(msg: any) {
    const { txHash } = msg;
    await this.eqHubService.getTransactionReceipt(txHash);
  }

  publish(txHash: string) {
    this.amqpConnection.publish('test', 'test-rt', {
      image: txHash,
    });
  }

  async tokenPublish(txHash: string) {
    await this.amqpConnection.publish('test', 'test-rt1', {
      txHash: txHash,
    });
  }
}
