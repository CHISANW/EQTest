import { Module } from '@nestjs/common';
import { UserModule } from './domains/user/user.module';
import { MysqlModule } from './providers/mysql/mysql.module';
import { Web3Module } from './providers/web3/web3.module';
import { BlockModule } from './domains/blockchain-transactions/block.module';
import { RabbitExModule } from './providers/rabbitmq/rabbitmq.module';
import { TokenModule } from './domains/token/token.module';
import { ViewModule } from './providers/view/view.module';
import { CoinModule } from './domains/coin/coin.module';
import { AxiosModule } from './providers/axios/axios.module';
import { FileModule } from './domains/file/file.module';
import { MailModule } from './providers/mail/mail.module';

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
    FileModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
