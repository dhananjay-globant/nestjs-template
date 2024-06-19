import { Logger, createLogger, format, transports } from 'winston';
import * as WinstonCloudWatch from 'winston-cloudwatch';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { Client } from '@elastic/elasticsearch';
import * as DailyRotateFile from 'winston-daily-rotate-file';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService {
  private logger: Logger;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    const logTransports = [];

    const appEnv = configService.get<string>('NODE_ENV');

    if (appEnv === 'development') {
      logTransports.push(
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      );
    } else {
      const logService = configService.get<string>('LOG_SERVICE');
      const awsRegion = configService.get<string>('AWS_REGION');
      const awsAccessKeyId = configService.get<string>('AWS_ACCESS_KEY_ID');
      const awsSecretKey = configService.get<string>('AWS_SECRET_ACCESS_KEY');
      if (logService === 'cloudwatch') {
        logTransports.push(
          new WinstonCloudWatch({
            logGroupName: 'your-log-group',
            logStreamName: 'your-log-stream',
            awsRegion,
            awsAccessKeyId,
            awsSecretKey,
          }),
        );
      } else if (logService === 'es') {
        const esNodeUrl = configService.get<string>('ES_NODE_URL');
        logTransports.push(
          new ElasticsearchTransport({
            level: 'info',
            client: new Client({
              node: esNodeUrl || 'http://localhost:9200',
            }), // Replace with your Elasticsearch server
          }),
        );
      }
    }

    logTransports.push(new transports.Console());

    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.printf(
          ({ timestamp, level, message }) =>
            `${timestamp} [${level}]: ${message}`,
        ),
      ),
      transports: logTransports,
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
