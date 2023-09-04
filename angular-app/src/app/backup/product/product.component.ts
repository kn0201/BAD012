import { Component } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  productList = [
    { name: 'apple', price: '$30' },
    { name: 'banana', price: '$12' },
    { name: 'orange', price: '$6' },
    { name: 'cherry', price: '$8' },
    { name: 'mango', price: '$13' },
  ];
}
