import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { products } from 'src/assets/interface';
import { productList } from 'src/assets/product';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.page.html',
  styleUrls: ['./admin-product-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductListPage implements OnInit {
  constructor() {}
  @ViewChild('productHeaderActionTemplate', { static: true })
  productHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('table')
  table!: APIDefinition;

  public columns: Columns[] = [];
  data: products[] = [];
  dataCopy: products[] = [];
  configuration!: Config;
  selectedProduct = '';

  ngOnInit() {
    this.configuration = { ...DefaultConfig };
    this.configuration.checkboxes = true;
    this.configuration.fixedColumnWidth = true;
    this.columns = [
      { key: 'id', title: 'Product ID' },
      {
        key: 'name',
        title: 'Product Name',
        headerActionTemplate: this.productHeaderActionTemplate,
      },
      {
        key: 'price',
        title: 'Price',
      },
      { key: 'stock', title: 'Stock' },
    ];
    this.data = productList;
    this.dataCopy = productList;
  }

  filter(field: string, event: Event | string): void {
    const value =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;
    if (field === 'name') {
      this.selectedProduct = value;
    }
    this.data = [...this.dataCopy].filter(({ name }) => {
      return name
        .toLocaleLowerCase()
        .includes(this.selectedProduct.toLocaleLowerCase());
    });
  }
}
