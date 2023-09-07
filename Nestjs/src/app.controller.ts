import {
  Controller,
  Dependencies,
  Get,
  Post,
  Redirect,
  Render,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { request } from 'http';

@Controller()
@Dependencies(AppService)
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('/receipt')
  // getHello(@Req() request: Request) {
  //   console.log(request.body);
  //   let msg = request.body;
  //   return this.appService.getHello(msg);
  // }
  @Post('/receipt')
  getMsg(@Req() request: Request) {
    let msg = request.body;

    console.log('AppController : ', msg);
    return this.appService.getHello(msg);
  }
}
