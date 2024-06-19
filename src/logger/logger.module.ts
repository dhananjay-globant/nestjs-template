import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerService } from './logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [ConfigModule],
})
export class LoggerModule {}
