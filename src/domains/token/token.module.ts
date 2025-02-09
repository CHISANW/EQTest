import { Module } from '@nestjs/common';
import { Web3Module } from '../../providers/web3/web3.module';
import { UserModule } from '../user/user.module';
import { TokenServiceImpl } from './token.service';
import { AxiosModule } from '../../providers/axios/axios.module';
import { ViewModule } from '../../providers/view/view.module';
import { RabbitExModule } from '../../providers/rabbitmq/rabbitmq.module';

@Module({
  imports: [Web3Module, UserModule, AxiosModule, ViewModule, RabbitExModule],
  providers: [
    {
      provide: 'TokenService',
      useClass: TokenServiceImpl,
    },
  ],
  controllers: [],
  exports: ['TokenService'],
})
export class TokenModule {}
