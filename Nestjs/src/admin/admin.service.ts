import { Injectable } from '@nestjs/common';
import { brandList } from 'source/brand';
import { categoriesList } from 'source/categories';
import { priceDiscountList, productDiscountList } from 'source/discount';
import { memberList } from 'source/member';
import { productList } from 'source/product';
import { receiptList } from 'source/receipt';

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

  getBCList() {
    console.log('AdminService : Get BC List');
    return { brandList, categoriesList };
  }

  getMemberList() {
    console.log('AdminService : Get Member List');
    return { memberList };
  }

  getReceiptList() {
    console.log('AdminService : Get Receipt List');
    return { receiptList };
  }

  getProductList() {
    console.log('AdminService : Get Product List');
    return { productList };
  }

  getDiscountList() {
    console.log('AdminService : Get Discount List');
    return {
      productDiscountList,
      priceDiscountList,
      productList,
      brandList,
      categoriesList,
    };
  }
}
