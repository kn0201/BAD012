import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table'
import { Brand, Category, Products } from 'src/assets/type'
import Swal from 'sweetalert2'
import { DOMAIN } from 'utils/domain'
import { sweetalert2Success, sweetalert2error } from 'utils/sweetalert2'
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

  @ViewChild('productModal') productModal: any
  @ViewChild('brandModal') brandModal: any
  @ViewChild('categoryModal') categoryModal: any

  @ViewChild('table')
  table!: APIDefinition

  public columns: Columns[] = []

  selectedChecked = new Set()

  data: Products[] = []
  dataCopy: Products[] = []

  brandListData: Brand[] = []
  filteredBrand: Brand[] = []

  categoriesListData: Category[] = []
  filteredCategory: Category[] = []

  configuration!: Config

  selectedProduct = ''
  selectedBrand = ''
  selectedCategory = ''

  name: string = ''
  price: number | null = null

  selectedBrandID = ''
  selectedBrandName = ''

  selectedCategoryID = ''
  selectedCategoryName = ''

  searchBrandParam = ''
  searchCategoryParam = ''

  originalMsg = 'Click to Select'

  idMsg = this.originalMsg
  brandMsg = this.originalMsg
  categoryMsg = this.originalMsg

  canDismiss = false

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

  normalize() {
    this.canDismiss = false
  }

  dismiss(modal: any) {
    this.filteredCategory = [...this.categoriesListData]
    this.filteredBrand = [...this.brandListData]
    this.canDismiss = true
    modal.dismiss()
  }

  clear() {
    this.selectedBrandID = ''
    this.selectedCategoryID = ''
    this.brandMsg = 'Click to Select'
    this.categoryMsg = 'Click to Select'
    this.name = ''
    this.price = null
  }

  selected(
    event: any,
    id: string,
    param: string,
    msg: string,
    name: string,
    id_param: string
  ) {
    if (!event.target.checked) {
      ;(this as any)[id] = ''
      ;(this as any)[param] = ''
      ;(this as any)[msg] = this.originalMsg
      this.filterBy(id_param, id)

      return
    }
    ;(this as any)[id] = event.target.value
    ;(this as any)[name] = event.target.name
    ;(this as any)[msg] = `${event.target.value} : ${event.target.name}`
  }
  filterBy(field: string, param: string): void {
    if (field === 'categories_id') {
      this.searchCategoryParam = param
    }

    this.filteredBrand = [...this.brandListData].filter(({ id }) => {
      return id?.toString().includes(this.searchCategoryParam)
    })
  }
  searchBrand(ev: any) {
    this.filterBrand(ev.target.value)
  }

  filterBrand(searchQuery: string | undefined) {
    if (searchQuery === undefined) {
      this.filteredBrand = [...this.brandListData]
    } else {
      const normalizedQuery = searchQuery.toLowerCase()
      this.filteredBrand = this.brandListData.filter((brand) => {
        return brand.name.toLowerCase().includes(normalizedQuery)
      })
    }
  }

  searchCategory(ev: any) {
    this.filterCategory(ev.target.value)
  }

  filterCategory(searchQuery: string | undefined) {
    if (searchQuery === undefined) {
      this.filteredCategory = [...this.categoriesListData]
    } else {
      const normalizedQuery = searchQuery.toLowerCase()
      this.filteredCategory = this.categoriesListData.filter((category) => {
        return category.name.toLowerCase().includes(normalizedQuery)
      })
    }
  }

  async submit() {
    if (this.selectedCategoryID == '') {
      sweetalert2error('Missing Category ID')
      return
    } else if (this.selectedBrandID == '') {
      sweetalert2error('Missing Brand ID')
      return
    } else if (this.name == '') {
      sweetalert2error('Missing Name')
      return
    } else if (!this.price) {
      sweetalert2error('Missing Price')
      return
    }
    let json = await this.adminService.addProduct({
      categoryID: this.selectedCategoryID,
      brandID: this.selectedBrandID,
      name: this.name,
      price: this.price,
    })
    await sweetalert2Success(`Adding ${json.name}`)
    this.loadList()
    this.canDismiss = true
    this.clear()
    this.dismiss(this.productModal)
  }

  eventEmitted($event: { event: string; value: any }): void {
    switch ($event.event) {
      case 'onCheckboxSelect':
        if (this.selectedChecked.has($event.value.rowId)) {
          this.selectedChecked.delete($event.value.rowId)
          console.log(this.selectedChecked)
        } else {
          this.selectedChecked.add($event.value.rowId)
          console.log(this.selectedChecked)
        }
        break
      case 'onSelectAll':
        this.data.forEach((_, key) => {
          if (this.selectedChecked.has(key)) {
            this.selectedChecked.delete(key)
            console.log(this.selectedChecked)
          } else {
            this.selectedChecked.add(key)
            console.log(this.selectedChecked)
          }
        })
        break
    }
  }

  deleteConfirm() {
    let arrayID = []
    for (let id of this.selectedChecked) {
      arrayID.push(id)
      console.log(arrayID)
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete()
      }
    })
  }

  async delete() {
    await this.adminService.deleteProduct(this.selectedChecked)
    Swal.fire({
      title: 'Finish',
      text: 'Product Deleted',
      icon: 'success',
      heightAuto: false,
      didClose: () => {
        this.loadList()
      },
    })
  }

  async loadList(): Promise<any> {
    let json = await this.adminService.getProductList()
    this.data = json.productList
    this.dataCopy = json.productList

    this.brandListData = json.brandList
    this.filteredBrand = json.brandList

    this.categoriesListData = json.categoriesList
    this.filteredCategory = json.categoriesList
  }
}
