import {
  Body,
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Param,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { array, id, int, object, string } from 'cast.ts';
import { RequestSession } from 'utils/session';
import { LoginService } from './login.service';

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

  @Post('/reigist')
  async addUser(@Body() body: Body) {
    let input = userParser.parse(body);
    return this.loginService.addUser(input);
  }
}
