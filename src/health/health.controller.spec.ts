// src/health/health.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

import { LoggerService } from '../logger/logger.service';

import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthCheckService: HealthCheckService;
  let httpHealthIndicator: HttpHealthIndicator;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn().mockImplementation((indicators) => {
              return Promise.all(indicators.map((indicator) => indicator()));
            }),
          },
        },
        {
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    httpHealthIndicator = module.get<HttpHealthIndicator>(HttpHealthIndicator);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  it('should log success message and return status ok when health check passes', async () => {
    const result = await healthController.check();

    expect(loggerService.log).toHaveBeenCalledWith(
      'Health check endpoint accessed.',
    );
    expect(healthCheckService.check).toHaveBeenCalled();
    expect(httpHealthIndicator.pingCheck).toHaveBeenCalledWith(
      'nestjs-docs',
      'https://docs.nestjs.com',
    );
    expect(result).toEqual({ status: 'ok' });
  });

  it('should log error message when health check fails', async () => {
    jest
      .spyOn(httpHealthIndicator, 'pingCheck')
      .mockRejectedValue(new Error('Ping check failed'));

    await expect(healthController.check()).rejects.toThrow('Ping check failed');
    expect(loggerService.error).toHaveBeenCalledWith(
      'Health check failed: Ping check failed',
    );
    expect(httpHealthIndicator.pingCheck).toHaveBeenCalledWith(
      'nestjs-docs',
      'https://docs.nestjs.com',
    );
  });
});
