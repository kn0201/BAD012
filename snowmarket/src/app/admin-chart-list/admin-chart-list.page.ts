import { Component, OnInit, ViewChild } from '@angular/core'
import { AdminService } from '../admin.service'
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js'
import { BaseChartDirective } from 'ng2-charts'
import { number, string } from 'cast.ts'
import { CheckData, Dish } from 'src/assets/type'

@Component({
  selector: 'app-admin-chart-list',
  templateUrl: './admin-chart-list.page.html',
  styleUrls: ['./admin-chart-list.page.scss'],
})
export class AdminChartListPage implements OnInit {
  constructor(private adminService: AdminService) {}

  @ViewChild(BaseChartDirective) BaseChart?: BaseChartDirective

  @ViewChild('BaseChartDirective') revenueChart?: BaseChartDirective | undefined

  // Doughnut
  public doughnutChartLabels: string[] = []
  doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: [] }],
  }
  doughnutChartType: ChartType = 'doughnut'

  public productChartLabels: string[] = []
  public brandChartLabels: string[] = []

  productChartData: ChartData<'doughnut'> = {
    labels: this.productChartLabels,
    datasets: [{ data: [] }],
  }
  productChartType: ChartType = 'doughnut'

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
  }

  public barChartType: ChartType = 'bar'

  public barChartData: ChartData<'bar'> = {
    labels: ['Revenue'],
    datasets: [],
  }

  public brandChartData: ChartData<'doughnut'> = {
    labels: this.brandChartLabels,
    datasets: [{ data: [] }],
  }

  public brandBarChartData: ChartData<'bar'> = {
    labels: [this.brandChartLabels],
    datasets: [],
  }

  pos_check: { [key: string]: number } = {}

  pos_array: string[] = []
  posDataArray: number[] = []

  product_array: string[] = []
  productDataArray: number[] = []

  brand_array: string[] = []
  brandDataArray: number[] = []

  ngOnInit() {
    this.loadList()
  }

  async loadList() {
    let json = await this.adminService.getChartList()
    let receiptList = json.receiptList
    let receiptItemList = json.receiptItemList
    let currentDateTotal = json.currentDateTotal
    let previousTotal = json.previousTotal
    let receiptItemBrandList = json.receiptItemBrandList

    let previousRevenue = previousTotal[0].sum
    let currentRevenue = currentDateTotal[0].sum

    this.barChartData.datasets = [
      { data: [previousRevenue], label: 'Previous Revenue' },
      { data: [currentRevenue], label: 'Today Revenue' },
    ]

    for (let receipt of receiptList) {
      this.pos_array.push(receipt.pos_name)

      if (!this.doughnutChartLabels.includes(receipt.pos_name)) {
        this.doughnutChartLabels.push(receipt.pos_name)
        this.posDataArray.push(1)
      } else {
        this.posDataArray[this.doughnutChartLabels.indexOf(receipt.pos_name)]++
      }
    }
    this.doughnutChartData.datasets = [{ data: this.posDataArray }]

    for (let product of receiptItemList) {
      this.product_array.push(product.name)

      if (!this.productChartLabels.includes(product.name)) {
        this.productChartLabels.push(product.name)
        this.productDataArray.push(1)
      } else {
        this.productDataArray[this.productChartLabels.indexOf(product.name)]++
      }
    }
    this.productChartData.datasets = [{ data: this.productDataArray }]

    for (let brand of receiptItemBrandList) {
      this.brand_array.push(brand.name)

      if (!this.brandChartLabels.includes(brand.name)) {
        this.brandChartLabels.push(brand.name)
        this.brandDataArray.push(1)
      } else {
        this.brandDataArray[this.brandChartLabels.indexOf(brand.name)]++
      }
    }

    for (let label of this.brandChartLabels) {
      console.log(label)

      for (let value of this.brandDataArray) {
        console.log(value)

        let brand = {} as Dish

        brand.data = [value]
        brand.label = label
        this.brandBarChartData.datasets.push(brand)
      }
    }

    this.brandChartData.datasets = [{ data: this.brandDataArray }]
  }

  getValue(array: string[]) {
    for (const pos of array) {
      console.log(pos)

      if (this.pos_check[pos] == null) {
        this.pos_check[pos] = 0
      }
      this.pos_check[pos] += 1
    }
    console.log(this.pos_check)
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
