import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { array, nullable, number, object, string } from 'cast.ts'
import {
  brand,
  category,
  deletedPriceDiscount,
  deletedProduct,
  deletedProductDiscount,
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
  previousTotal: array(object({ sum: number() })),
  currentDateTotal: array(object({ sum: nullable(number()) })),
  receiptItemBrandList: array(object({ name: string() })),
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

let deleteDiscountResult = object({})

let deletedProductList = object({
  deletedProductList: array(deletedProduct),
  deletedProductDiscountList: array(deletedProductDiscount),
  deletedPriceDiscountList: array(deletedPriceDiscount),
})

let addProductDiscount = object({
  result: string(),
})

let addPriceDiscount = object({
  result: string(),
})
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

  getTrashList() {
    return this.api.get('/admin/trash-list', deletedProductList)
  }

  getChartList() {
    return this.api.get('/admin/chart-list', receiptPageList)
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

  addProductDiscount(body: {
    selectedDiscount: string
    title: string
    product_id: number | null
    brand_id: number | null
    categories_id: number | null
    quantity: string
    discount_amount: string
    start_date: string
    end_date: string
  }) {
    return this.api.post(
      '/admin/discount-list/addProductDiscount',
      body,
      addProductDiscount
    )
  }

  addPriceDiscount(body: {
    selectedDiscount: string
    title: string
    total_price: string
    discount_rate: string
    start_date: string
    end_date: string
  }) {
    return this.api.post(
      '/admin/discount-list/addPriceDiscount',
      body,
      addPriceDiscount
    )
  }

  deleteProduct(body: { deleteId: number }) {
    return this.api.patch(
      '/admin/product-list/delete',
      body,
      deleteProductResult
    )
  }

  reDeleteProduct(body: { deleteId: number }) {
    return this.api.patch(
      '/admin/product-list/reDelete',
      body,
      deleteProductResult
    )
  }

  deleteDiscount(body: { deleteId: number; value: string }) {
    return this.api.patch(
      '/admin/discount-list/delete',
      body,
      deleteDiscountResult
    )
  }
}
