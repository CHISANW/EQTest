import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { TokenService } from './token.service';
import { EqHubService } from '../../providers/web3/eqbr.service';
import { UserRepository } from '../user/repositories/user.repository';

@Injectable()
export class TokenServiceImpl implements TokenService {
  constructor(
    private readonly eqHubService: EqHubService,
    private readonly userRepository: UserRepository,
  ) {}

  async fillAmount(): Promise<void> {
    const url =
      'https://ag.eqhub.eqbr.com/api/v1/token-kits/kits/13/issuances/issue?accountId=';
    const accountId = 'c780e24c-10a5-4fd2-8ba4-045d51f6fe9d';
    const headers = {
      'Content-Type': 'application/json',
      'x-eq-ag-api-key': 'gnon8mrBx2gxvdEvCPOBBWvhlVQezi93S9RTKjuReUc',
    };

    const body = {
      issuanceObjects: [
        {
          recipientAddress: '0x2A6981eB09Cf3e99BEA8CfC093D89335d317094b',
          amount: '10000',
        },
      ],
    };

    try {
      const response = await axios.post(url + accountId, body, { headers });
      return response.data.transaction_hash;
    } catch (error) {
      console.error(
        '에러 발생:',
        error.response ? error.response.data : error.message,
      );
    }
  }

  async sendToken(userId: number, retryCount = 0): Promise<any> {
    if (userId > 11) {
      console.log('✅ 재귀 종료: userId =', userId);
      return;
    }

    const url =
      'https://ag.eqhub.eqbr.com/api/v1/token-kits/kits/13/transfers/transfer?accountId=c780e24c-10a5-4fd2-8ba4-045d51f6fe9d';

    const headers = {
      'Content-Type': 'application/json',
      'x-eq-ag-api-key': 'gnon8mrBx2gxvdEvCPOBBWvhlVQezi93S9RTKjuReUc',
    };

    const nextUserId = userId === 10 ? 1 : userId + 1;
    console.log('📌 다음 사용자 아이디:', nextUserId);

    let user;
    try {
      user = await this.userRepository.findById(nextUserId);
    } catch (err) {
      console.error('❌ 사용자 조회 실패:', err.message);
      return;
    }

    const body = {
      transferObjects: [
        {
          recipientAddress: user.meta_address,
          amount: `100`,
        },
      ],
    };

    try {
      const response = await axios.post(url, body, { headers });
      console.log('✅ 전송 성공:', response.data);

      // 다음 사용자에게 재귀 호출
      return this.sendToken(nextUserId);
    } catch (error) {
      console.error(
        '❌ 에러 발생:',
        error.response ? error.response.data : error.message,
      );

      if (retryCount < 2) {
        console.log(`⏳ ${retryCount + 1}번째 재시도 (10초 대기)...`);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 10초 대기 후 재시도
        return this.sendToken(userId, retryCount + 1);
      }

      console.log('⚠️ 최대 재시도 횟수 초과, 다음 사용자로 이동');
      return this.sendToken(nextUserId); // 다음 사용자로 넘어감
    }
  }

  deleteAmount(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
