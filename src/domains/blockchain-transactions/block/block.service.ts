import { Inject, Injectable } from '@nestjs/common';
import { Web3Service } from '../../../providers/web3/web3.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { format } from 'date-fns';
import { RabbitMQService } from '../../rabbitMQ/rabbitmq.service';
import { TokenService } from '../../token/token.service';
import { User } from '../../user/entites/user.entity';

@Injectable()
export class BlockService {
  constructor(
    private readonly web3Service: Web3Service,
    private readonly userRepository: UserRepository,
    private readonly rabbitMQService: RabbitMQService,
    @Inject('TokenService') private readonly tokenService: TokenService,
  ) {}

  async generateRandomTransactions() {
    const txCount = Math.floor(Math.random() * 10) + 1; // 1~10개의 랜덤 함수 생성
    const formattedTime = format(new Date(), 'yyyy-MM-dd HH:mm');
    console.log(
      `최초 실행 일 : ${formattedTime} ,총 실행 횟수 ${txCount * 10}`,
    );

    let index = 0;
    for (let i = 1; i <= txCount; i++) {
      console.log('*******************************');
      index = await this.sendCoin(1, index);
      console.log('*******************************');
    }
  }

  async sendCoin(userId: number, index: number): Promise<any> {
    const amount = userId === 10 ? 1 : userId + 1;

    if (userId > 10) {
      return index;
    }

    const from = await this.userRepository.findById(userId);
    const to = await this.userRepository.findById(amount);

    // await this.send(<User>from, <User>to, index);
    const newVar = await this.tokenService.sendToken(from?.meta_address);
    await this.tokenPublish(newVar);

    return this.sendCoin(userId + 1, ++index);
  }

  private async tokenPublish(newVar: string): Promise<any> {
    await this.rabbitMQService.tokenPublish(newVar);
  }

  async test() {
    await this.tokenService.fillAmount();
  }

  async test1() {
    await this.tokenService.sendToken(
      '0x3CBD86D2a29353De9864C7B9ca144BbA211B7937',
    );
  }

  private async send(from: User, to: User, index: number) {
    await this.web3Service
      .transaction(from?.address, from?.private_key, to?.address)
      .then(async (transaction) => {
        const formattedTime = format(new Date(), 'yyyy-MM-dd HH:mm');
        this.rabbitMQService.publish(transaction);
        console.log(`
  ========================================================================================
  |           Transaction triggered ${index}                                                      |
  ========================================================================================
  | Run Time        : ${formattedTime}                                                   |
  | User            : ${from.user_id}                                                  |
  | Amount Sent     : ${to.user_id}                                                  |
  | Transaction Hash: ${transaction} |
  ========================================================================================
`);
        return transaction; // 반환값은 transaction으로 처리
      })
      .catch((reason) => {});
  }
}
