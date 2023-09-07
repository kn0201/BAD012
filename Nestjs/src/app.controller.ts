import {
  Controller,
  Dependencies,
  Get,
  Redirect,
  Render,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
@Dependencies(AppService)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/receipt')
  getHello() {
    return this.appService.getHello();
  }
}
