import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Web3Service } from '../../providers/web3/web3.service';
import { EqHubService } from '../../providers/web3/eqbr.service';

@Injectable()
export class RabbitMQService {
  constructor(private readonly eqHubService: EqHubService) {}

  // @RabbitSubscribe({
  //   exchange: 'test',
  //   routingKey: 'test-rt',
  //   queue: 'test',
  // })
  // public async publicHandler(msg: any) {
  //   const { image } = msg;
  //   const publish = await this.eqHubService.getTransactionReceipt(image);
  //   if (publish.data.receipt.status) {
  //     console.log('트랜잭션 폴링 완료!');
  //   }
  // }
}
