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
    console.log('AdminController : b&c List');
    return this.AdminService.getBCList();
  }

  @Get('/member-list')
  getMemberList() {
    console.log('AdminController : Member List');
    return this.AdminService.getMemberList();
  }

  @Get('/receipt-list')
  getReceiptList() {
    console.log('AdminController : Receipt List');
    return this.AdminService.getReceiptList();
  }

  @Get('/product-list')
  getProductList() {
    console.log('AdminController : Product List');
    return this.AdminService.getProductList();
  }

  @Get('/discount-list')
  getDiscountList() {
    console.log('AdminController : Discount List');
    return this.AdminService.getDiscountList();
  }

  @Post('/b&c-list/add')
  addMsg(@Req() request: Request) {
    let req = request.body;
    return this.AdminService.addBrandCategory(req);
  }
}
