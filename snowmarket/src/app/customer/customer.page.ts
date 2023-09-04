import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {
  items: { name: string; price: number }[] = [
    { name: 'KitKat Chocolate Bar', price: 6.0 },
    { name: 'Potato Chip', price: 12.0 },
  ];

  AIInput = { name: '', price: +'' };

  constructor() {}

  ngOnInit() {}

  addItem() {
    this.items.push(this.AIInput);
    this.AIInput.name = '';
    this.AIInput.price = +'';
  }

  removeItem(item: { name: string; price: number }) {
    let index = this.items.indexOf(item);
    this.items.splice(index, 1);
  }
}
