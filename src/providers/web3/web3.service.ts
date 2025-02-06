import { Inject, Injectable } from '@nestjs/common';
import { Web3 } from 'web3';
import { UserService } from '../../domains/user/user.service';
import { EqHubService } from './eqbr.service';

@Injectable()
export class Web3Service {
  constructor(
    @Inject('WEB3') private readonly web3: any,
    private readonly userService: UserService,
    private readonly eqbrService: EqHubService,
  ) {}

  getWeb3(): Web3 {
    return this.web3;
  }

  async createAccounts() {
    const accountList: any[] = [];
    for (let i = 0; i < 10; i++) {
      accountList.push(this.web3.eth.accounts.create());
    }

    await this.userService.save(accountList);
    console.log(accountList);
  }

  validAddress(key: string, address: string) {
    if (this.web3.utils.isAddress(address)) {
      console.log('올바른 주소');
    } else console.log('올바르지 않은 주소');

    const account = this.web3.eth.accounts.privateKeyToAccount(key);
    const restoredAddress = account.address;
    console.log(restoredAddress);
  }

  public async transaction(): Promise<void> {
    const receiverAddress = '0xAa0fd71E5c8D3f91705C4474A71551a140368137'; // 수신자 주소
    const account = this.web3.eth.accounts.create(); // 새 계정 생성
    const tx = await this.createTransaction(account.address, receiverAddress);
    const signedTx = await this.signTransaction(tx, account.privateKey);
    const transaction = await this.sendTransaction(signedTx);
    console.info('끝');
    return transaction.transactionHash;
    // const axiosResponse = await this.eqbrService.getTransactionReceipt(transaction.transactionHash);
    // console.log(axiosResponse.data.receipt);
  }

  public async polling(transactionHash: string): Promise<any> {}

  private async createTransaction(
    senderAddress: string,
    receiverAddress: string,
  ) {
    const nonce = await this.web3.eth.getTransactionCount(
      senderAddress,
      'latest',
    );
    return {
      from: senderAddress,
      to: receiverAddress,
      value: this.web3.utils.toWei('0', 'ether'), // 0이더 전송
      gas: 21000,
      gasPrice: this.web3.utils.toWei('20', 'gwei'),
      nonce: nonce,
    };
  }

  private async signTransaction(
    txObject: any,
    privateKey: string,
  ): Promise<any> {
    const signTransaction = await this.web3.eth.accounts.signTransaction(
      txObject,
      privateKey,
    );
    return signTransaction;
  }

  private async sendTransaction(signedTx: any): Promise<any> {
    if (!signedTx.rawTransaction) {
      throw new Error('No rawTransaction found in signedTx.');
    }
    return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }
}
