import { Injectable } from '@angular/core'
import { AlertService } from './alert.service'
import { Parser } from 'cast.ts'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiOrigin = 'http://localhost:8200'

  constructor(private alertService: AlertService) {}

  async get<T>(path: string, parser: Parser<T>) {
    let res = await fetch(this.apiOrigin + path, {
      headers: {
        Accept: 'application/json',
      },
    })
    let json = await res.json()
    if (json.error) {
      this.alertService.showError(json.error)
      throw new Error(json.error)
    }
    return parser.parse(json)
  }

  async post<T>(path: string, body: object, parser: Parser<T>) {
    let res = await fetch(this.apiOrigin + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    let json = await res.json()
    if (json.error) {
      this.alertService.showError(json.error)
      throw new Error(json.error)
    }
    return parser.parse(json)
  }
}