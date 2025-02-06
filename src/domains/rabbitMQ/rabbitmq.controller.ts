import { Controller, Get, Post } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Web3Service } from '../../providers/web3/web3.service';
import { BlockService } from '../blockchain-transactions/block/block.service';
import { Cron } from '@nestjs/schedule';

@Controller('rabbit')
export class RabbitMQController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly web3Service: Web3Service,
    private readonly blockService: BlockService,
  ) {}

  @Cron('0 0 * * * *')
  @Post()
  async rabbit() {
    this.amqpConnection.publish('test', 'test-rt', {
      image: this.blockService.generateRandomTransactions(),
    });
    return 'EQ-TRANSACTION_BOT_EXCE';
  }
}
