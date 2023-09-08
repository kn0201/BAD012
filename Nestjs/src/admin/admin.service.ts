import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  addBrandCategory(req) {
    let param = req.selectValue;
    if (param === 'brand') {
      console.log(param + ':' + req.msgName);
      let result = 'brand';
      return { result };
    } else if (param === 'category') {
      console.log(param + ':' + req.msgName);
      let result = 'Category';
      return { result };
    } else {
      return;
    }
  }
}
