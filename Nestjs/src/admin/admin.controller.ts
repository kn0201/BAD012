import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { array, nullable, number, object, string } from 'cast.ts';
import { GuardGuard } from 'src/guard/guard.guard';

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
  product_id: nullable(number(), null),
  brand_id: nullable(string(), null),
  categories_id: nullable(string(), null),
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

let receiptParser = object({
  items: array(object()),
  discount: number(),
  balance: number(),
});

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/b&c-list')
  getBCList() {
    return this.adminService.getBCList();
  }

  @Get('/member-list')
  getMemberList() {
    return this.adminService.getMemberList();
  }

  @Get('/receipt-list')
  getReceiptList() {
    return this.adminService.getReceiptList();
  }

  @Get('/product-list')
  getProductList(@Req() req: any) {
    console.log({ session: req.session });

    return this.adminService.getProductList();
  }

  @Get('/discount-list')
  getDiscountList() {
    return this.adminService.getDiscountList();
  }

  @Get('/trash-list')
  getTrashList() {
    return this.adminService.getTrashList();
  }

  @Get('/chart-list')
  getChartList() {
    return this.adminService.getReceiptList();
  }

  @Post('/b&c-list/add')
  async addBrandCategory(@Body() body: Body) {
    let input = bcParser.parse(body);
    return this.adminService.addBrandCategory(input);
  }

  @Post('/product-list/add')
  async addProduct(@Body() body: Body) {
    let input = productParser.parse(body);
    return this.adminService.addProduct(input);
  }

  @Post('/discount-list/addProductDiscount')
  async addProductDiscount(@Body() body: Body) {
    let input = addProductDiscountParser.parse(body);
    return this.adminService.addProductDiscount(input);
  }

  @Post('/discount-list/addPriceDiscount')
  async addPriceDiscount(@Body() body: Body) {
    let input = addPriceDiscountParser.parse(body);
    return this.adminService.addPriceDiscount(input);
  }

  @Patch('/product-list/delete')
  async deleteProduct(@Body() body: Body) {
    let input = deleteProductParser.parse(body);
    return this.adminService.deleteProduct(input);
  }
  @Patch('/product-list/reDelete')
  async reDeleteProduct(@Body() body: Body) {
    let input = deleteProductParser.parse(body);
    return this.adminService.reDeleteProduct(input);
  }

  @Patch('/discount-list/delete')
  async deleteDiscount(@Body() body: Body) {
    let input = deleteDiscountParser.parse(body);
    return this.adminService.deleteDiscount(input);
  }
}
