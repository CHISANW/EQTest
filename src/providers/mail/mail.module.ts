import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import * as process from 'node:process';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailController } from './mail.controller';
import { FileModule } from '../../domains/file/file.module';

@Module({
  imports: [
    FileModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: Number(process.env.MAIL_PORT),
          auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASS,
          },
        },
        defaults: {
          from: `"BOT" <${process.env.MAIL_ADDRESS}>`, // 보낸사람
        },
      }),
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
