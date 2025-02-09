import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { APP } from '../../config/constants/constants';
import { AxiosProvider } from '../axios/axios-provider.service';
import { ViewService } from '../view/view.service';

@Injectable()
export class EqHubService {
  constructor(
    @Inject('EQ_HUB_API') private readonly eqHubApi: AxiosInstance,
    private readonly axiosProvider: AxiosProvider,
    @Inject('ViewService') private readonly viewService: ViewService,
  ) {}

  async getTransactionReceipt(
    txHash: string,
    retryCount: number = APP.RETRY_COUNT, // 재시도 횟수// 재시도 간격 (10초)
  ): Promise<any> {
    try {
      const axiosResponse = await this.handlerReceipt(txHash);
      this.viewService.logPollingHash(
        axiosResponse.data.receipt.status,
        axiosResponse.data.receipt.transactionHash,
      );
      return axiosResponse;
    } catch (error) {
      return await this.retryTransactionReceipt(retryCount, txHash);
    }
  }

  private async handlerReceipt(txHash: string) {
    const headers1 = AxiosProvider.getHeaders();

    return await this.eqHubApi.get(
      this.axiosProvider.getTransactionReceiptUrl(txHash),
      {
        headers: headers1,
      },
    );
  }

  private async retryTransactionReceipt(retryCount: number, txHash: string) {
    if (retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, APP.WAIT_TIME));
      return await this.getTransactionReceipt(txHash, retryCount - 1); // 재시도
    }
  }
}
