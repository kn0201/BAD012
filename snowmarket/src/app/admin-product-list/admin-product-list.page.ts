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
  @ViewChild('categoryHeaderActionTemplate', { static: true })
  categoryHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('brandHeaderActionTemplate', { static: true })
  brandHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('table')
  table!: APIDefinition;

  public columns: Columns[] = [];
  data: products[] = [];
  dataCopy: products[] = [];
  configuration!: Config;
  selectedProduct = '';
  selectedBrand = '';
  selectedCategory = '';

  ngOnInit() {
    this.configuration = { ...DefaultConfig };
    this.configuration.checkboxes = true;
    this.configuration.fixedColumnWidth = true;
    this.configuration.rows = 10;
    this.columns = [
      { key: 'id', title: 'Product ID' },
      {
        key: 'brand_id',
        title: 'Brand ID',
        headerActionTemplate: this.brandHeaderActionTemplate,
      },
      {
        key: 'category_id',
        title: 'Category ID',
        headerActionTemplate: this.categoryHeaderActionTemplate,
      },
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

  filter(field: string | number, event: Event | string): void {
    const value =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;
    if (field === 'name') {
      this.selectedProduct = value;
    }
    if (field === 'brand_id') {
      this.selectedBrand = value;
    }
    if (field === 'category_id') {
      this.selectedCategory = value;
    }
    this.data = [...this.dataCopy].filter(({ name, brand_id, category_id }) => {
      return (
        name
          .toLocaleLowerCase()
          .includes(this.selectedProduct.toLocaleLowerCase()) &&
        brand_id.toString().includes(this.selectedBrand) &&
        category_id.toString().includes(this.selectedCategory)
      );
    });
  }
}
