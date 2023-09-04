import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.page.html',
  styleUrls: ['./admin-product-list.page.scss'],
})
export class AdminProductListPage implements OnInit {
  productList = [
    { id: '1', name: 'apple', price: '$30' },
    { id: '2', name: 'banana', price: '$12' },
    { id: '3', name: 'orange', price: '$6' },
    { id: '4', name: 'cherry', price: '$8' },
    { id: '5', name: 'mango', price: '$13' },
  ];
  constructor() {}

  ngOnInit() {}
}
