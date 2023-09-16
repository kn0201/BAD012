import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { nullable, number, object, string } from 'cast.ts'

let loginResult = object({
  role: nullable(string()),
  id: nullable(number()),
  error: nullable(string()),
})

let reigist = object({
  username: string(),
  id: number(),
})
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private api: ApiService) {}

  login(body: { username: string; password: string }) {
    return this.api.post('/login', body, loginResult)
  }
  reigist(body: { username: string; email: string; password: string }) {
    return this.api.post('/login/reigist', body, reigist)
  }
}
