import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { TokenService } from './token.service';
import { EqHubService } from '../../providers/web3/eqbr.service';

@Injectable()
export class TokenServiceImpl implements TokenService {
  constructor(private readonly eqHubService: EqHubService) {}

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
      // await this.eqHubService.getTransactionReceipt(
      //   response.data.transaction_hash,
      // );
      console.log('실ㅇ행은 됬고', response.data);
      return response.data.transaction_hash;
    } catch (error) {
      console.error(
        '에러 발생:',
        error.response ? error.response.data : error.message,
      );
    }
  }

  async sendToken(metaAddress: any): Promise<any> {
    const url =
      'https://ag.eqhub.eqbr.com/api/v1/token-kits/kits/13/transfers/transfer?accountId=c780e24c-10a5-4fd2-8ba4-045d51f6fe9d';

    const headers = {
      'Content-Type': 'application/json',
      'x-eq-ag-api-key': 'gnon8mrBx2gxvdEvCPOBBWvhlVQezi93S9RTKjuReUc',
    };

    const body = {
      transferObjects: [
        {
          recipientAddress: metaAddress,
          amount: `100`,
        },
      ],
    };

    try {
      const response = await axios.post(url, body, { headers });
      return response.data.transaction_hash;
    } catch (error) {
      console.error(
        '에러 발생:',
        error.response ? error.response.data : error.message,
      );
    }
  }

  deleteAmount(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
