import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { test } from 'src/assets/type'

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private api: ApiService) {}
  getHello() {
    return this.api.get('/customer', test)
  }
}
