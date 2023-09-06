import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { memberList } from '../../assets/member';
import { APIDefinition, Config, Columns, DefaultConfig } from 'ngx-easy-table';
import { users } from 'src/assets/interface';

@Component({
  selector: 'app-admin-member-list',
  templateUrl: './admin-member-list.page.html',
  styleUrls: ['./admin-member-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMemberListPage implements OnInit {
  // constructor() {}
  @ViewChild('usernameHeaderActionTemplate', { static: true })
  usernameHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('table')
  table!: APIDefinition;

  public columns: Columns[] = [];
  data: users[] = [];
  dataCopy: users[] = [];
  configuration!: Config;
  selectedUser = '';

  ngOnInit(): void {
    this.configuration = { ...DefaultConfig };
    this.configuration.checkboxes = true;
    this.configuration.fixedColumnWidth = true;
    this.columns = [
      { key: 'id', title: 'Member ID' },
      {
        key: 'username',
        title: 'Username',
        headerActionTemplate: this.usernameHeaderActionTemplate,
      },
      {
        key: 'email',
        title: 'Email',
      },
      { key: 'birthday', title: 'Birthday' },
      { key: 'points', title: 'points' },
    ];
    this.data = memberList;
    this.dataCopy = memberList;
  }
  filter(field: string, event: Event | string): void {
    const value =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;
    if (field === 'username') {
      this.selectedUser = value;
    }
    this.data = [...this.dataCopy].filter(({ username }) => {
      return username
        .toLocaleLowerCase()
        .includes(this.selectedUser.toLocaleLowerCase());
    });
  }
}
