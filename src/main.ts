// src/main.ts
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { loadEnvConfig } from './config/configuration';

async function bootstrap() {
  // Load environment configuration
  loadEnvConfig();

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
