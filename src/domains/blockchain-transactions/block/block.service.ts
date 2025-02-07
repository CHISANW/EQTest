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
      const user = await this.findUsers(1);

      const [newIndex] = await Promise.all([
        this.sendCoin(user, index),
        this.sendToken(),
      ]);

      index = newIndex; // index 값 업데이트
    }
  }

  async sendToken(): Promise<void> {
    await this.tokenService.sendToken(0);
  }

  async findUsers(userId: number): Promise<{ from: User; to: User }> {
    const amount = userId === 10 ? 1 : userId + 1;
    const from = await this.userRepository.findById(userId);
    const to = await this.userRepository.findById(amount);
    return { from, to }; // 객체 형태로 반환
  }

  async sendCoin(
    user: { from: User; to: User },
    index: number,
  ): Promise<number> {
    const amount = user.from.user_id === 10 ? 1 : user.from.user_id + 1;
    if (user.from.user_id > 10) {
      return index;
    }

    await this.send(user.from, user.to, index);
    return this.sendCoin(
      {
        from: user.to,
        to: await this.userRepository.findById(amount),
      },
      index + 1,
    );
  }

  private async send(from: User, to: User, index: number) {
    return await this.web3Service
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
      });
  }
}
