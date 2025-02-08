import {
  Controller,
  DefaultValuePipe,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BlockService } from './block.service';
import { Cron } from '@nestjs/schedule';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  @Cron('0 */30 * * * *')
  executeBotTransactions(
    @Query('amount', new DefaultValuePipe('100')) amount: string,
    @Query('iteration', new DefaultValuePipe(0)) iteration: number,
  ) {
    this.blockService.generateRandomTransactions(iteration, amount);
    return {
      success: true,
      message: 'SUCCESS BOT',
    };
  }
}
