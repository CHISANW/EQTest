import { Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { ViewService } from '../../providers/view/view.service';
import { UserService } from '../user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { CoinService } from '../coin/coin.service';
import { RabbitMQService } from '../../providers/rabbitmq/rabbitmq.service';

@Injectable()
export class BlockService {
  constructor(
    private readonly userService: UserService,
    private readonly rabbitMQService: RabbitMQService,
    @Inject('ViewService') private readonly viewService: ViewService,
    @Inject('TokenService') private readonly tokenService: TokenService,
    @Inject('CoinService') private readonly coinService: CoinService,
  ) {}

  async generateRandomTransactions(
    iteration: number,
    amount: string,
    email: string,
  ) {
    let number = this.viewService.printTransactionSummary(iteration);
    await this.executeTransactions(number, amount, email);
  }

  private async executeTransactions(
    number: number,
    amount: string,
    email: string,
  ) {
    let index = 1;
    const randomUUID = uuidv4();
    await Promise.all(
      Array.from({ length: number }).map(async (_, i) => {
        const user = await this.userService.findUsers(1, 2);
        const [newIndex] = await Promise.all([
          this.coinService.sendCoin(user, index, i, randomUUID),
          this.tokenService.sendToken(2, amount, randomUUID),
        ]);
        index = newIndex;
      }),
    );

    if (email) {
      this.rabbitMQService.publishEmail(email, randomUUID);
    }
  }
}
