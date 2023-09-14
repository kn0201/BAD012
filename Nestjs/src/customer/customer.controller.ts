import { Body, Controller, Get, Post } from '@nestjs/common';
import { number, object, string } from 'cast.ts';
import { CustomerService } from './customer.service';
// import { CustomerService } from './customer.service'

let idParser = object({ id: number() });
@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  postID(@Body() body: Body) {
    let id = idParser.parse(body);
    return this.customerService.postID(id);
  }
}
