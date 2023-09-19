import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { ParseResult, array, nullable, number, object, string } from 'cast.ts'

let item = object({
  id: number(),
  name: string(),
  product_brand_id: number(),
  product_categories_id: number(),
  unit_price: number(),
  product_stock: number(),
})

let quantity_discount = nullable(
  object({
    discount_id: number(),
    discount_title: string(),
    discount_product_id: nullable(number()),
    discount_brand_id: nullable(number()),
    discount_categories_id: nullable(number()),
    discount_quantity: number(),
    discount_amount: number(),
  })
)

let price_discount = nullable(
  object({
    price_discount_id: number(),
    price_discount_title: string(),
    price_discount_total: number(),
    price_discount_rate: string(),
  })
)

let addToCartResult = object({
  item: item,
  quantity_discount: quantity_discount,
})

let getPriceDiscountResult = nullable(array(price_discount))

export type AddToCartResult = ParseResult<typeof addToCartResult>
export type getPriceDiscountResult = ParseResult<typeof getPriceDiscountResult>
export type PriceDiscountResult = ParseResult<typeof price_discount>

let receipt_return = object({})
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private api: ApiService) {}

  getPriceDiscount() {
    return this.api.get('/customer/cart/price-discount', getPriceDiscountResult)
  }

  addToCartByProductId(id: number) {
    return this.api.post('/customer/cart/by-id', { id }, addToCartResult)
  }

  addToCartByProductLabel(label: string) {
    return this.api.post('/customer/cart/by-label', { label }, addToCartResult)
  }

  postReceipt(body: {
    items: Array<object>
    user_id: number | null
    pos_id: number
    discount: number
    balance: number
  }) {
    return this.api.post('/customer/receipt', body, receipt_return)
  }
}
