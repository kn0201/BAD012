import { Component, OnInit, ViewChild } from '@angular/core'
import { AdminService } from '../admin.service'
import { ChartData, ChartEvent, ChartType } from 'chart.js'
import { BaseChartDirective } from 'ng2-charts'

@Component({
  selector: 'app-admin-chart-list',
  templateUrl: './admin-chart-list.page.html',
  styleUrls: ['./admin-chart-list.page.scss'],
})
export class AdminChartListPage implements OnInit {
  constructor(private adminService: AdminService) {}

  @ViewChild('baseChart') chart?: BaseChartDirective

  // Doughnut
  public doughnutChartLabels: string[] = []

  doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: [350, 450, 100] }],
  }
  doughnutChartType: ChartType = 'doughnut'

  ngOnInit() {
    this.loadList()
  }

  async loadList() {
    let json = await this.adminService.getChartList()
    let receiptList = json.receiptList
    let receiptItemList = json.receiptItemList
    console.log('list')

    console.log(json.receiptList)
    console.log('item')

    console.log(json.receiptItemList)
    for (let receipt of receiptList) {
      if (!this.doughnutChartLabels.includes(receipt.pos_name)) {
        this.doughnutChartLabels.push(receipt.pos_name)
      }
    }
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent
    active: object[]
  }): void {
    console.log(event, active)
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent
    active: object[]
  }): void {
    console.log(event, active)
  }
}
