import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { receipt } from 'src/assets/interface';
import { receiptList } from 'src/assets/receipt';
import { DOMAIN } from 'utils/domain';
@Component({
  selector: 'app-admin-receipt-list',
  templateUrl: './admin-receipt-list.page.html',
  styleUrls: ['./admin-receipt-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReceiptListPage implements OnInit {
  constructor() {}

  public receiptListColumns: Columns[] = [];
  receiptListData: receipt[] = [];
  receiptList!: Config;

  ngOnInit() {
    this.receiptListColumns = [
      { key: 'id', title: ' Receipt Number' },
      { key: 'total_price', title: 'Total' },
      { key: 'date', title: 'Receipt date' },
    ];
    this.receiptList = { ...DefaultConfig };
    this.receiptList.showDetailsArrow = true;
    this.receiptList.detailsTemplate = true;
    this.receiptListData = receiptList;
  }
}
