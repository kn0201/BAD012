import { Component } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  users = [
    { id: '1', name: 'alex', age: '18' },
    { id: '2', name: 'beeno', age: '14' },
    { id: '3', name: 'charlie', age: '25' },
    { id: '4', name: 'demon', age: '17' },
    { id: '5', name: 'frankly', age: '24' },
  ];
}
