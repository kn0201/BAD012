import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { products } from 'src/assets/interface';
import Swal from 'sweetalert2';
import { DOMAIN } from 'utils/domain';
import sweetalert2error from 'utils/sweetalert2error';

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
    this.loadList();

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
    this.configuration = { ...DefaultConfig };
    this.configuration.checkboxes = true;
    this.configuration.fixedColumnWidth = true;
    this.configuration.rows = 10;
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

  async loadList(): Promise<any> {
    let res = await fetch(`${DOMAIN}/admin/product-list`, {
      headers: {
        Accept: 'application/json',
      },
    });
    let json = await res.json();
    if (json.error) {
      sweetalert2error(json.error);
      return;
    }
    console.log(json.productList);

    this.data = json.productList;
    this.dataCopy = json.productList;
  }
}
