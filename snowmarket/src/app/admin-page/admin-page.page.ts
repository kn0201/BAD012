import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.page.html',
  styleUrls: ['./admin-page.page.scss'],
})
export class AdminPagePage implements OnInit {
  public adminPages = [
    { title: 'Chart', url: '/admin/chart-list', icon: 'stats-chart' },
    { title: 'Product', url: '/admin/product-list', icon: 'pricetag' },
    { title: 'Discount', url: '/admin/discount-list', icon: 'logo-usd' },
    { title: 'Member', url: '/admin/member-list', icon: 'person' },
    { title: 'Trash', url: '/admin/trash-list', icon: 'trash' },
  ];
  constructor() {}

  ngOnInit() {}
}
