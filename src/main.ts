import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { print } from 'listening-on';
import { env } from 'utils/env';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  let port = env.PORT;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('public');

  await app.listen(port);
  print(port);
}
bootstrap();
