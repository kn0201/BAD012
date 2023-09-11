import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Columns, Config, DefaultConfig, APIDefinition } from 'ngx-easy-table';
// import { brandList } from 'src/assets/brand';
import { Brand, Category } from 'src/assets/type';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { DOMAIN } from 'utils/domain';
import Swal from 'sweetalert2';
import sweetalert2error from 'utils/sweetalert2error';

@Component({
  selector: 'app-admin-categories-list',
  templateUrl: './admin-categories-list.page.html',
  styleUrls: ['./admin-categories-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCategoriesListPage implements OnInit {
  constructor() {}

  @ViewChild('categoryHeaderActionTemplate', { static: true })
  categoryHeaderActionTemplate!: TemplateRef<any>;

  @ViewChild('brandHeaderActionTemplate', { static: true })
  brandHeaderActionTemplate!: TemplateRef<any>;

  @ViewChild('table')
  table!: APIDefinition;

  @ViewChild(IonModal) modal!: IonModal;

  public brandColumns: Columns[] = [];
  public categoriesColumns: Columns[] = [];

  brandList!: Config;
  categoriesList!: Config;

  brandData: Brand[] = [];
  brandDataCopy: Brand[] = [];

  categoryData: Category[] = [];
  categoryDataCopy: Category[] = [];

  selectedBrand = '';
  selectedCategory = '';

  message = '';
  name: string | null = null;

  selectValue = null;

  canDismiss = true;

  ngOnInit() {
    this.loadList();

    this.brandColumns = [
      { key: 'id', title: 'Brand ID' },
      {
        key: 'name',
        title: 'Name',
        headerActionTemplate: this.brandHeaderActionTemplate,
      },
    ];
    this.categoriesColumns = [
      { key: 'id', title: 'Category ID' },
      {
        key: 'name',
        title: 'Name',
        headerActionTemplate: this.categoryHeaderActionTemplate,
      },
    ];
    this.brandList = { ...DefaultConfig };
    this.brandList.checkboxes = true;
    this.brandList.fixedColumnWidth = true;
    this.brandList.orderEnabled = true;
    this.brandList.rows = 4;
    this.categoriesList = { ...DefaultConfig };
    this.categoriesList.checkboxes = true;
    this.categoriesList.fixedColumnWidth = true;
    this.categoriesList.orderEnabled = true;
    this.categoriesList.threeWaySort = true;
    this.categoriesList.rows = 4;
  }

  filter(field: string, event: Event | string): void {
    const value =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;
    if (field === 'brand_name') {
      this.selectedBrand = value;
      this.brandData = [...this.brandDataCopy].filter(({ name }) => {
        return name
          .toLocaleLowerCase()
          .includes(this.selectedBrand.toLocaleLowerCase());
      });
    }
    if (field === 'categories_name') {
      this.selectedCategory = value;
      this.categoryData = [...this.categoryDataCopy].filter(({ name }) => {
        return name
          .toLocaleLowerCase()
          .includes(this.selectedCategory.toLocaleLowerCase());
      });
    }
  }

  cancel() {
    this.modal.dismiss();
  }

  confirm() {
    if (!this.selectValue) {
      sweetalert2error('Missing Brand/Category');
      return;
    } else if (!this.name) {
      sweetalert2error('Missing Name');
      return;
    } else if (this.selectValue && this.name != '') {
      this.canDismiss = true;
      this.addRow(this.selectValue);
    }
  }

  handleChange(event: any) {
    this.selectValue = event.target.value;
  }

  @Output() async addRow(selectValue: string): Promise<void> {
    let msgName = this.name;
    let submitObject = { msgName, selectValue };
    let res = await fetch(`${DOMAIN}/admin/b&c-list/add`, {
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

    this.name = '';
    this.modal.dismiss();
  }

  async loadList(): Promise<any> {
    let res = await fetch(`${DOMAIN}/admin/b&c-list`, {
      headers: {
        Accept: 'application/json',
      },
    });
    let json = await res.json();
    if (json.error) {
      sweetalert2error(json.error);
      return;
    }
    this.brandData = json.brandList;
    this.brandDataCopy = json.brandList;
    this.categoryData = json.categoriesList;
    this.categoryDataCopy = json.categoriesList;
  }
}
