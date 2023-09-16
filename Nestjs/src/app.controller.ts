import { Controller, Dependencies, Module } from '@nestjs/common';
import { AppService } from './app.service';

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
  constructor() {}
}
