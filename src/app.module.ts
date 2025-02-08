import { Module } from '@nestjs/common';
import { UserModule } from './domains/user/user.module';
import { MysqlModule } from './providers/mysql/mysql.module';
import { Web3Module } from './providers/web3/web3.module';
import { BlockModule } from './domains/blockchain-transactions/block.module';
import { RabbitExModule } from './providers/rabbitmq/rabbitmq.module';
import { TokenModule } from './domains/token/token.module';
import { ViewModule } from './providers/view/view.module';
import { CoinModule } from './domains/coin/coin.module';
import { AxiosProvider } from './providers/axios/axios-provider.service';
import { AxiosModule } from './providers/axios/axios.module';

@Module({
  imports: [
    UserModule,
    MysqlModule,
    Web3Module,
    BlockModule,
    RabbitExModule,
    TokenModule,
    ViewModule,
    CoinModule,
    AxiosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
