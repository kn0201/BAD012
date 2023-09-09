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
import { brand, category } from 'src/assets/interface';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { DOMAIN } from 'utils/domain';
import Swal from 'sweetalert2';

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

  public brandColumns: Columns[] = [
    { key: 'id', title: 'Brand ID' },
    {
      key: 'brand_name',
      title: 'Name',
      headerActionTemplate: this.brandHeaderActionTemplate,
    },
  ];
  public categoriesColumns: Columns[] = [
    { key: 'id', title: 'Category ID' },
    {
      key: 'categories_name',
      title: 'Name',
      headerActionTemplate: this.categoryHeaderActionTemplate,
    },
  ];

  brandList!: Config;
  categoriesList!: Config;

  brandData: brand[] = [];
  brandDataCopy: brand[] = [];

  categoryData: category[] = [];
  categoryDataCopy: category[] = [];

  selectedBrand = '';
  selectedCategory = '';

  message = '';
  name!: string;

  selectValue = '';

  canDismiss = true;

  ngOnInit() {
    this.loadList();

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
      this.brandData = [...this.brandDataCopy].filter(({ brand_name }) => {
        return brand_name
          .toLocaleLowerCase()
          .includes(this.selectedBrand.toLocaleLowerCase());
      });
    }
    if (field === 'categories_name') {
      this.selectedCategory = value;
      this.categoryData = [...this.categoryDataCopy].filter(
        ({ categories_name }) => {
          return categories_name
            .toLocaleLowerCase()
            .includes(this.selectedCategory.toLocaleLowerCase());
        }
      );
    }
  }

  cancel() {
    this.modal.dismiss();
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
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
      Swal.fire('Failed ', json.error, 'error');
      return;
    }
    this.brandData = json.brandList;
    this.brandDataCopy = json.brandList;
    this.categoryData = json.categoriesList;
    this.categoryDataCopy = json.categoriesList;
  }
}
