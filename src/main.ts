import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { print } from 'listening-on';
import { env } from 'utils/env';

async function bootstrap() {
  let port = env.PORT;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  print(port);
}
bootstrap();
