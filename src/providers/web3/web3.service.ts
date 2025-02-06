import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../domains/user/user.service';
import { EqHubService } from './eqbr.service';

@Injectable()
export class Web3Service {
  constructor(
    @Inject('WEB3') private readonly web3: any,
    private readonly userService: UserService,
    private readonly eqbrService: EqHubService,
  ) {}

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

  public async transaction(fromAddress, privateKey, toAddresss): Promise<any> {
    const tx = await this.createTransaction(fromAddress, toAddresss);

    const signedTxPromise = this.signTransaction(tx, privateKey);
    const signedTx = await signedTxPromise;

    return (await this.sendTransaction(signedTx)).transactionHash;
  }

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
      gasPrice: this.web3.utils.toWei('10', 'gwei'),
      nonce: nonce,
    };
  }

  private async signTransaction(
    txObject: any,
    privateKey: string,
  ): Promise<any> {
    return await this.web3.eth.accounts.signTransaction(txObject, privateKey);
  }

  private async sendTransaction(signedTx: any): Promise<any> {
    if (!signedTx.rawTransaction) {
      throw new Error('No rawTransaction found in signedTx.');
    }
    return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }
}
