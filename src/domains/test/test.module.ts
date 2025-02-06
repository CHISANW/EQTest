import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { Web3Module } from '../../providers/web3/web3.module';
import { TestController } from './test.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [Web3Module, ScheduleModule.forRoot()],
  providers: [TestService],
  controllers: [TestController],
  exports: [TestService],
})
export class TestModule {}
