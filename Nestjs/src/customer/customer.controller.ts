import { Body, Controller, Get, Post } from '@nestjs/common';
import { array, number, object, string } from 'cast.ts';
import { CustomerService } from './customer.service';
import { ProductService } from 'src/product/product.service';
// import { CustomerService } from './customer.service'

let idParser = object({ id: number() });
let labelParser = object({ label: string() });

let receiptParser = object({
  items: array(
    object({
      name: string(),
      price: number(),
    }),
  ),
  discount: number(),
  balance: number(),
});
@Controller('customer')
export class CustomerController {
  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
  ) {}

  @Post('cart/by-id')
  addToCartByProductId(@Body() body: unknown) {
    let input = idParser.parse(body);
    return this.customerService.addProductToCart(input.id);
  }

  @Post('cart/by-label')
  async addToCartByProductLabel(@Body() body: unknown) {
    let input = labelParser.parse(body);
    let product_id = await this.productService.getProductIdByLabel(input.label);
    return this.customerService.addProductToCart(product_id);
  }

  @Post('receipt')
  postReceipt(@Body() body: unknown) {
    let receipt = receiptParser.parse(body);
    return this.customerService.postReceipt(receipt);
  }
}
