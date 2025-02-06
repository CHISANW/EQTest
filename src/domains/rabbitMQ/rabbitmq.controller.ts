import { Controller, Get } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Web3Service } from '../../providers/web3/web3.service';

@Controller('rabbit')
export class RabbitMQController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly web3Service: Web3Service,
  ) {}

  @Get()
  async rabbit() {
    const promise = await this.web3Service.transaction();
    const b = await this.amqpConnection.publish('test', 'test-rt', {
      image: promise,
    });
    return 'ok';
  }
}
