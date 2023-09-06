import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Company, data } from '../../assets/data';
import { APIDefinition, Config, Columns, DefaultConfig } from 'ngx-easy-table';

@Component({
  selector: 'app-admin-member-list',
  templateUrl: './admin-member-list.page.html',
  styleUrls: ['./admin-member-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMemberListPage implements OnInit {
  // public memberList = [
  //   [
  //     {
  //       id: '1',
  //       username: 'johnsmith',
  //       email: 'johnsmith@example.com',
  //       birthday: '1990-01-10',
  //       points: 500,
  //     },
  //     {
  //       id: '2',
  //       username: 'sarahjones',
  //       email: 'sjones@email.com',
  //       birthday: '1985-03-15',
  //       points: 750,
  //     },
  //     {
  //       id: '3',
  //       username: 'mikedoe',
  //       email: 'mikedoe12@gmail.com',
  //       birthday: '1992-11-22',
  //       points: 250,
  //     },
  //     {
  //       id: '4',
  //       username: 'emilybrown',
  //       email: 'emily.brown@example.com',
  //       birthday: '1994-07-05',
  //       points: 350,
  //     },
  //     {
  //       id: '5',
  //       username: 'davidwilson',
  //       email: 'dwilson@mail.com',
  //       birthday: '1988-04-30',
  //       points: 900,
  //     },
  //     {
  //       id: '6',
  //       username: 'lisasmith',
  //       email: 'lisa.smith@example.com',
  //       birthday: '1991-12-12',
  //       points: 600,
  //     },
  //     {
  //       id: '7',
  //       username: 'johndoe',
  //       email: 'johndoe@hotmail.com',
  //       birthday: '1987-02-18',
  //       points: 400,
  //     },
  //     {
  //       id: '8',
  //       username: 'amandajackson',
  //       email: 'ajackson@email.com',
  //       birthday: '1995-09-08',
  //       points: 150,
  //     },
  //     {
  //       id: '9',
  //       username: 'robertgreen',
  //       email: 'robert.green@example.com',
  //       birthday: '1993-05-25',
  //       points: 800,
  //     },
  //     {
  //       id: '10',
  //       username: 'michaeltaylor',
  //       email: 'mtaylor@gmail.com',
  //       birthday: '1989-10-03',
  //       points: 700,
  //     },
  //   ],
  // ];
  // constructor() {}
  @ViewChild('levelHeaderActionTemplate', { static: true })
  levelHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('companyHeaderActionTemplate', { static: true })
  companyHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('table')
  table!: APIDefinition;

  public columns: Columns[] = [];
  data: Company[] = [];
  dataCopy: Company[] = [];
  configuration!: Config;
  selectedLevels = new Set<string>(['High', 'Medium', 'Low']);
  selectedCompany = '';

  ngOnInit(): void {
    this.configuration = { ...DefaultConfig };
    this.configuration.checkboxes = true;
    this.configuration.fixedColumnWidth = true;
    this.columns = [
      { key: 'name', title: 'Name' },
      {
        key: 'level',
        title: 'Level',
        headerActionTemplate: this.levelHeaderActionTemplate,
      },
      {
        key: 'company',
        title: 'Company',
        headerActionTemplate: this.companyHeaderActionTemplate,
      },
      { key: 'phone', title: 'Phone' },
      { key: 'address.street', title: 'Street' },
    ];
    this.data = data;
    this.dataCopy = data;
  }

  filter(field: string, event: Event | string): void {
    const value =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;
    if (field === 'level') {
      this.selectedLevels.has(value)
        ? this.selectedLevels.delete(value)
        : this.selectedLevels.add(value);
    }
    if (field === 'company') {
      this.selectedCompany = value;
    }
    this.data = [...this.dataCopy].filter(({ level, company }) => {
      return (
        this.selectedLevels.has(level!) &&
        company
          .toLocaleLowerCase()
          .includes(this.selectedCompany.toLocaleLowerCase())
      );
    });
  }
}
