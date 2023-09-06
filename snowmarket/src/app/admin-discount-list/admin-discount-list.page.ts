import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-discount-list',
  templateUrl: './admin-discount-list.page.html',
  styleUrls: ['./admin-discount-list.page.scss'],
})
export class AdminDiscountListPage implements OnInit {
  public currentAmountDiscounts = [
    {
      id: '1',
      title: 'apple 買2送1',
      product_id: '1',
      amount: '3',
      discount: '-30',
      date: '0911',
    },
    {
      id: '2',
      title: 'banana 20蚊 3個',
      product_id: '2',
      amount: '3',
      discount: '-16',
      date: '0911',
    },
    {
      id: '3',
      title: 'orange 買3送2',
      product_id: '3',
      amount: '5',
      discount: '-12',
      date: '0911',
    },
    {
      id: '4',
      title: 'mango 30蚊 4個',
      product_id: '5',
      amount: '4',
      discount: '-22',
      date: '0911',
    },
  ];

  public currentPriceDiscounts = [
    { title: '滿100 減20', total: '100', discount: '-20', date: '0911' },
    { title: '滿500 8折', total: '500', discount: '*0.8', date: '0911' },
    { title: '滿1000 7折', total: '1000', discount: '*0.7', date: '0911' },
  ];
  constructor() {}

  ngOnInit() {}
}
