import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { array, object, string } from 'cast.ts'
import {
  brand,
  category,
  priceDiscount,
  product,
  productDiscount,
  receipt,
  user,
} from 'src/assets/type'

let bcList = object({
  brandList: array(brand),
  categoriesList: array(category),
})

let memberList = object({
  memberList: array(user),
})

let receiptList = object({
  receiptList: array(receipt),
})

let productList = object({
  productList: array(product),
})

let discountList = object({
  brandList: array(brand),
  categoriesList: array(category),
  productList: array(product),
  productDiscountList: array(productDiscount),
  priceDiscountList: array(priceDiscount),
})
let addBrandCategoryResult = object({ result: string() })

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private api: ApiService) {}

  getBCList() {
    return this.api.get('/admin/b&c-list', bcList)
  }

  getMemberList() {
    return this.api.get('/admin/member-list', memberList)
  }

  getReceiptList() {
    return this.api.get('/admin/receipt-list', receiptList)
  }

  getProductList() {
    return this.api.get('/admin/product-list', productList)
  }

  getDiscountList() {
    return this.api.get('/admin/discount-list', discountList)
  }
  addBrandCategory(body: { msgName: string; selectValue: string }) {
    return this.api.post('/admin/b&c-list/add', body, addBrandCategoryResult)
  }
}
