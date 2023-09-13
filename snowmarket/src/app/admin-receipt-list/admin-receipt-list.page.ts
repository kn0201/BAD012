import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Columns, Config, DefaultConfig } from 'ngx-easy-table'
import { Receipt } from 'src/assets/type'

import { DOMAIN } from 'utils/domain'
import { sweetalert2error } from 'utils/sweetalert2'
import { AdminService } from '../admin.service'
@Component({
  selector: 'app-admin-receipt-list',
  templateUrl: './admin-receipt-list.page.html',
  styleUrls: ['./admin-receipt-list.page.scss'],
})
export class AdminReceiptListPage implements OnInit {
  constructor(private adminService: AdminService) {}

  public receiptListColumns: Columns[] = [
    { key: 'id', title: ' Receipt Number' },
    { key: 'total_price', title: 'Total' },
    { key: 'date', title: 'Receipt date' },
  ]
  receiptListData: Receipt[] = []
  receiptList!: Config

  ngOnInit() {
    this.loadList()
    this.receiptList = { ...DefaultConfig }
    this.receiptList.showDetailsArrow = true
    this.receiptList.detailsTemplate = true
  }

  async loadList(): Promise<any> {
    let json = await this.adminService.getReceiptList()

    this.receiptListData = json.receiptList
    // this.receiptListDataCopy = json.brandList;
  }
}
