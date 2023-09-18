import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { object, string } from 'cast.ts';

import { LoginService } from './login.service';
import session from 'express-session';
import { json } from 'stream/consumers';
import { AppService } from 'src/app.service';
import { AuthGuard } from '@nestjs/passport';

let loginParser = object({
  username: string({ trim: true, nonEmpty: true }),
  password: string({ trim: true }),
});

let userParser = object({
  username: string(),
  email: string(),
  password: string(),
});
@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post()
  async login(@Body() body: Body) {
    let input = loginParser.parse(body);
    return this.loginService.login(input);
  }

  @Post('/register')
  async register(@Body() body: Body) {
    let input = userParser.parse(body);
    return this.loginService.register(input);
  }
}
