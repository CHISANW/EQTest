import { Controller, Get, Post } from '@nestjs/common';
import { BlockService } from '../blockchain-transactions/block/block.service';
import { Cron } from '@nestjs/schedule';

@Controller('rabbit')
export class RabbitMQController {
  constructor(private readonly blockService: BlockService) {}

  // @Cron('0 0 * * * *') // 정각마다
  @Cron('0 */30 * * * *') // 30분 마다
  @Post()
  rabbit() {
    this.blockService.generateRandomTransactions();
    return 'EQ-TRANSACTION_BOT_EXCE';
  }
}
