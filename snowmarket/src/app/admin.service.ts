import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { array, object, string } from 'cast.ts'
import { brand, category } from 'src/assets/type'

let bcList = object({
  brandList: array(brand),
  categoriesList: array(category),
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

  addBrandCategory(body: { msgName: string; selectValue: string }) {
    return this.api.post('/admin/b&c-list/add', body, addBrandCategoryResult)
  }
}
