import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { array, object, string } from 'cast.ts'

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private api: ApiService) {}
}
