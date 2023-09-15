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
  password: string({ trim: true, minLength: 6 }),
});
@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post('login')
  async register(@Body() body: unknown, @Session() session: RequestSession) {
    let input = loginParser.parse(body, { name: 'body' });
    let json = await this.loginService.login(input);
    session.user_id = json.id;
    session.save();
    return json;
  }

  @Get('session')
  getCurrentUser(@Session() session: RequestSession) {
    return {
      user_id: session.user_id,
    };
  }

  @Get('profile')
  async getProfile(@Session() session: RequestSession) {
    let user_id = session.user_id;
    if (!user_id)
      throw new UnauthorizedException('This API is only for authorized users');
    let { username } = await this.loginService.getUserProfile(user_id);
    return {
      profile: {
        username,
      },
    };
  }
}
