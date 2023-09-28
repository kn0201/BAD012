import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { ProductModule } from 'src/product/product.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [ProductModule],
  controllers: [CustomerController],
  providers: [CustomerService, EmailService],
})
export class CustomerModule {}
