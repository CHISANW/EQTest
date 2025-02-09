import { Module } from '@nestjs/common';
import { CoinService, CoinServiceImpl } from './coin.service';
import { Web3Module } from '../../providers/web3/web3.module';
import { RabbitExModule } from '../../providers/rabbitmq/rabbitmq.module';
import { UserModule } from '../user/user.module';
import { ViewModule } from '../../providers/view/view.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [Web3Module, RabbitExModule, UserModule, ViewModule, FileModule],
  providers: [
    {
      provide: 'CoinService',
      useClass: CoinServiceImpl,
    },
  ],
  exports: ['CoinService'],
})
export class CoinModule {}
