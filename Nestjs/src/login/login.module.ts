import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
