import { Component, OnInit } from '@angular/core';
import { DOMAIN } from 'utils/domain';
@Component({
  selector: 'app-admin-receipt-list',
  templateUrl: './admin-receipt-list.page.html',
  styleUrls: ['./admin-receipt-list.page.scss'],
})
export class AdminReceiptListPage implements OnInit {
  constructor() {}

  ngOnInit() {
    this.getHello();
  }

  async getHello() {
    let res = await fetch(`${DOMAIN}/receipt`);
    // console.log(res);

    let json = await res.json();
    if (json.error) {
      console.log('Failed to load Recipes', json.error, 'error');
      return;
    }
    let result = json.result;

    console.log(' From Nestjs : ' + result);
  }
}
