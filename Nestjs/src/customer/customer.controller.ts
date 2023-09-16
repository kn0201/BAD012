import { Body, Controller, Get, Post } from '@nestjs/common';
import { array, number, object, string } from 'cast.ts';
import { CustomerService } from './customer.service';
// import { CustomerService } from './customer.service'

let idParser = object({ id: number() });
let receiptParser = object({
  items: array(
    object({
      name: string(),
      quantity: number(),
      price: number(),
    }),
  ),
  user_id: number(),
  pos_id: number(),
  discount: number(),
  balance: number(),
});
@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  postID(@Body() body: Body) {
    let id = idParser.parse(body);
    return this.customerService.postID(id);
  }

  @Post('receipt')
  postReceipt(@Body() body: Body) {
    let receipt = receiptParser.parse(body);
    return this.customerService.postReceipt(receipt);
  }
}
