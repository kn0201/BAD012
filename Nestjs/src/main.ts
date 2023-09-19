import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { print } from 'listening-on';
import { env } from 'utils/env';

import dayjs from 'dayjs';
import dotenv from 'dotenv';

import { sessionMiddleware } from 'utils/session';

async function bootstrap() {
  let port = env.PORT;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(sessionMiddleware);
  app.use((req, res, next) => {
    let counter = req.session.counter || 0;
    counter++;
    req.session.counter = counter;
    let timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    console.log(`[${timestamp}] ${req.method} ${req.url} (${counter})`);
    next();
  });
  await app.listen(port);

  print(port);
}
bootstrap();

dotenv.config();
