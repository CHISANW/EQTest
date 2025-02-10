import { Injectable } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EqHubService } from '../web3/eqbr.service';
import { FileService } from '../../domains/file/file.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class RabbitMQService {
  constructor(
    private readonly eqHubService: EqHubService,
    private readonly amqpConnection: AmqpConnection,
    private readonly fileService: FileService,
    private readonly mailService: MailService,
  ) {}

  @RabbitSubscribe({
    exchange: 'bot',
    routingKey: 'bot-coinTx',
    queue: 'BotQ',
  })
  public async subscribeCoinTransaction(msg: any) {
    const { hash: txHash } = msg;
    await this.eqHubService.getTransactionReceipt(txHash);
  }

  async publishCoin(txHash: string) {
    await this.amqpConnection.publish('bot', 'bot-coinTx', {
      hash: txHash,
    });
  }

  @RabbitSubscribe({
    exchange: 'bot',
    routingKey: 'bot-file',
    queue: 'BotQ-file',
  })
  public async subscribeFile(msg: any) {
    const { dir: dir, content: content } = msg;
    await this.fileService.writeToFile(content, dir);
  }

  async publishFile(dir: string, content: string) {
    await this.amqpConnection.publish('bot', 'bot-file', {
      dir: dir,
      content: content,
    });
  }

  @RabbitSubscribe({
    exchange: 'bot',
    routingKey: 'bot-email',
    queue: 'BotQ-email',
  })
  public async subscribeEmail(msg: any) {
    const { uuid: uuid, email: email } = msg;
    if (email) {
      console.log(`----- sendEmail : ${email} ----`);
      await this.mailService.sendEmail(email, uuid);
    }
  }

  async publishEmail(email: string, uuid: any) {
    await this.amqpConnection.publish('bot', 'bot-email', {
      uuid: uuid,
      email: email,
    });
  }
}
