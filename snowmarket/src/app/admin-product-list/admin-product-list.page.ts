import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table'
import { Products } from 'src/assets/type'

import { DOMAIN } from 'utils/domain'
import { sweetalert2error } from 'utils/sweetalert2'
import { AdminService } from '../admin.service'

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.page.html',
  styleUrls: ['./admin-product-list.page.scss'],
})
export class AdminProductListPage implements OnInit {
  constructor(private adminService: AdminService) {}

  @ViewChild('productHeaderActionTemplate', { static: true })
  productHeaderActionTemplate!: TemplateRef<any>
  @ViewChild('categoryHeaderActionTemplate', { static: true })
  categoryHeaderActionTemplate!: TemplateRef<any>
  @ViewChild('brandHeaderActionTemplate', { static: true })
  brandHeaderActionTemplate!: TemplateRef<any>
  @ViewChild('table')
  table!: APIDefinition

  public columns: Columns[] = []

  data: Products[] = []
  dataCopy: Products[] = []

  configuration!: Config

  selectedProduct = ''
  selectedBrand = ''
  selectedCategory = ''

  ngOnInit() {
    this.loadList()

    this.columns = [
      { key: 'id', title: 'Product ID' },
      {
        key: 'brand_name',
        title: 'Brand Name',
        headerActionTemplate: this.brandHeaderActionTemplate,
      },
      {
        key: 'category_name',
        title: 'Category Name',
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
    ]
    this.configuration = { ...DefaultConfig }
    this.configuration.checkboxes = true
    this.configuration.fixedColumnWidth = false
    this.configuration.rows = 10
  }

  filter(field: string | number, event: Event | string): void {
    const value =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value
    if (field === 'name') {
      this.selectedProduct = value
    }
    if (field === 'brand_name') {
      this.selectedBrand = value
    }
    if (field === 'category_name') {
      this.selectedCategory = value
    }
    this.data = [...this.dataCopy].filter(
      ({ name, brand_name, category_name }) => {
        return (
          name
            .toLocaleLowerCase()
            .includes(this.selectedProduct.toLocaleLowerCase()) &&
          brand_name?.toLocaleLowerCase().includes(this.selectedBrand) &&
          category_name?.toLocaleLowerCase().includes(this.selectedCategory)
        )
      }
    )
  }

  async loadList(): Promise<any> {
    let json = await this.adminService.getProductList()
    this.data = json.productList
    this.dataCopy = json.productList
  }
}
