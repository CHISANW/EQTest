import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { Config } from '../../config/config';

@Injectable()
export class EqHubService {
  constructor(@Inject('EQ_HUB_API') private readonly eqHubApi: AxiosInstance) {}

  async getTransactionReceipt(
    txHash: string,
    retries: number = 3, // 재시도 횟수
    delay: number = 10000, // 재시도 간격 (10초)
    first: boolean = true,
  ): Promise<any> {
    const getTransactionReceiptUrl = `/v2/request/transaction/${txHash}/receipt?microChainId=43161`;
    try {
      const axiosResponse = await this.eqHubApi.get(getTransactionReceiptUrl, {
        headers: {
          accept: 'application/json',
          'x-eq-ag-api-key': Config.getEnvironment().EQHUB_KEY,
        },
      });

      if (axiosResponse.data.receipt.status === false && first) {
        throw new Error('오류 발생');
      }
      console.log(`폴링 성공`);
      return axiosResponse;
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return await this.getTransactionReceipt(
          txHash,
          retries - 1,
          delay,
          false,
        ); // 재시도
      } else {
        return { error: '최대 재시도 횟수를 초과했습니다.' }; // 예외 대신 반환할 데이터
      }
    }
  }
}
