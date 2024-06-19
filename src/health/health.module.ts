import { Module } from '@nestjs/common';
import { TerminusModule, HttpHealthIndicator } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

import { LoggerModule } from '../logger/logger.module';
import { CustomTerminusLogger } from '../logger/terminus-logger.service';

import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, LoggerModule, HttpModule],
  controllers: [HealthController],
  providers: [
    HttpHealthIndicator,
    {
      provide: 'TERMINUS_LOGGER',
      useClass: CustomTerminusLogger,
    },
  ],
})
export class HealthModule {}
