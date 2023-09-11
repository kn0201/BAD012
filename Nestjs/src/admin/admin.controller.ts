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
    console.log('AdminController');
    return this.AdminService.getBCList();
  }

  @Get('/member-list')
  getMemberList() {
    console.log('MemberList');
    return this.AdminService.getMemberList();
  }

  @Get('/receipt-list')
  getReceiptList() {
    console.log('ReceiptList');
    return this.AdminService.getReceiptList();
  }

  @Post('/b&c-list/add')
  addMsg(@Req() request: Request) {
    let req = request.body;
    return this.AdminService.addBrandCategory(req);
  }
}
