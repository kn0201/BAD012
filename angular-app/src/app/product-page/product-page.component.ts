import { Component } from '@angular/core';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent {
  productList = [
    { name: 'apple', price: '$30' },
    { name: 'banana', price: '$12' },
    { name: 'orange', price: '$6' },
    { name: 'cherry', price: '$8' },
    { name: 'mango', price: '$13' },
  ];
}
