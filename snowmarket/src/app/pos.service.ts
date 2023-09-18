import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { nullable, number, object, string } from 'cast.ts'

let posChecker = object({
  id: nullable(number()),
  code: nullable(string()),
  error: nullable(string()),
})
@Injectable({
  providedIn: 'root',
})
export class PosService {
  constructor(private api: ApiService) {}

  checkPOS(body: { pos: string }) {
    return this.api.post('/pos', body, posChecker)
  }
}
