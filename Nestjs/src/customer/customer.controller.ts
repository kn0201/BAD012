import {
  Body,
  Controller,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  Post,
} from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { id } from 'cast.ts';
// import { CustomerService } from './customer.service'

// let getItemParser = id()
@Controller('customer')
export class CustomerController {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  // @Post()
  // create(@Body() addReceipt: AddReceipt) {
  // 	return this.customerService.create(addReceipt)
  // }

  // @Get('/products')
  // async getItem(@Body() body: number) {
  // 	let input = getItemParser.parse(body, { id: +'id' })
  // 	console.log(input)

  // 	let product = await this.knex
  // 		.select('id', 'name', 'brand_id', 'categories_id', 'price', 'stock')
  // 		.from('product')
  // 		.where('id', input)
  // 		.andWhere('is_delete', false)
  // 		.first() // Use first() to retrieve a single row

  // 	if (!product) {
  // 		throw new NotFoundException('Product not found')
  // 	}
  // 	return { product }
  // }
}
