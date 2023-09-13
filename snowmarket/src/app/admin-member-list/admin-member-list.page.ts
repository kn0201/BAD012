import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core'

import { APIDefinition, Config, Columns, DefaultConfig } from 'ngx-easy-table'
import { Users } from 'src/assets/type'
import { DOMAIN } from 'utils/domain'

import { sweetalert2error } from 'utils/sweetalert2'
import { AdminService } from '../admin.service'

@Component({
  selector: 'app-admin-member-list',
  templateUrl: './admin-member-list.page.html',
  styleUrls: ['./admin-member-list.page.scss'],
})
export class AdminMemberListPage implements OnInit {
  constructor(private adminService: AdminService) {}

  @ViewChild('usernameHeaderActionTemplate', { static: true })
  usernameHeaderActionTemplate!: TemplateRef<any>
  @ViewChild('table')
  table!: APIDefinition

  public columns: Columns[] = []
  data: Users[] = []
  dataCopy: Users[] = []
  configuration!: Config
  selectedUser = ''

  ngOnInit(): void {
    this.loadList()

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
    ]
    this.configuration = { ...DefaultConfig }
    this.configuration.checkboxes = true
    this.configuration.fixedColumnWidth = true
  }
  filter(field: string, event: Event | string): void {
    const value =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value
    if (field === 'username') {
      this.selectedUser = value
    }
    this.data = [...this.dataCopy].filter(({ username }) => {
      return username
        .toLocaleLowerCase()
        .includes(this.selectedUser.toLocaleLowerCase())
    })
  }
  async loadList(): Promise<any> {
    let json = await this.adminService.getMemberList()

    this.data = json.memberList
    this.dataCopy = json.memberList
  }
}
