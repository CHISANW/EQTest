import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import Web3 from 'web3';
import { UserModule } from '../../domains/user/user.module';
import axios from 'axios';
import { EqHubService } from './eqbr.service';

@Module({
  imports: [UserModule],
  providers: [
    Web3Service,
    EqHubService,
    {
      provide: 'WEB3',
      useValue: new Web3(
        new Web3.providers.HttpProvider(
          'https://socket-ag.eqhub.eqbr.com?socketKey=yFbbmbcmFrEIBKeVg9uT8B_nts5ARjQfzNK2iMLhWJE',
        ),
      ),
    },
    {
      provide: 'EQ_HUB_API',
      useFactory: () =>
        axios.create({
          baseURL: 'https://ag.eqhub.eqbr.com/api/',
        }),
    },
  ],
  exports: [Web3Service, 'EQ_HUB_API', EqHubService],
})
export class Web3Module {}
