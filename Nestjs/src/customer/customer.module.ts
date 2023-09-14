import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}

// export class AddReceipt {
// 	receipt_user_id: string
// 	receipt_pos_id: string
// 	receipt_total: number
// 	receipt_discount_total: number
// 	receipt_item: { item_name: string; item_price: number }[]
// }
