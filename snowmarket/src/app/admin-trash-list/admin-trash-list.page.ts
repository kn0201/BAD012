import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { AdminService } from '../admin.service'
import { APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table'
import { DeletedProduct } from 'src/assets/type'

@Component({
  selector: 'app-admin-trash-list',
  templateUrl: './admin-trash-list.page.html',
  styleUrls: ['./admin-trash-list.page.scss'],
})
export class AdminTrashListPage implements OnInit {
  constructor(private adminService: AdminService) {}

  @ViewChild('productHeaderActionTemplate', { static: true })
  productHeaderActionTemplate!: TemplateRef<any>

  @ViewChild('table')
  table!: APIDefinition

  public columns: Columns[] = []
  configuration!: Config
  data: DeletedProduct[] = []
  dataCopy: DeletedProduct[] = []
  selectedProduct = ''

  ngOnInit() {
    this.loadList()

    this.columns = [
      { key: 'id', title: 'Product ID' },
      // {
      //   key: 'brand_name',
      //   title: 'Brand Name',
      //   headerActionTemplate: this.brandHeaderActionTemplate,
      // },
      // {
      //   key: 'category_name',
      //   title: 'Category Name',
      //   headerActionTemplate: this.categoryHeaderActionTemplate,
      // },
      {
        key: 'name',
        title: 'Product Name',
        headerActionTemplate: this.productHeaderActionTemplate,
      },
      // {
      //   key: 'price',
      //   title: 'Price',
      // },
      // { key: 'stock', title: 'Stock' },
    ]
    this.configuration = { ...DefaultConfig }
    this.configuration.checkboxes = true
    this.configuration.orderEnabled = true
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
    // if (field === 'brand_name') {
    //   this.selectedBrand = value
    // }
    // if (field === 'category_name') {
    //   this.selectedCategory = value
    // }
    // this.data = [...this.dataCopy].filter(
    //   ({ name, brand_name, category_name }) => {
    //     return (
    //       name
    //         .toLocaleLowerCase()
    //         .includes(this.selectedProduct.toLocaleLowerCase()) &&
    //       brand_name?.toLocaleLowerCase().includes(this.selectedBrand) &&
    //       category_name?.toLocaleLowerCase().includes(this.selectedCategory)
    //     )
    //   }
    // )
  }

  async loadList(): Promise<any> {
    let json = await this.adminService.getTrashList()
    this.data = json.deletedProductList
    this.dataCopy = json.deletedProductList

    // this.brandListData = json.brandList
    // this.filteredBrand = json.brandList

    // this.categoriesListData = json.categoriesList
    // this.filteredCategory = json.categoriesList
  }
}
