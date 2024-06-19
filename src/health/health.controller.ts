import { Controller, Get, Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

import { LoggerService } from '../logger/logger.service';

@Controller('health')
@Injectable()
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private http: HttpHealthIndicator,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    // this.logger.log('Health check endpoint accessed.');
    // this.logger.debug('Debug message for health check.');
    // this.logger.warn('Warning message for health check.');
    // this.logger.error('Error message for health check.');
    try {
      await this.healthCheckService.check([
        async () =>
          this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      ]);
      this.logger.log('Health check endpoint accessed.');
      return { status: 'ok' };
    } catch (error) {
      this.logger.error(`Health check failed: ${error.message}`);
      throw error;
    }
  }
}
