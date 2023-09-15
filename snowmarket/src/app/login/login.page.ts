import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { number } from 'cast.ts'
import { NotFoundError } from 'rxjs'
import { DOMAIN } from 'utils/domain'
import { sweetalert2error } from 'utils/sweetalert2'
import { LoginService } from '../login.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {
    username: '',
    password: '',
  }
  errors = {
    username: '',
  }

  signUpPageVisible: boolean = false

  email: string | null = null

  constructor(private Login: LoginService) {}

  ngOnInit() {}

  switchPage(switchToSignUp: boolean) {
    this.signUpPageVisible = switchToSignUp
  }

  getPasswordError() {
    // console.log('get password error...')
    if (this.user.password.length < 8) {
      return 'Password should has at least 8 characters'
    }
    return ''
  }

  async checkUsername() {
    // console.log('check username...')
    if (this.user.username === 'alice') {
      this.errors.username = 'This username is already in use'
      return
    }
    this.errors.username = ''
  }

  async login(): Promise<any> {
    await this.login
  }

  // async login(): Promise<any> {
  //   let res = await fetch(`${DOMAIN}/login`, {
  //     headers: {
  //       Accept: 'application/json',
  //     },
  //   })
  //   let json = await res.json()
  //   if (json.error) {
  //     sweetalert2error(json.error)
  //     return
  //   }
  //   // console.log(json.user)
  // }
}
