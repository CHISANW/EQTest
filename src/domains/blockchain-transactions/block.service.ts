import { Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { ViewService } from '../../providers/view/view.service';
import { UserService } from '../user/user.service';
import { CoinService } from '../coin/coin.service';

@Injectable()
export class BlockService {
  constructor(
    private readonly userService: UserService,
    @Inject('ViewService') private readonly viewService: ViewService,
    @Inject('TokenService') private readonly tokenService: TokenService,
    @Inject('CoinService') private readonly coinService: CoinService,
  ) {}

  async generateRandomTransactions(iteration: number, amount: string) {
    let number = this.viewService.printTransactionSummary(iteration);
    await this.executeTransactions(number, amount);
  }

  private async executeTransactions(number: number, amount: string) {
    let index = 1;
    await Promise.all(
      Array.from({ length: number }).map(async (_, i) => {
        const user = await this.userService.findUsers(1, 2);
        const [newIndex] = await Promise.all([
          this.coinService.sendCoin(user, index, i),
          this.tokenService.sendToken(0, amount),
        ]);
        index = newIndex;
      }),
    );
  }
}
