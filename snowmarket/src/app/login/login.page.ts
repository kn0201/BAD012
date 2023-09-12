import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {
    username: '',
    password: '',
  };
  errors = {
    username: '',
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  getPasswordError() {
    // console.log('get password error...')
    if (this.user.password.length < 8) {
      return 'Password should has at least 8 characters';
    }
    return '';
  }

  async checkUsername() {
    // console.log('check username...')
    if (this.user.username === 'alice') {
      this.errors.username = 'This username is already in use';
      return;
    }
    this.errors.username = '';
  }

  async login() {
    this.router.navigate(['admin.page']);
  }
}
