import {
  Controller,
  Dependencies,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';

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

  @Post('/b&c-list/add')
  addBrandCategory(@Req() request: Request) {
    let req = request.body;
    return this.AdminService.addBrandCategory(req);
  }
}
