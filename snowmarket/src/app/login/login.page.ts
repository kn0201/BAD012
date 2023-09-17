import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
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
  email: string = ''

  ngOnInit() {}

  switchPage(switchToSignUp: boolean) {
    this.signUpPageVisible = switchToSignUp
  }

  clear() {
    this.username = ''
    this.password = ''
    this.email = ''
  }

  async login() {
    let json = await this.loginService.login({
      username: this.username,
      password: this.password,
    })

    if (json.id) {
      let user_id = json.id.toString()

      if (json.role == 'member') {
        sweetalert2Success('Login Success')
        sessionStorage.setItem('role', json.role)
        sessionStorage.setItem('username', this.username)
        sessionStorage.setItem('user_id', user_id)
        this.popover.dismiss()
        this.router.navigate(['/customer'])
      } else if (json.role == 'admin') {
        sweetalert2Success('Login Success')
        sessionStorage.setItem('role', json.role)
        sessionStorage.setItem('username', this.username)
        sessionStorage.setItem('user_id', user_id)
        this.popover.dismiss()
        this.router.navigate(['/admin'])
      }
    }
    if (json.error != null) {
      sweetalert2error(json.error)
    }
  }

  isLogin() {
    return sessionStorage.getItem('user') !== null
  }

  async register() {
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
    let json = await this.loginService.register({
      username: this.username,
      email: this.email,
      password: this.password,
    })
    let id = json.id.toString()
    sweetalert2Success(`Welcome ${json.username}`)
    this.clear()
    sessionStorage.setItem('role', json.role)
    sessionStorage.setItem('username', json.username)
    sessionStorage.setItem('user_id', id)
    this.popover.dismiss()
    this.router.navigate(['/customer'])
  }
}
