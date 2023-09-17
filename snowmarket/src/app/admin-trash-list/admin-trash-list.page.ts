import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { AdminService } from '../admin.service'
import { APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table'
import {
  DeletedPriceDiscount,
  DeletedProduct,
  DeletedProductDiscount,
} from 'src/assets/type'
import Swal from 'sweetalert2'
import { sweetalert2Success } from 'utils/sweetalert2'

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

  public deletedProductDiscountColumns: Columns[] = []
  deletedProductDiscountConfig!: Config
  deletedProductDiscountData: DeletedProductDiscount[] = []
  deletedProductDiscountDataCopy: DeletedProductDiscount[] = []

  public deletedPriceDiscountColumns: Columns[] = []
  deletedPriceDiscountConfig!: Config
  deletedPriceDiscountData: DeletedPriceDiscount[] = []
  deletedPriceDiscountDataCopy: DeletedPriceDiscount[] = []

  selectedChecked = new Set()

  arrayID: Array<number> = []

  ngOnInit() {
    this.loadList()

    this.columns = [
      { key: 'id', title: 'Product ID' },

      {
        key: 'name',
        title: 'Product Name',
        headerActionTemplate: this.productHeaderActionTemplate,
      },
    ]
    this.configuration = { ...DefaultConfig }
    this.configuration.checkboxes = true
    this.configuration.orderEnabled = true
    this.configuration.fixedColumnWidth = true
    this.configuration.rows = 4

    this.deletedProductDiscountColumns = [
      { key: 'id', title: 'Discount ID' },

      {
        key: 'title',
        title: 'Title',
        // headerActionTemplate: this.productHeaderActionTemplate,
      },
    ]
    this.deletedProductDiscountConfig = { ...DefaultConfig }
    this.deletedProductDiscountConfig.orderEnabled = true
    this.deletedProductDiscountConfig.fixedColumnWidth = true
    this.deletedProductDiscountConfig.rows = 4

    this.deletedPriceDiscountColumns = [
      { key: 'id', title: 'Discount ID' },

      {
        key: 'title',
        title: 'Title',
        // headerActionTemplate: this.productHeaderActionTemplate,
      },
    ]
    this.deletedPriceDiscountConfig = { ...DefaultConfig }
    this.deletedPriceDiscountConfig.orderEnabled = true
    this.deletedPriceDiscountConfig.fixedColumnWidth = true
    this.deletedPriceDiscountConfig.rows = 4
  }

  filter(field: string | number, event: Event | string): void {
    const value =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value
    if (field === 'name') {
      this.selectedProduct = value
    }
  }

  eventEmitted($event: { event: string; value: any }): void {
    switch ($event.event) {
      case 'onCheckboxSelect':
        if (this.selectedChecked.has($event.value.rowId)) {
          this.selectedChecked.delete($event.value.rowId)
          let index = this.arrayID.indexOf($event.value.row.id)
          if (index !== -1) {
            this.arrayID.splice(index, 1)
          }
        } else {
          this.selectedChecked.add($event.value.rowId)
          this.arrayID.push($event.value.row.id)
        }
        break
      case 'onSelectAll':
        this.data.forEach((_, key) => {
          if (this.selectedChecked.has(key)) {
            this.selectedChecked.delete(key)
            let index = this.arrayID.indexOf(_.id)
            if (index !== -1) {
              this.arrayID.splice(index, 1)
            }
          } else {
            this.selectedChecked.add(key)
            this.arrayID.push(_.id)
          }
        })
        break
    }
  }

  deleteConfirm() {
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
        for (let id of this.arrayID) {
          this.delete(id)
        }
      }
    })
  }

  async delete(id: number) {
    await this.adminService.reDeleteProduct({
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
  }

  async loadList(): Promise<any> {
    let json = await this.adminService.getTrashList()
    this.data = json.deletedProductList
    this.dataCopy = json.deletedProductList

    this.deletedProductDiscountData = json.deletedProductDiscountList
    this.deletedProductDiscountDataCopy = json.deletedProductDiscountList

    this.deletedPriceDiscountData = json.deletedPriceDiscountList
    this.deletedPriceDiscountDataCopy = json.deletedPriceDiscountList
  }
}
