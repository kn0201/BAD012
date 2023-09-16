import {
  Body,
  Controller,
  Delete,
  Dependencies,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { array, number, object, string } from 'cast.ts';

let bcParser = object({
  name: string(),
  selectValue: string(),
});

let productParser = object({
  categoryID: string(),
  brandID: string(),
  name: string(),
  price: number(),
});

let deleteProductParser = object({
  deleteId: number(),
});

let deleteDiscountParser = object({
  value: string(),
  deleteId: number(),
});

let addProductDiscountParser = object({
  selectedDiscount: string(),
  title: string(),
  product_id: string(),
  brand_id: string(),
  categories_id: string(),
  quantity: string(),
  discount_amount: string(),
  start_date: string(),
  end_date: string(),
});

let addPriceDiscountParser = object({
  selectedDiscount: string(),
  title: string(),
  total_price: string(),
  discount_rate: string(),
  start_date: string(),
  end_date: string(),
});
@Controller('admin')
export class AdminController {
  constructor(private AdminService: AdminService) {}

  @Get('/b&c-list')
  getBCList() {
    return this.AdminService.getBCList();
  }

  @Get('/member-list')
  getMemberList() {
    return this.AdminService.getMemberList();
  }

  @Get('/receipt-list')
  getReceiptList() {
    return this.AdminService.getReceiptList();
  }

  @Get('/product-list')
  getProductList() {
    return this.AdminService.getProductList();
  }

  @Get('/discount-list')
  getDiscountList() {
    return this.AdminService.getDiscountList();
  }

  @Get('/trash-list')
  getTrashList() {
    return this.AdminService.getTrashList();
  }

  @Post('/b&c-list/add')
  async addBrandCategory(@Body() body: Body) {
    let input = bcParser.parse(body);
    return this.AdminService.addBrandCategory(input);
  }

  @Post('/product-list/add')
  async addProduct(@Body() body: Body) {
    let input = productParser.parse(body);
    return this.AdminService.addProduct(input);
  }

  @Post('/discount-list/addProductDiscount')
  async addProductDiscount(@Body() body: Body) {
    let input = addProductDiscountParser.parse(body);
    return this.AdminService.addProductDiscount(input);
  }

  @Post('/discount-list/addPriceDiscount')
  async addPriceDiscount(@Body() body: Body) {
    let input = addPriceDiscountParser.parse(body);
    return this.AdminService.addPriceDiscount(input);
  }

  @Patch('/product-list/delete')
  async deleteProduct(@Body() body: Body) {
    let input = deleteProductParser.parse(body);
    return this.AdminService.deleteProduct(input);
  }
  @Patch('/product-list/reDelete')
  async reDeleteProduct(@Body() body: Body) {
    let input = deleteProductParser.parse(body);
    return this.AdminService.reDeleteProduct(input);
  }

  @Patch('/discount-list/delete')
  async deleteDiscount(@Body() body: Body) {
    let input = deleteDiscountParser.parse(body);
    return this.AdminService.deleteDiscount(input);
  }
}
