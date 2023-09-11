import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [AdminModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
