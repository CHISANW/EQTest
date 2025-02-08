import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { forwardRef, Module } from '@nestjs/common';
// import { RabbitMQController } from '../../domains/rabbitMQ/rabbitmq.controller';
import { RabbitMQService } from './rabbitmq.service';
import { Web3Module } from '../web3/web3.module';
import { BlockModule } from '../../domains/blockchain-transactions/block.module';

@Module({
  imports: [
    Web3Module,
    forwardRef(() => BlockModule),
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'bot',
          type: 'topic',
        },
      ],
      uri: 'amqp://guest:guest@localhost:5672',
      connectionInitOptions: { wait: false },
      channels: {
        'channel-1': {
          prefetchCount: 15,
          default: true,
        },
      },
    }),
  ],
  providers: [RabbitMQService],
  controllers: [],
  exports: [RabbitMQService],
})
export class RabbitExModule {}
