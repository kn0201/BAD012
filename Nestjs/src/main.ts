import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { print } from 'listening-on';
import { env } from 'utils/env';

import dayjs from 'dayjs';
import dotenv from 'dotenv';
import session from 'express-session';
import { sessionMiddleware } from 'utils/session';

async function bootstrap() {
  let port = env.PORT;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use((req, res, next) => {
    // let counter = req.session.dummy || 0;
    // counter++;
    req.session.dummy = 8;
    let timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    console.log(`[${timestamp}] ${req.method} ${req.url} (${8})`);
    next();
  });
  await app.listen(port);

  print(port);
}
bootstrap();

dotenv.config();
