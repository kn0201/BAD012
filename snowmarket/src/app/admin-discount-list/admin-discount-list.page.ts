import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { IonModal } from '@ionic/angular';
import { APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { productDiscountList, priceDiscountList } from 'src/assets/discount';
import { priceDiscount, productDiscount } from 'src/assets/interface';
import { DOMAIN } from 'utils/domain';

@Component({
  selector: 'app-admin-discount-list',
  templateUrl: './admin-discount-list.page.html',
  styleUrls: ['./admin-discount-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDiscountListPage implements OnInit {
  constructor() {}

  @ViewChild('productHeaderActionTemplate', { static: true })
  productHeaderActionTemplate!: TemplateRef<any>;

  @ViewChild('categoryHeaderActionTemplate', { static: true })
  categoryHeaderActionTemplate!: TemplateRef<any>;

  @ViewChild('brandHeaderActionTemplate', { static: true })
  brandHeaderActionTemplate!: TemplateRef<any>;

  @ViewChild('table')
  table!: APIDefinition;

  @ViewChild(IonModal) modal!: IonModal;

  public productDiscountColumns!: Columns[];
  productDiscountList!: Config;
  productDiscountData: productDiscount[] = [];
  productDiscountDataCopy: productDiscount[] = [];
  selectedProduct = '';
  selectedBrand = '';
  selectedCategory = '';

  public priceDiscountColumns!: Columns[];
  priceDiscountList!: Config;
  priceDiscountData: priceDiscount[] = [];
  priceDiscountDataCopy: priceDiscount[] = [];

  message = '';
  name!: string;

  selectValue = '';

  ngOnInit() {
    this.productDiscountColumns = [
      { key: 'id', title: 'Brand ID' },
      { key: 'title', title: 'Title' },
      {
        key: 'product_id',
        title: 'Product ID',
        headerActionTemplate: this.productHeaderActionTemplate,
      },
      {
        key: 'brand_id',
        title: 'Brand ID',
        headerActionTemplate: this.brandHeaderActionTemplate,
      },
      {
        key: 'categories_id',
        title: 'Category ID',
        headerActionTemplate: this.categoryHeaderActionTemplate,
      },
      { key: 'amount', title: 'Quantity' },
      { key: 'discount_amount', title: 'Discount Amount' },
      { key: 'start_date', title: 'Start date' },
      { key: 'end_date', title: 'End date' },
    ];
    this.priceDiscountColumns = [
      { key: 'id', title: ' Price Discount ID' },
      {
        key: 'title',
        title: 'Title',
      },
      { key: 'total_price', title: 'Total' },
      { key: 'discount_rate', title: 'Discount Rate' },
      { key: 'start_date', title: 'Start date' },
      { key: 'end_date', title: 'End date' },
    ];
    this.productDiscountList = { ...DefaultConfig };
    this.productDiscountList.fixedColumnWidth = true;
    this.productDiscountList.orderEnabled = true;
    this.productDiscountList.rows = 4;
    this.priceDiscountList = { ...DefaultConfig };
    this.priceDiscountList.fixedColumnWidth = true;
    this.priceDiscountList.orderEnabled = true;
    this.priceDiscountList.threeWaySort = true;
    this.priceDiscountList.rows = 4;
    this.productDiscountData = productDiscountList;
    this.productDiscountDataCopy = productDiscountList;
    this.priceDiscountData = priceDiscountList;
    this.priceDiscountDataCopy = priceDiscountList;
  }

  filter(field: string, event: Event | string): void {
    const value =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;

    if (field === 'product_id') {
      this.selectedProduct = value;
    }
    if (field === 'brand_id') {
      this.selectedBrand = value;
    }
    if (field === 'categories_id') {
      this.selectedCategory = value;
    }

    this.productDiscountData = [...this.productDiscountDataCopy].filter(
      ({ product_id, brand_id, categories_id }) => {
        return (
          product_id.toString().includes(this.selectedProduct) &&
          brand_id?.toString().includes(this.selectedBrand) &&
          categories_id?.toString().includes(this.selectedCategory)
        );
      }
    );
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  handleChange(event: any) {
    this.selectValue = event.target.value;
  }

  @Output() async addRow(selectValue: string): Promise<void> {
    if (selectValue === 'brand') {
      console.log('brand name : ' + this.name);
      this.productDiscountData = [
        ...this.productDiscountData,
        {
          id: '4',
          title: '各類水果 30蚊 4個',
          product_id: '5',
          brand_id: '',
          categories_id: '3',
          amount: '4',
          discount_amount: '-22',
          start_date: '0911',
          end_date: '0919',
        },
      ];
      let msgName = this.name;
      let submitObject = { msgName };
      let res = await fetch(`${DOMAIN}/receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitObject),
      });
      let json = await res.json();
      if (json.error) {
        console.log('Failed to load Recipes', json.error, 'error');
        return;
      }
      let result = json.result;
      console.log(' From Nestjs : ' + result);
    }
    if (selectValue === 'category') {
      console.log('category name : ' + this.name);
      this.priceDiscountData = [
        ...this.priceDiscountData,
        {
          id: '3',
          title: '滿1000 7折',
          total_price: '1000',
          discount_rate: '*0.7',
          start_date: '0911',
          end_date: '0919',
        },
      ];
      let res = await fetch(`${DOMAIN}/receipt`);
      let json = await res.json();
      if (json.error) {
        console.log('Failed to load Recipes', json.error, 'error');
        return;
      }
      let result = json.result;
      console.log(' From Nestjs : ' + result);
    }
    this.name = '';
    this.modal.dismiss();
  }
}
