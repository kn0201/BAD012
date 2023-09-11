import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { APIDefinition, Config, Columns, DefaultConfig } from 'ngx-easy-table';
import { users } from 'src/assets/type';
import { DOMAIN } from 'utils/domain';
import Swal from 'sweetalert2';
import sweetalert2error from 'utils/sweetalert2error';

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
    this.loadList();

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
    this.configuration = { ...DefaultConfig };
    this.configuration.checkboxes = true;
    this.configuration.fixedColumnWidth = true;
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
  async loadList(): Promise<any> {
    let res = await fetch(`${DOMAIN}/admin/member-list`, {
      headers: {
        Accept: 'application/json',
      },
    });
    let json = await res.json();
    if (json.error) {
      sweetalert2error(json.error);
      return;
    }
    console.log(json.memberList);

    this.data = json.memberList;
    this.dataCopy = json.memberList;
  }
}
