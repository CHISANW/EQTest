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
}
