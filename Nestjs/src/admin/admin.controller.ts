import { Controller, Dependencies, Param, Post, Req } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
@Dependencies(AdminService)
export class AdminController {
  constructor(private readonly AdminService: AdminService) {}

  @Post('/b&c-list/add')
  getMsg(@Req() request: Request) {
    let req = request.body;
    return this.AdminService.addBrandCategory(req);
  }
}
