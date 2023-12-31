import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table'

import {
  PriceDiscount,
  ProductDiscount,
  Products,
  Brand,
  Category,
} from 'src/assets/type'

import { AdminService } from '../admin.service'
import { sweetalert2Success, sweetalert2error } from 'utils/sweetalert2'
import Swal from 'sweetalert2'

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

  title: string = ''
  product_id!: number
  brand_id!: number
  categories_id!: number
  quantity: any | null = ''
  discount_amount: any | null = ''
  discount_rate: any | null = ''
  total_price: any | null = ''

  selectedChecked = new Set()
  selectedProductChecked = new Set()
  selectedPriceChecked = new Set()

  arrayID: Array<number> = []
  ProductArrayID: Array<number> = []
  PriceArrayID: Array<number> = []

  selectedDiscount = 'product_discount'
  selectedStartDate = ''
  selectedEndDate = ''

  selectedProductID = null
  selectedProductName = ''

  selectedBrandID = null
  selectedBrandName = ''

  selectedCategoryID = null
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
      { key: 'id', title: 'Product Discount ID' },
      { key: 'title', title: 'Title' },
      {
        key: 'product_name',
        title: 'Product Name',
        // headerActionTemplate: this.productHeaderActionTemplate,
      },
      {
        key: 'brand_name',
        title: 'Brand Name',
        // headerActionTemplate: this.brandHeaderActionTemplate,
      },
      {
        key: 'category_name',
        title: 'Category Name',
        // headerActionTemplate: this.categoryHeaderActionTemplate,
      },
      { key: 'quantity', title: 'Quantity' },
      { key: 'discount_amount', title: 'Discount Amount' },
      { key: 'start_date', title: 'Start date' },
      { key: 'end_date', title: 'End date' },
    ]
    this.productDiscountList = { ...DefaultConfig }
    this.productDiscountList.fixedColumnWidth = false
    this.productDiscountList.orderEnabled = true
    this.productDiscountList.rows = 5
    this.productDiscountList.checkboxes = true
    this.priceDiscountList = { ...DefaultConfig }
    this.priceDiscountList.fixedColumnWidth = true
    this.priceDiscountList.orderEnabled = true
    this.priceDiscountList.threeWaySort = true
    this.priceDiscountList.checkboxes = true
    this.priceDiscountList.rows = 5
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
          product_id?.toString().includes(this.selectedProduct) &&
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

    for (let item of productDiscountList) {
      item.start_date = new Date(item.start_date).toLocaleDateString()
      item.end_date = new Date(item.end_date).toLocaleDateString()
    }

    this.productDiscountData = productDiscountList
    this.productDiscountDataCopy = productDiscountList

    this.priceDiscountData = priceDiscountList
    this.priceDiscountDataCopy = priceDiscountList

    for (let item of priceDiscountList) {
      item.start_date = new Date(item.start_date).toLocaleDateString()
      item.end_date = new Date(item.end_date).toLocaleDateString()
    }
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

  handleChange(event: any) {
    if (event.target.value === 'product_discount') {
      this.selectedDiscount = 'product_discount'
    } else if (event.target.value === 'price_discount') {
      this.selectedDiscount = 'price_discount'
    }
  }

  clear() {
    this.title = ''
    this.selectedProductID = null
    this.selectedBrandID = null
    this.selectedCategoryID = null
    this.idMsg = 'Click to Select'
    this.brandMsg = 'Click to Select'
    this.categoryMsg = 'Click to Select'
    this.quantity = ''
    this.discount_amount = ''
    this.total_price = ''
    this.discount_rate = ''
  }

  startDay(event: any) {
    this.selectedStartDate = event.target.value
  }
  endDay(event: any) {
    this.selectedEndDate = event.target.value
  }

  selectProductID(event: any) {
    if (!event.target.checked) {
      this.selectedProductID = null
      this.idMsg = 'Click to Select'
      return
    }
    this.selectedProductID = event.target.value
    this.selectedProductName = event.target.name
    this.idMsg = `${this.selectedProductID} : ${this.selectedProductName}`
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

    this.filterBy(id_param, event.target.value)
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
      ({ brand_id, categories_id }) => {
        return (
          brand_id?.toString().includes(this.searchBrandParam) &&
          categories_id?.toString().includes(this.searchCategoryParam)
        )
      }
    )
  }

  eventEmittedProduct($event: { event: string; value: any }): void {
    switch ($event.event) {
      case 'onCheckboxSelect':
        if (this.selectedProductChecked.has($event.value.rowId)) {
          this.selectedProductChecked.delete($event.value.rowId)
          let index = this.ProductArrayID.indexOf(+$event.value.row.id)
          if (index !== -1) {
            this.ProductArrayID.splice(index, 1)
          }
        } else {
          this.selectedProductChecked.add($event.value.rowId)
          this.ProductArrayID.push(+$event.value.row.id)
        }

        break
    }
  }

  eventEmittedPrice($event: { event: string; value: any }): void {
    switch ($event.event) {
      case 'onCheckboxSelect':
        if (this.selectedPriceChecked.has($event.value.rowId)) {
          this.selectedPriceChecked.delete($event.value.rowId)
          let index = this.PriceArrayID.indexOf(+$event.value.row.id)
          if (index !== -1) {
            this.PriceArrayID.splice(index, 1)
          }
        } else {
          this.selectedPriceChecked.add($event.value.rowId)
          this.PriceArrayID.push(+$event.value.row.id)
        }

        break
    }
  }

  async deleteConfirm() {
    const { value: discountType } = await Swal.fire({
      title: 'What type you want to Delete',
      icon: 'warning',
      input: 'select',
      inputOptions: {
        Product: 'Product Discount',
        Price: 'Price Discount',
      },
      inputPlaceholder: 'Choose One',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      heightAuto: false,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value === 'Product') {
            let type = 'quantity_discount'
            for (let id of this.ProductArrayID) {
              this.delete(id, type)
            }
            resolve()
          } else if (value === 'Price') {
            let type = 'price_discount'
            for (let id of this.PriceArrayID) {
              this.delete(id, type)
            }
            resolve()
          }
        })
      },
    })
    if (discountType) {
      sweetalert2Success(`Delete a ${discountType} Discount`)
      this.loadList()
    }
  }

  async delete(id: number, type: string) {
    await this.adminService.deleteDiscount({
      value: type,
      deleteId: id,
    })
    Swal.fire({
      title: 'Finish',
      text: 'Product Deleted',
      icon: 'success',
      heightAuto: false,
      didClose: () => {
        this.loadList()
      },
    })
    this.loadList()
  }

  async confirm(): Promise<void> {
    if (this.title == '') {
      sweetalert2error('Missing title')
      return
    }

    if (this.selectedDiscount == 'product_discount' && this.quantity == '') {
      sweetalert2error('Missing Quantity')
      return
    }
    if (
      this.selectedDiscount == 'product_discount' &&
      this.discount_amount == ''
    ) {
      sweetalert2error('Missing Discount Amount')
      return
    }
    if (this.selectedDiscount == 'price_discount' && this.total_price == '') {
      sweetalert2error('Missing Total Price')
      return
    }
    if (this.selectedDiscount == 'price_discount' && this.discount_rate == '') {
      sweetalert2error('Missing Discount Rate')
      return
    }
    if (this.selectedStartDate == '') {
      sweetalert2error('Missing Start Date')
      return
    }
    if (this.selectedEndDate == '') {
      sweetalert2error('Missing End Date')
      return
    }
    if (this.selectedDiscount == 'product_discount') {
      let json = await this.adminService.addProductDiscount({
        selectedDiscount: this.selectedDiscount,
        title: this.title,
        product_id: this.selectedProductID,
        brand_id: this.selectedBrandID,
        categories_id: this.selectedCategoryID,
        quantity: this.quantity,
        discount_amount: this.discount_amount,
        start_date: new Date(this.selectedStartDate).toLocaleDateString(),
        end_date: new Date(this.selectedEndDate).toLocaleDateString(),
      })
      sweetalert2Success(json.result)
    } else if (this.selectedDiscount == 'price_discount') {
      let json = await this.adminService.addPriceDiscount({
        selectedDiscount: this.selectedDiscount,
        title: this.title,
        total_price: this.total_price,
        discount_rate: this.discount_rate,
        start_date: new Date(this.selectedStartDate).toLocaleDateString(),
        end_date: new Date(this.selectedEndDate).toLocaleDateString(),
      })
      sweetalert2Success(json.result)
    }

    this.clear()
    this.loadList()
    this.dismiss(this.addModal)
  }
}
