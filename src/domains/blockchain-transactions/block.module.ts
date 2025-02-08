import { forwardRef, Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { Web3Module } from '../../providers/web3/web3.module';
import { UserModule } from '../user/user.module';
import { RabbitExModule } from '../../providers/rabbitmq/rabbitmq.module';
import { TokenModule } from '../token/token.module';
import { ViewModule } from '../../providers/view/view.module';
import { CoinModule } from '../coin/coin.module';

@Module({
  imports: [
    Web3Module,
    UserModule,
    forwardRef(() => RabbitExModule),
    TokenModule,
    ViewModule,
    CoinModule,
  ],
  providers: [BlockService],
  controllers: [BlockController],
  exports: [BlockService],
})
export class BlockModule {}
