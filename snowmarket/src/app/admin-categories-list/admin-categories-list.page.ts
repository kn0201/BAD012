import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from '@angular/core'
import { Columns, Config, DefaultConfig, APIDefinition } from 'ngx-easy-table'

import { Brand, Category } from 'src/assets/type'
import { IonModal } from '@ionic/angular'

import { sweetalert2error } from 'utils/sweetalert2'
import { AdminService } from '../admin.service'

@Component({
  selector: 'app-admin-categories-list',
  templateUrl: './admin-categories-list.page.html',
  styleUrls: ['./admin-categories-list.page.scss'],
})
export class AdminCategoriesListPage implements OnInit {
  constructor(private adminService: AdminService) {}

  @ViewChild('categoryHeaderActionTemplate', { static: true })
  categoryHeaderActionTemplate!: TemplateRef<any>

  @ViewChild('brandHeaderActionTemplate', { static: true })
  brandHeaderActionTemplate!: TemplateRef<any>

  @ViewChild('table')
  table!: APIDefinition

  @ViewChild(IonModal) modal!: IonModal

  public brandColumns: Columns[] = []
  public categoriesColumns: Columns[] = []

  brandList: Config = {
    ...DefaultConfig,
    checkboxes: true,
    fixedColumnWidth: true,
    orderEnabled: true,
    rows: 4,
  }
  categoriesList!: Config

  brandData: Brand[] = []
  brandDataCopy: Brand[] = []

  categoryData: Category[] = []
  categoryDataCopy: Category[] = []

  selectedBrand = ''
  selectedCategory = ''

  message = ''
  name: string | null = null

  selectValue = null

  canDismiss = true

  async ngOnInit() {
    this.loadList()

    this.brandColumns = [
      { key: 'id', title: 'Brand ID' },
      {
        key: 'name',
        title: 'Name',
        headerActionTemplate: this.brandHeaderActionTemplate,
      },
    ]
    this.categoriesColumns = [
      { key: 'id', title: 'Category ID' },
      {
        key: 'name',
        title: 'Name',
        headerActionTemplate: this.categoryHeaderActionTemplate,
      },
    ]

    this.categoriesList = { ...DefaultConfig }
    this.categoriesList.checkboxes = true
    this.categoriesList.fixedColumnWidth = true
    this.categoriesList.orderEnabled = true
    this.categoriesList.threeWaySort = true
    this.categoriesList.rows = 4
  }

  filter(field: string, event: Event | string): void {
    const value =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value
    if (field === 'brand_name') {
      this.selectedBrand = value
      this.brandData = [...this.brandDataCopy].filter(({ name }) => {
        return name
          .toLocaleLowerCase()
          .includes(this.selectedBrand.toLocaleLowerCase())
      })
    }
    if (field === 'categories_name') {
      this.selectedCategory = value
      this.categoryData = [...this.categoryDataCopy].filter(({ name }) => {
        return name
          .toLocaleLowerCase()
          .includes(this.selectedCategory.toLocaleLowerCase())
      })
    }
  }

  cancel() {
    this.modal.dismiss()
  }

  confirm() {
    if (!this.selectValue) {
      sweetalert2error('Missing Brand/Category')
      return
    } else if (!this.name) {
      sweetalert2error('Missing Name')
      return
    } else if (this.selectValue && this.name != '') {
      this.canDismiss = true
      this.addRow(this.selectValue)
    }
  }

  handleChange(event: any) {
    this.selectValue = event.target.value
  }

  @Output() async addRow(selectValue: string): Promise<void> {
    if (!this.name) {
      return
    }

    let json = await this.adminService.addBrandCategory({
      msgName: this.name,
      selectValue,
    })

    let result = json.result
    console.log(' From Nestjs : ' + result)

    this.name = ''
    this.modal.dismiss()
  }

  async loadList(): Promise<any> {
    let json = await this.adminService.getBCList()
    this.brandData = json.brandList
    this.brandDataCopy = json.brandList
    this.categoryData = json.categoriesList
    this.categoryDataCopy = json.categoriesList
  }
}
