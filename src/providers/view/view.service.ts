import { format } from 'date-fns';

export interface ViewService {
  printTransactionSummary(iteration: number): number;
  printCoinTransactionLog(
    from: User,
    to: User,
    index: number,
    type: number,
    transaction: string,
  ): void;
  rechargeToken(txHash: string): void;
  logTransactionHash(txHash: string): void;
  logPollingHash(status: boolean, txHash: string): void;
}

import { Injectable } from '@nestjs/common';
import { User } from '../../domains/user/entites/user.entity';

@Injectable()
export class ViewServiceImpl implements ViewService {
  printTransactionSummary(iteration: number): number {
    const iterationCount =
      iteration === 0 ? Math.floor(Math.random() * 10) + 1 : iteration;
    const count = iterationCount * 10; // 1~10개의 랜덤 함수 생성
    const formattedTime = format(new Date(), 'yyyy-MM-dd HH:mm');
    console.log(`최초 실행 일 : ${formattedTime} ,총 실행 횟수 ${count}`);
    return iterationCount;
  }
  printCoinTransactionLog(
    from: User,
    to: User,
    index: number,
    type: number,
    transaction: string,
  ): void {
    const formattedTime = format(new Date(), 'yyyy-MM-dd HH:mm');
    console.log(`
    🔥[코인 전송]
  ========================================================================================
  |           Transaction triggered ${index}                                                      |
  ========================================================================================
  | Run Time        : ${formattedTime}                                                   |
  | User            : ${from.user_id}                                                  |
  | Amount Sent     : ${to.user_id}                                                  |
  | Amount type     : ${type}                                                  |
  | Transaction Hash: ${transaction} |
  ========================================================================================
`);
  }

  rechargeToken(txHash: string) {
    if (txHash) {
      console.log(`[토큰 충전] ✅ 성공 | 트랜잭션 해시: ${txHash}`);
    }
  }

  logTransactionHash(txHash: string): void {
    console.log(`🔥[토큰 전송] 트랜잭션 해시: ${txHash}`);
  }

  logPollingHash(status: boolean, txHash: string): void {
    console.log(
      `🔥 [코인 폴링]  폴링 상태 : ${status} | 트랜잭션 해시 : ${txHash}`,
    );
  }
}
