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
@Controller('admin')
@Dependencies(AdminService)
export class AdminController {
  constructor(private readonly AdminService: AdminService) {}

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

  @Patch('/product-list/delete')
  async deleteProduct(@Body() body: Body) {
    let input = deleteProductParser.parse(body);
    return this.AdminService.deleteProduct(input);
  }
}
