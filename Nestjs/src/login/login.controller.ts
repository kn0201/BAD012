import {
  Body,
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Param,
  Post,
  Session,
  Sse,
  UnauthorizedException,
} from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { array, id, int, object, string } from 'cast.ts';
import { RequestSession } from 'utils/session';
import { LoginService } from './login.service';
import session from 'express-session';
import { json } from 'stream/consumers';

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
  async login(@Body() body: Body, @Session() session: RequestSession) {
    let input = loginParser.parse(body);
    session.save();
    return this.loginService.login(input);
  }

  @Post('/reigist')
  async addUser(@Body() body: Body, @Session() session: RequestSession) {
    let input = userParser.parse(body);
    session.save();
    return this.loginService.addUser(input);
  }

  @Get('session')
  getCurrentUser(@Session() session: RequestSession) {
    return {
      user_id: session.user_id,
    };
  }
}
