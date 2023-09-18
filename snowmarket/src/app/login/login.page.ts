import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { sweetalert2Success, sweetalert2error } from 'utils/sweetalert2'
import { LoginService } from '../login.service'
import Swal from 'sweetalert2'
import { IonModal } from '@ionic/angular'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  canDismiss: boolean | undefined
  constructor(private loginService: LoginService, private router: Router) {}

  username: string = ''
  password: string = ''
  email: string = ''
  signUpPageVisible: boolean = false
  isOpen: boolean = false
  model: any

  @ViewChild(IonModal) modal!: IonModal
  @ViewChild('popover') popover: any

  presentPopover(e: Event) {
    this.popover.event = e
    this.isOpen = true
  }

  ngOnInit() {}

  switchPage(switchToSignUp: boolean) {
    this.signUpPageVisible = switchToSignUp
  }

  clear() {
    this.username = ''
    this.password = ''
    this.email = ''
  }
  presentReset(e: Event) {
    this.popover.event = e
    this.isOpen = true
  }
  async login() {
    if (this.username == '') {
      this.loginSweetalert2error('Missing User Name')
      return
    } else if (this.password == '') {
      this.loginSweetalert2error('Missing Password')
      return
    }
    let json = await this.loginService.login({
      username: this.username,
      password: this.password,
    })
    if (json.error != null) {
      this.cancel()
      this.clear()
      this.loginSweetalert2error(json.error)
    }
    if (json.id) {
      let user_id = json.id.toString()
      if (json.role == 'member') {
        sweetalert2Success('Login Success')
        sessionStorage.setItem('role', json.role)
        sessionStorage.setItem('username', this.username)
        sessionStorage.setItem('user_id', user_id)
        this.popover.dismiss()
        this.clear()
        this.router.navigate(['/customer'])
      } else if (json.role == 'admin') {
        sweetalert2Success('Login Success')
        sessionStorage.setItem('role', json.role)
        sessionStorage.setItem('username', this.username)
        sessionStorage.setItem('user_id', user_id)
        this.popover.dismiss()
        this.clear()
        this.router.navigate(['/admin'])
      }
    }
  }

  isLogin() {
    return sessionStorage.getItem('user') !== null
  }

  async register() {
    if (this.username == '') {
      this.loginSweetalert2error('Missing User Name')
      return
    } else if (this.email == '') {
      this.loginSweetalert2error('Missing Email Address')
      return
    } else if (this.password == '') {
      this.loginSweetalert2error('Missing Password')
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

  cancel() {
    this.modal.dismiss()
  }

  loginSweetalert2error(error: any) {
    Swal.fire({
      title: 'Error!',
      text: error,
      icon: 'error',
      confirmButtonColor: '#ffa065',
      confirmButtonText: 'OK',
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancel()
        this.clear()
      }
    })
  }
}
