import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { number } from 'cast.ts'
import { NotFoundError } from 'rxjs'
import { DOMAIN } from 'utils/domain'
import { sweetalert2Success, sweetalert2error } from 'utils/sweetalert2'
import { LoginService } from '../login.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(private loginService: LoginService, private router: Router) {}
  username: string = ''
  password: string = ''
  signUpPageVisible: boolean = false

  @ViewChild('popover') popover: any

  isOpen = false

  presentPopover(e: Event) {
    this.popover.event = e
    this.isOpen = true
  }
  // user = {
  //   username: '',
  //   password: '',
  // }
  // errors = {
  //   username: '',
  // }
  email: string = ''

  ngOnInit() {}

  switchPage(switchToSignUp: boolean) {
    this.signUpPageVisible = switchToSignUp
  }

  // getPasswordError() {
  //   // console.log('get password error...')
  //   if (this.user.password.length < 8) {
  //     return 'Password should has at least 8 characters'
  //   }
  //   return ''
  // }

  // async checkUsername() {
  //   // console.log('check username...')
  //   if (this.user.username === 'alice') {
  //     this.errors.username = 'This username is already in use'
  //     return
  //   }
  //   this.errors.username = ''
  // }

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
  //   console.log(json.user)
  // }
  async login() {
    let json = await this.loginService.login({
      username: this.username,
      password: this.password,
    })
    console.log(json)

    if (json.role == 'member') {
      sweetalert2Success('Logined')
      this.popover.dismiss()
      this.router.navigate(['/customer'])
    } else if (json.role == 'admin') {
      sweetalert2Success('Logined')
      this.popover.dismiss()
      this.router.navigate(['/admin'])
    }
    if (json.error != null) {
      sweetalert2error(json.error)
    }
  }

  async reigist() {
    if (this.username == '') {
      sweetalert2error('Missing User Name')
      return
    } else if (this.email == '') {
      sweetalert2error('Missing Email Address')
      return
    } else if (this.password == '') {
      sweetalert2error('Missing Password')
      return
    }
    let json = await this.loginService.reigist({
      username: this.username,
      email: this.email,
      password: this.password,
    })
    await sweetalert2Success(`reigist ${json.name}`)
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
