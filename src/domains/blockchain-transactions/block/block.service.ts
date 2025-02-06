import { Inject, Injectable } from '@nestjs/common';
import { Web3Service } from '../../../providers/web3/web3.service';

@Injectable()
export class BlockService {
  constructor(private readonly web3Service: Web3Service) {}

  async generateRandomTransactions(): Promise<void> {
    const txCount = Math.floor(Math.random() * 10) + 1; // 1~5개의 트랜잭션 생성
    console.log('랜덤한 함수', txCount);

    for (let i = 0; i < txCount; i++) {
      await this.web3Service.transaction();
    }
  }
}
