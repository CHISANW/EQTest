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
    const newVar = await this.eqHubService.getTransactionReceipt(image);
    console.log('폴링 = ', newVar.data.receipt.status);
  }

  async publish(txHash: string) {
    this.amqpConnection.publish('test', 'test-rt', {
      image: txHash,
    });
  }
}
