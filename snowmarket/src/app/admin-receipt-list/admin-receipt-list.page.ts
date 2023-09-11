import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { receipt } from 'src/assets/interface';

import Swal from 'sweetalert2';
import { DOMAIN } from 'utils/domain';
@Component({
  selector: 'app-admin-receipt-list',
  templateUrl: './admin-receipt-list.page.html',
  styleUrls: ['./admin-receipt-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReceiptListPage implements OnInit {
  constructor() {}

  public receiptListColumns: Columns[] = [
    { key: 'id', title: ' Receipt Number' },
    { key: 'total_price', title: 'Total' },
    { key: 'date', title: 'Receipt date' },
  ];
  receiptListData: receipt[] = [];
  receiptList!: Config;

  ngOnInit() {
    this.loadList();
    this.receiptList = { ...DefaultConfig };
    this.receiptList.showDetailsArrow = true;
    this.receiptList.detailsTemplate = true;
  }

  async loadList(): Promise<any> {
    let res = await fetch(`${DOMAIN}/admin/receipt-list`, {
      headers: {
        Accept: 'application/json',
      },
    });
    let json = await res.json();
    if (json.error) {
      Swal.fire('Failed ', json.error, 'error');
      return;
    }
    console.log(json.receiptList);

    this.receiptListData = json.receiptList;
    // this.receiptListDataCopy = json.brandList;
  }
}
