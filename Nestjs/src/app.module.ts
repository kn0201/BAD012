import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminModule } from './admin/admin.module';
import { LoginModule } from './login/login.module';
import { CustomerModule } from './customer/customer.module';
import { KnexModule } from 'nestjs-knex';
import { env } from '../src/env';
import { ProductModule } from './product/product.module';
import { PosModule } from './pos/pos.module';
import { GuardGuard } from './guard/guard.guard';
import { GoogleStrategy } from './google.strategy';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    AdminModule,
    LoginModule,
    CustomerModule,
    KnexModule.forRoot({
      config: {
        client: 'postgresql',
        connection: {
          database: env.DB_NAME,
          user: env.DB_USERNAME,
          password: env.DB_PASSWORD,
        },
        pool: {
          min: 2,
          max: 10,
        },
        migrations: {
          tableName: 'knex_migrations',
        },
      },
    }),
    ProductModule,
    PosModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, EmailService],
})
export class AppModule {}
