import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { forwardRef, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { Web3Module } from '../web3/web3.module';
import { BlockModule } from '../../domains/blockchain-transactions/block.module';
import { FileModule } from '../../domains/file/file.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    Web3Module,
    FileModule,
    MailModule,
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
