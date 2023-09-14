import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { array, nullable, number, object, string } from 'cast.ts'

let item = object({
  id: number(),
  name: string(),
  product_brand_id: number(),
  product_categories_id: number(),
  unit_price: number(),
  product_stock: number(),
  discount_id: nullable(number()),
  discount_title: nullable(string()),
  discount_product_id: nullable(number()),
  discount_brand_id: nullable(number()),
  discount_categories_id: nullable(number()),
  discount_quantity: nullable(number()),
  discount_amount: nullable(number()),
})
let product = object({ item })
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private api: ApiService) {}
  postID(body: { id: number }) {
    console.log({ body })

    return this.api.post('/customer', body, product)
  }
}
