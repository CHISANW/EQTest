import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as process from 'node:process';
import { FileService } from '../../domains/file/file.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly fileService: FileService,
  ) {}

  async sendEmail(email: string, uuid: any) {
    const lineCount = await this.fileService.getLineCount(uuid);
    await this.mailerService.sendMail({
      to: email,
      subject: `[Notification] Blockchain Transaction Processed`,
      text: `Hello,

Your requested blockchain transaction has been successfully processed.

🔹Total Transaction Count : ${lineCount};
🔹View on Explorer : https://field.eqhub.eqbr.com/43161 (EQBR MainNet)

For more details, please check the attached file (${uuid}.txt).

Best regards,  
Your Team
`,
      attachments: [
        {
          filename: `${uuid}.txt`,
          path: `${process.cwd()}/logs/${uuid}.txt`,
        },
      ],
    });

    // this.fileService.deleteFile(uuid);
  }
}
