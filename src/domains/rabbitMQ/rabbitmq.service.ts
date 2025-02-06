import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Web3Service } from '../../providers/web3/web3.service';
import { EqHubService } from '../../providers/web3/eqbr.service';

@Injectable()
export class RabbitMQService {
  constructor(private readonly eqHubService: EqHubService) {}

  @RabbitSubscribe({
    exchange: 'test',
    routingKey: 'test-routing',
    queue: 'test-queue',
  })
  public async publicHandler(msg: any) {
    await this.eqHubService.getTransactionReceipt(msg);
    console.log(`메시지 수신 : ,${JSON.stringify(msg)}`);
  }
}
