import { forwardRef, Module } from '@nestjs/common';
import { TokenServiceImpl } from './token.serviceImpl';
import { Web3Module } from '../../providers/web3/web3.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [Web3Module, UserModule],
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
