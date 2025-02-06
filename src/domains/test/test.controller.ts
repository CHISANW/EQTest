import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TestService } from './test.service';
import { Web3Service } from '../../providers/web3/web3.service';
import { Cron } from '@nestjs/schedule';

@Controller('test')
export class TestController {
  constructor(
    private readonly web3Service: Web3Service,
    private readonly testService: TestService,
  ) {}

  @Post('/a')
  async create() {
    await this.web3Service.createAccounts();
  }

  @Get('/b')
  en(@Query('key') key: string, @Query('address') address: string) {
    this.web3Service.validAddress(key, address);
  }

  // @Cron('0 */2 * * * *')
  @Post('/b')
  aaaa() {
    console.log('발생', new Date().getUTCMinutes());
    this.web3Service.transaction();
  }

  @Get('/c')
  cccc() {}
}
