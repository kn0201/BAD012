import { Body, Controller, Post } from '@nestjs/common';

import { object, string } from 'cast.ts';

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

  @Post('/register')
  async register(@Body() body: Body) {
    let input = userParser.parse(body);
    return this.loginService.register(input);
  }
}
