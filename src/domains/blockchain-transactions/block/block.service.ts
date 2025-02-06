import { Inject, Injectable } from '@nestjs/common';
import { Web3Service } from '../../../providers/web3/web3.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { format } from 'date-fns';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQService } from '../../rabbitMQ/rabbitmq.service';

@Injectable()
export class BlockService {
  constructor(
    private readonly web3Service: Web3Service,
    private readonly userRepository: UserRepository,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async generateRandomTransactions() {
    const txCount = Math.floor(Math.random() * 10) + 1; // 1~10개의 랜덤 함수 생성
    const formattedTime = format(new Date(), 'yyyy-MM-dd HH:mm');
    console.log(`최초 실행 일 : ${formattedTime} ,총 실행 횟수`);

    for (let i = 1; i <= txCount; i++) {
      // console.log('---------------------------------------------------- ');
      await this.sendCoin(1);
    }
  }

  async sendCoin(userId: number): Promise<any> {
    const amount = userId === 10 ? 1 : userId + 1;

    if (userId > 10) return;
    const from = await this.userRepository.findById(userId);
    const to = await this.userRepository.findById(amount);

    // console.log('       =================================    ');
    this.web3Service
      .transaction(from?.address, from?.private_key, to?.address)
      .then(async (transaction) => {
        const formattedTime = format(new Date(), 'yyyy-MM-dd HH:mm');
        this.rabbitMQService.publish(transaction);

        console.log(`
  ========================================================================================
  |           Transaction triggered                                                      |
  ========================================================================================
  | Run Time        : ${formattedTime}                                                   |
  | User            : ${userId}                                                  |
  | Amount Sent     : ${amount}                                                  |
  | Transaction Hash: ${transaction} |
  ========================================================================================
`);
        return transaction; // 반환값은 transaction으로 처리
      })
      .catch((reason) => {})
      .finally(async () => {
        return this.sendCoin(userId + 1); // 후속 작업 실행
      });
  }
}
