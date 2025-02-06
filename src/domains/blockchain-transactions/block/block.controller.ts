import { Controller, Post } from '@nestjs/common';
import { BlockService } from './block.service';
import { Cron } from '@nestjs/schedule';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post('a')
  @Cron('0 * * * *')
  async random() {
    await this.blockService.generateRandomTransactions();
  }
}
