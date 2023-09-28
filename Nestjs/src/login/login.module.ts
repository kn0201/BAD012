import { Module } from '@nestjs/common';

import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [LoginController, AppController],
  providers: [LoginService, AppService, EmailService],
})
export class LoginModule {}
