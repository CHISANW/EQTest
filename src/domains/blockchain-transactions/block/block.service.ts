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

  async generateRandomTransactions(): Promise<number> {
    const txCount = Math.floor(Math.random() * 10) + 1; // 1~10개의 랜덤 함수 생성
    console.log('시도 횟수', txCount);
    for (let i = 1; i <= txCount; i++) {
      console.log('---------------------------------------------------- ');
      await this.sendCoin(1);
    }

    return txCount;
  }

  async sendCoin(userId: number): Promise<any> {
    const amount = userId === 10 ? 1 : userId + 1;

    if (userId > 10) return;
    const from = await this.userRepository.findById(userId);
    const to = await this.userRepository.findById(amount);

    console.log('       =================================    ');
    const promise = await this.web3Service.transaction(
      from?.address,
      from?.private_key,
      to?.address,
    );

    const formattedTime = format(new Date(), 'yyyy-MM-dd HH:mm');
    console.log(
      `실행 시간 ${formattedTime}: , | 트랜잭션 완료 | 사용자 : ${userId} | 트랜잭션 함수 : ${promise}`,
    );
    // set.push({ userId, transactionHash: promise });

    this.rabbitMQService.publish(promise);

    return this.sendCoin(userId + 1);
  }
}
