import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  async writeToFile(content: string, uuid: any) {
    fs.appendFile(this.getFilePath(uuid), content + '\n', (err) => {});
  }

  async deleteFile(uuid: any) {
    await fs.promises.unlink(this.getFilePath(uuid));
  }

  private getFilePath(uuid: any) {
    return path.join(process.cwd(), 'logs', `${uuid}.txt`);
  }
}
