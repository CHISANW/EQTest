import { forwardRef, Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { Web3Module } from '../../../providers/web3/web3.module';
import { UserModule } from '../../user/user.module';
import { RabbitExModule } from '../../rabbitMQ/rabbitmq.module';

@Module({
  imports: [Web3Module, UserModule, forwardRef(() => RabbitExModule)],
  providers: [BlockService],
  controllers: [BlockController],
  exports: [BlockService],
})
export class BlockModule {}
