import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Chart', url: '/folder/chart', icon: 'stats-chart' },
    { title: 'Product', url: '/folder/product', icon: 'pricetag' },
    { title: 'Discount', url: '/folder/discount', icon: 'heart' },
    { title: 'Member', url: '/folder/member', icon: 'person' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
