import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { id, number, object, string } from 'cast.ts'

let productDetailParser = object({
  id: id(),
  name: string(),
  price: number(),
})

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private api: ApiService) {}

  getProductDetailByName(name: string) {
    return this.api.get(
      '/products/by-name/' + encodeURI(name),
      productDetailParser
    )
  }
}
