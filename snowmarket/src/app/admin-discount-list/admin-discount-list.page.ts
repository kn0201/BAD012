import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { IonModal, LoadingController, ModalController } from '@ionic/angular'
import { APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table'

import {
  PriceDiscount,
  ProductDiscount,
  Products,
  Brand,
  Category,
} from 'src/assets/type'

import { DOMAIN } from 'utils/domain'
import { sweetalert2error } from 'utils/sweetalert2'
import { AdminService } from '../admin.service'

@Component({
  selector: 'app-admin-discount-list',
  templateUrl: './admin-discount-list.page.html',
  styleUrls: ['./admin-discount-list.page.scss'],
})
export class AdminDiscountListPage implements OnInit {
  constructor(private adminService: AdminService) {}

  @ViewChild('productHeaderActionTemplate', { static: true })
  productHeaderActionTemplate!: TemplateRef<any>

  @ViewChild('categoryHeaderActionTemplate', { static: true })
  categoryHeaderActionTemplate!: TemplateRef<any>

  @ViewChild('brandHeaderActionTemplate', { static: true })
  brandHeaderActionTemplate!: TemplateRef<any>

  @ViewChild('table')
  table!: APIDefinition

  @ViewChild('addModal') addModal: any
  @ViewChild('productModal') productModal: any
  @ViewChild('brandModal') brandModal: any
  @ViewChild('categoryModal') categoryModal: any

  public productDiscountColumns: Columns[] = []
  productDiscountList!: Config
  productDiscountData: ProductDiscount[] = []
  productDiscountDataCopy: ProductDiscount[] = []
  selectedProduct = ''
  selectedBrand = ''
  selectedCategory = ''

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
  ]
  priceDiscountList!: Config
  priceDiscountData: PriceDiscount[] = []
  priceDiscountDataCopy: PriceDiscount[] = []

  productListData: Products[] = []
  filteredProduct: Products[] = []

  brandListData: Brand[] = []
  filteredBrand: Brand[] = []

  categoriesListData: Category[] = []
  filteredCategory: Category[] = []

  title: string | null = ''
  product_id!: number
  brand_id!: number
  categories_id!: number
  quantity: any | null = ''
  discount_amount: any | null = ''
  discount_rate: any | null = ''
  total_price: any | null = ''

  selectedDiscount = 'product_discount'
  selectedStartDate = ''
  selectedEndDate = ''

  selectedProductID = ''
  selectedProductName = ''

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

    this.productDiscountColumns = [
      { key: 'id', title: 'Discount ID' },
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
    ]
    this.productDiscountList = { ...DefaultConfig }
    this.productDiscountList.fixedColumnWidth = true
    this.productDiscountList.orderEnabled = true
    this.productDiscountList.rows = 4
    this.priceDiscountList = { ...DefaultConfig }
    this.priceDiscountList.fixedColumnWidth = true
    this.priceDiscountList.orderEnabled = true
    this.priceDiscountList.threeWaySort = true
    this.priceDiscountList.rows = 4
  }

  filter(field: string, event: Event | string): void {
    const value =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value

    if (field === 'product_id') {
      this.selectedProduct = value
    }
    if (field === 'brand_id') {
      this.selectedBrand = value
    }
    if (field === 'categories_id') {
      this.selectedCategory = value
    }

    this.productDiscountData = [...this.productDiscountDataCopy].filter(
      ({ product_id, brand_id, categories_id }) => {
        return (
          product_id.toString().includes(this.selectedProduct) &&
          brand_id?.toString().includes(this.selectedBrand) &&
          categories_id?.toString().includes(this.selectedCategory)
        )
      }
    )
  }

  async loadList(): Promise<any> {
    let json = await this.adminService.getDiscountList()

    let productDiscountList = json.productDiscountList
    let priceDiscountList = json.priceDiscountList

    this.productDiscountData = productDiscountList
    this.productDiscountDataCopy = productDiscountList

    this.priceDiscountData = priceDiscountList
    this.priceDiscountDataCopy = priceDiscountList

    this.productListData = json.productList
    this.filteredProduct = json.productList

    this.brandListData = json.brandList
    this.filteredBrand = json.brandList

    this.categoriesListData = json.categoriesList
    this.filteredCategory = json.categoriesList
  }

  normalize() {
    this.canDismiss = false
  }

  dismiss(modal: any) {
    this.canDismiss = true
    modal.dismiss()
  }

  confirm() {
    console.log(this.selectedDiscount)
    console.log('title : ' + this.title)
    console.log('Product ID : ' + this.selectedProductID)
    console.log('Brand ID : ' + this.selectedBrandID)
    console.log('Category ID : ' + this.selectedCategoryID)
    console.log('Quantity : ' + this.quantity)
    console.log('Discount Amount : ' + this.discount_amount)
    console.log('Total Price : ' + this.total_price)
    console.log('Discount Rate : ' + this.discount_rate)
    console.log(this.selectedStartDate)
    console.log(this.selectedEndDate)

    this.clear()
    this.addModal.dismiss()
  }

  handleChange(event: any) {
    console.log(event.target.value)
    if (event.target.value === 'product_discount') {
      this.selectedDiscount = 'product_discount'
    } else if (event.target.value === 'price_discount') {
      this.selectedDiscount = 'price_discount'
    }
  }

  clear() {
    this.title = ''
    this.selectedProductID = ''
    this.selectedBrandID = ''
    this.selectedCategoryID = ''
    this.idMsg = 'Click to Select'
    this.brandMsg = 'Click to Select'
    this.categoryMsg = 'Click to Select'
    this.quantity = ''
    this.discount_amount = ''
    this.total_price = ''
    this.discount_rate = ''
  }

  selectProductID(event: any) {
    if (!event.target.checked) {
      this.selectedProductID = ''
      this.idMsg = 'Click to Select'
      return
    }
    this.selectedProductID = event.target.value
    this.selectedProductName = event.target.name
    this.idMsg = `${this.selectedProductID} : ${this.selectedProductName}`
  }

  selectBrandID(event: any) {
    if (!event.target.checked) {
      this.selectedBrandID = ''
      this.searchBrandParam = ''
      this.brandMsg = 'Click to Select'
      this.filterBy('brand_id', this.selectedBrandID)
      return
    }
    this.selectedBrandID = event.target.value
    this.selectedBrandName = event.target.name
    this.brandMsg = `${this.selectedBrandID} : ${this.selectedBrandName}`
    this.filterBy('brand_id', this.selectedBrandID)
  }

  selectCategoryID(event: any) {
    if (!event.target.checked) {
      this.selectedCategoryID = ''
      this.searchCategoryParam = ''
      this.categoryMsg = 'Click to Select'
      this.filterBy('categories_id', this.selectedCategoryID)
      return
    }

    this.selectedCategoryID = event.target.value
    this.selectedCategoryName = event.target.name
    this.categoryMsg = `${this.selectedCategoryID} : ${this.selectedCategoryName}`
    this.filterBy('categories_id', this.selectedCategoryID)
  }

  startDay(event: any) {
    this.selectedStartDate = event.target.value
  }
  endDay(event: any) {
    this.selectedEndDate = event.target.value
  }

  searchProduct(ev: any) {
    this.filterProduct(ev.target.value)
  }

  filterProduct(searchQuery: string | undefined) {
    if (searchQuery === undefined) {
      this.filteredProduct = [...this.productListData]
    } else {
      const normalizedQuery = searchQuery.toLowerCase()
      this.filteredProduct = this.productListData.filter((product) => {
        return product.name.toLowerCase().includes(normalizedQuery)
      })
    }
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

  filterBy(field: string, param: string): void {
    if (field === 'brand_id') {
      this.searchBrandParam = param
    }
    if (field === 'categories_id') {
      this.searchCategoryParam = param
    }

    this.filteredProduct = [...this.productListData].filter(
      ({ brand_id, category_id }) => {
        return (
          brand_id?.toString().includes(this.searchBrandParam) &&
          category_id?.toString().includes(this.searchCategoryParam)
        )
      }
    )
  }

  @Output() async addRow(selectValue: string): Promise<void> {
    this.clear()
    this.addModal.dismiss()
  }
}
