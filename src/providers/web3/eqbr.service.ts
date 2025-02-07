import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { Config } from '../../config/config';

@Injectable()
export class EqHubService {
  constructor(@Inject('EQ_HUB_API') private readonly eqHubApi: AxiosInstance) {}

  async getTransactionReceipt(
    txHash: string,
    success: number = 0,
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

      console.log(axiosResponse.data);
      // if (axiosResponse.data.receipt.status === false && first) {
      //   throw new Error('오류 발생');
      // }
      success += 1;
      console.log(`폴링 성공 ${success}`);
      return axiosResponse;
    } catch (error) {
      // console.error(error);
      // 재시도 할 횟수가 남아있으면 재시도
      if (retries > 0) {
        console.log(`10초 후에 재시도... (${retries}번 남음)`);
        // 10초 후에 재시도
        await new Promise((resolve) => setTimeout(resolve, delay));
        return await this.getTransactionReceipt(
          txHash,
          success,
          retries - 1,
          delay,
          false,
        ); // 재시도
      } else {
        // 예외를 발생시키지만 종료하지 않고, 예외를 로깅하거나 호출한 곳에서 처리하도록 함
        console.log(
          '최대 재시도 횟수를 초과했습니다. 예외를 발생시키지만 계속 실행됩니다.',
        );
        return { error: '최대 재시도 횟수를 초과했습니다.' }; // 예외 대신 반환할 데이터
      }
    }
  }
}
