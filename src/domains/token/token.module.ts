import { forwardRef, Module } from '@nestjs/common';
import { TokenServiceImpl } from './token.serviceImpl';
import { Web3Module } from '../../providers/web3/web3.module';

@Module({
  imports: [Web3Module],
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
