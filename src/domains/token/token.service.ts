import { Inject, Injectable } from '@nestjs/common';
import { EqHubService } from '../../providers/web3/eqbr.service';
import { UserRepository } from '../user/repositories/user.repository';
import axios from 'axios';
import { User } from '../user/entites/user.entity';
import { AxiosProvider } from '../../providers/axios/axios-provider.service';
import {
  ViewService,
  ViewServiceImpl,
} from '../../providers/view/view.service';

export interface TokenService {
  fillAmount(): Promise<any>;

  sendToken(userId: number, amount: string, retryCount?: number): Promise<any>;
}

@Injectable()
export class TokenServiceImpl implements TokenService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly axiosProvider: AxiosProvider,
    @Inject('ViewService') private readonly viewService: ViewService,
  ) {}

  async fillAmount(retryCount: number = 5): Promise<any> {
    try {
      const response = await axios.post(
        this.axiosProvider.getFillAmountUrl(),
        this.axiosProvider.createFillBody(),
        { headers: AxiosProvider.getHeaders() },
      );
      return response.data.transaction_hash;
    } catch (error) {
      if (retryCount > 0) {
        await this.fillAmount(retryCount - 1);
      }
    }
  }

  async sendToken(
    userId: number,
    amount: string,
    retryCount: number = 3,
  ): Promise<any> {
    if (userId > 11) {
      return;
    }

    const nextUserId = userId === 10 ? 1 : userId + 1;
    const user = await this.userRepository.findById(nextUserId);

    try {
      let axiosResponse = await axios.post(
        this.axiosProvider.getTransferUrl(),
        this.axiosProvider.createTransferBody(user, amount),
        { headers: AxiosProvider.getHeaders() },
      );
      console.log('코인 해쉬값 : ', axiosResponse.data.transaction_hash);
      return await this.sendToken(nextUserId, amount);
    } catch (error) {
      if (error.response.data.error.message === 'execution reverted') {
        const hash = await this.fillAmount();
        this.viewService.rechargeToken(hash);
      }
      if (retryCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return await this.sendToken(nextUserId, amount, retryCount - 1);
      }
    }
  }
}
