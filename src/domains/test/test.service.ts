import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Web3 } from 'web3';

@Injectable()
export class TestService {
  server: AxiosInstance;

  // async test(){
  //     let response;
  //     try{
  //         console.log("enter");
  //         response = await this.server.get("")
  //     }
  // }
}
