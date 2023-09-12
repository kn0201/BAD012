import {
  Controller,
  Dependencies,
  Get,
  Module,
  Post,
  Redirect,
  Render,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { request } from 'http';
import { ServeStaticModule } from '@nestjs/serve-static';

@Controller()
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: 'login',
    }),
  ],
})
@Dependencies(AppService)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/login')
  getHello() {}
  // return this.appService.()
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
