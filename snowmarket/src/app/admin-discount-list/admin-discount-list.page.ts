import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { IonModal, LoadingController } from '@ionic/angular';
import { APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';

import {
  priceDiscount,
  productDiscount,
  products,
  brand,
  category,
} from 'src/assets/interface';

import { DOMAIN } from 'utils/domain';
import sweetalert2error from 'utils/sweetalert2error';

@Component({
  selector: 'app-admin-discount-list',
  templateUrl: './admin-discount-list.page.html',
  styleUrls: ['./admin-discount-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDiscountListPage implements OnInit {
  constructor(private loadingCtrl: LoadingController) {}

  @ViewChild('productHeaderActionTemplate', { static: true })
  productHeaderActionTemplate!: TemplateRef<any>;

  @ViewChild('categoryHeaderActionTemplate', { static: true })
  categoryHeaderActionTemplate!: TemplateRef<any>;

  @ViewChild('brandHeaderActionTemplate', { static: true })
  brandHeaderActionTemplate!: TemplateRef<any>;

  @ViewChild('table')
  table!: APIDefinition;

  @ViewChild(IonModal) modal!: IonModal;

  public productDiscountColumns: Columns[] = [];
  productDiscountList!: Config;
  productDiscountData: productDiscount[] = [];
  productDiscountDataCopy: productDiscount[] = [];
  selectedProduct = '';
  selectedBrand = '';
  selectedCategory = '';

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

  productListData: products[] = [];
  brandListData: brand[] = [];
  categoriesListData: category[] = [];

  title!: string;
  product_id!: number;
  brand_id!: number;
  categories_id!: number;
  quantity!: number;
  discount_amount!: number;
  discount_rate!: number;
  total_price!: number;

  selectDiscount = 'product_discount';
  selectStartDate = '';
  selectEndDate = '';
  selectedProductID = '';
  selectedBrandID = '';
  selectedCategoryID = '';

  finishLoading: boolean = false;

  ngOnInit() {
    this.loadList();
    // this.showLoading();
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
    this.productDiscountList = { ...DefaultConfig };
    this.productDiscountList.fixedColumnWidth = true;
    this.productDiscountList.orderEnabled = true;
    this.productDiscountList.rows = 4;
    this.priceDiscountList = { ...DefaultConfig };
    this.priceDiscountList.fixedColumnWidth = true;
    this.priceDiscountList.orderEnabled = true;
    this.priceDiscountList.threeWaySort = true;
    this.priceDiscountList.rows = 4;
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
    console.log(this.selectedProductID);
    console.log(this.selectedBrandID);
    console.log(this.selectedCategoryID);
    console.log(this.quantity);
    console.log(this.discount_amount);
    console.log(this.total_price);
    console.log(this.discount_rate);
    console.log(this.selectStartDate);
    console.log(this.selectEndDate);
    // console.log(this);

    this.modal.dismiss();
  }

  handleChange(event: any) {
    console.log(event.target.value);
    if (event.target.value === 'product_discount') {
      this.selectDiscount = 'product_discount';
    } else if (event.target.value === 'price_discount') {
      this.selectDiscount = 'price_discount';
    }
  }

  selectProductID(event: any) {
    this.selectedProductID = event.target.value;
  }

  selectBrandID(event: any) {
    this.selectedBrandID = event.target.value;
  }

  selectCategoryID(event: any) {
    this.selectedCategoryID = event.target.value;
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

  async loadList(): Promise<any> {
    let res = await fetch(`${DOMAIN}/admin/discount-list`, {
      headers: {
        Accept: 'application/json',
      },
    });
    let json = await res.json();
    if (json.error) {
      sweetalert2error(json.error);
      return;
    }
    // console.log(json);

    let productDiscountList = json.productDiscountList;
    let priceDiscountList = json.priceDiscountList;

    this.productDiscountData = productDiscountList;
    this.productDiscountDataCopy = productDiscountList;
    this.priceDiscountData = priceDiscountList;
    this.priceDiscountDataCopy = priceDiscountList;
    this.productListData = json.productList;
    this.brandListData = json.brandList;
    this.categoriesListData = json.categoriesList;
    console.log(this.productListData);
  }

  // async showLoading() {
  //   let duration = 30000;
  //   const loading = await this.loadingCtrl.create({
  //     message: 'Dismissing after 3 seconds...',
  //     duration: duration,
  //   });

  //   loading.present();
  //   setTimeout(() => {
  //     loading.dismiss();
  //   }, 1000);
  //   if (this.finishLoading) {
  //   }
  // }
}
