import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const logLevel = process.env.LOG_LEVEL;
    return `Log level is set to ${logLevel}`;
  }
}
