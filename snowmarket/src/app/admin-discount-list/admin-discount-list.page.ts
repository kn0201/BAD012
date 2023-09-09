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

  public productDiscountColumns: Columns[] = [
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
  productDiscountList!: Config;
  productDiscountData: productDiscount[] = [];
  productDiscountDataCopy: productDiscount[] = [];
  selectedProduct = '';
  selectedBrand = '';
  selectedCategory = '';
  selectedProductDiscount: boolean = true;

  public priceDiscountColumns: Columns[] = [
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
  priceDiscountList!: Config;
  priceDiscountData: priceDiscount[] = [];
  priceDiscountDataCopy: priceDiscount[] = [];

  message = '';

  title!: string;
  quantity!: number;
  discount_amount!: number;

  selectDiscount = 'product_discount';
  selectStartDate = '';
  selectEndDate = '';

  ngOnInit() {
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
    console.log(this.selectDiscount);
    console.log(this.title);
    console.log(this.quantity);
    console.log(this.discount_amount);
    console.log(this.selectStartDate);
    console.log(this.selectEndDate);
    this.modal.dismiss();
  }

  handleChange(event: any) {
    console.log(event.target.value);
    if (event.target.value === 'product_discount') {
      this.selectedProductDiscount = true;
      this.selectDiscount = 'product_discount';
    } else if (event.target.value === 'price_discount') {
      this.selectedProductDiscount = false;
      this.selectDiscount = 'price_discount';
    }
    // this.selectDiscount = event.target.value;
    // if (this.selectDiscount === 'product_discount') {
    //   // document.querySelector('productQuantity').hidden = false;
    // }
  }
  startDay(event: any) {
    this.selectStartDate = event.target.value;
  }
  endDay(event: any) {
    this.selectEndDate = event.target.value;
  }

  @Output() async addRow(selectValue: string): Promise<void> {
    this.title = '';
    this.modal.dismiss();
  }
}
