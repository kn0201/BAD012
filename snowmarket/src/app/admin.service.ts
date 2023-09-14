import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { array, object, string } from 'cast.ts'
import {
  brand,
  category,
  item,
  priceDiscount,
  product,
  productDiscount,
  receipt,
  user,
} from 'src/assets/type'

let bcPageList = object({
  brandList: array(brand),
  categoriesList: array(category),
})

let memberList = object({
  memberList: array(user),
})

let receiptPageList = object({
  receiptList: array(receipt),
  receiptItemList: array(item),
})

let productPageList = object({
  productList: array(product),
  brandList: array(brand),
  categoriesList: array(category),
})

let discountPageList = object({
  brandList: array(brand),
  categoriesList: array(category),
  productList: array(product),
  productDiscountList: array(productDiscount),
  priceDiscountList: array(priceDiscount),
})

let addBrandCategoryResult = object({
  name: string(),
  param: string(),
})

let addProductResult = object({
  name: string(),
})

let deleteProductResult = object({})
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private api: ApiService) {}

  getBCList() {
    return this.api.get('/admin/b&c-list', bcPageList)
  }

  getMemberList() {
    return this.api.get('/admin/member-list', memberList)
  }

  getReceiptList() {
    return this.api.get('/admin/receipt-list', receiptPageList)
  }

  getProductList() {
    return this.api.get('/admin/product-list', productPageList)
  }

  getDiscountList() {
    return this.api.get('/admin/discount-list', discountPageList)
  }

  addBrandCategory(body: { name: string; selectValue: string }) {
    return this.api.post('/admin/b&c-list/add', body, addBrandCategoryResult)
  }

  addProduct(body: {
    categoryID: string
    brandID: string
    name: string
    price: number
  }) {
    return this.api.post('/admin/product-list/add', body, addProductResult)
  }

  deleteProduct(selectedChecked: Set<unknown>) {
    return this.api.patch(
      '/admin/product-list/delete',
      selectedChecked,
      deleteProductResult
    )
  }
}
