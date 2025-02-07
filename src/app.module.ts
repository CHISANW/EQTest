import { Module } from '@nestjs/common';
import { UserModule } from './domains/user/user.module';
import { MysqlModule } from './providers/mysql/mysql.module';
import { Web3Module } from './providers/web3/web3.module';
import { TestModule } from './domains/test/test.module';
import { BlockModule } from './domains/blockchain-transactions/block/block.module';
import { RabbitExModule } from './domains/rabbitMQ/rabbitmq.module';
import { TokenModule } from './domains/token/token.module';

@Module({
  imports: [
    UserModule,
    MysqlModule,
    Web3Module,
    TestModule,
    BlockModule,
    RabbitExModule,
    TokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
