import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core'
import { AdminService } from '../admin.service'
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js'
import { BaseChartDirective } from 'ng2-charts'
import { BarChartData } from 'src/assets/type'

@Component({
  selector: 'app-admin-chart-list',
  templateUrl: './admin-chart-list.page.html',
  styleUrls: ['./admin-chart-list.page.scss'],
})
export class AdminChartListPage implements OnInit {
  constructor(private adminService: AdminService) {}

  @ViewChildren(BaseChartDirective) charts?: BaseChartDirective[]

  // @ViewChild('BaseChartDirective') revenueChart?: BaseChartDirective | undefined

  // POS Doughnut Chart
  public posChartLabels: string[] = []
  public posBarChartData: ChartData<'bar'> = {
    labels: ['POS'],
    datasets: [],
  }

  pos_array: string[] = []
  posDataArray: number[] = []
  posBarChartObjectArray: BarChartData[] = []
  //

  //Brand Bar Chart
  public brandChartLabels: string[] = []

  public brandBarChartData: ChartData<'bar'> = {
    labels: ['Brand'],
    datasets: [],
  }

  brand_array: string[] = []
  brandDataArray: number[] = []
  brandBarChartObjectArray: BarChartData[] = []
  //

  //Product Chart
  public productChartLabels: string[] = []

  public ProductBarChartData: ChartData<'bar'> = {
    labels: ['Product'],
    datasets: [],
  }

  product_array: string[] = []
  productDataArray: number[] = []
  productBarChartObjectArray: BarChartData[] = []
  //

  public lineChartType: ChartType = 'line'

  //Bar Chart Default Setting
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,

    elements: {
      line: {
        tension: 0.4,
      },
    },

    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: { display: true },
    },
  }
  public barChartType: ChartType = 'bar'

  //
  public revenueChartData: ChartData<'bar'> = {
    labels: ['Revenue'],
    datasets: [],
  }

  async ngOnInit() {
    await this.loadList()
    for (let chart of this.charts!) {
      chart.update()
    }
  }

  async loadList() {
    let revenueList = await this.adminService.getWeeklyRevenue()
    // let weeklyRevenue = revenueList.weeklyRevenue
    // console.log(weeklyRevenue)

    let weeklyRevenue = [
      { date: '1020', sum: 1345 },
      { date: '1021', sum: 3824.21 },
      { date: '1022', sum: 4422.3 },
      { date: '1023', sum: 2615.89 },
      { date: '1024', sum: 3010 },
      { date: '1025', sum: 7462.65 },
      { date: '1026', sum: 5555.24 },
      { date: '1027', sum: 4812.2 },
    ]

    let json = await this.adminService.getChartList()
    let receiptList = json.receiptList
    let receiptItemList = json.receiptItemList

    let receiptItemBrandList = json.receiptItemBrandList

    //Revenue Chart
    let date: string[] = []
    let sum: number[] = []

    for (let daily of weeklyRevenue) {
      daily.date = daily.date.replaceAll('-', '').slice(4)
      date.push(daily.date)
      if (daily.sum == null) {
        sum.push(0)
      } else {
        sum.push(daily.sum)
      }
    }

    this.revenueChartData.labels = date.reverse()
    this.revenueChartData.datasets = [{ data: sum.reverse(), label: 'Revenue' }]
    //

    //Pos Chart
    for (let receipt of receiptList) {
      this.pos_array.push(receipt.pos_name)

      if (!this.posChartLabels.includes(receipt.pos_name)) {
        this.posChartLabels.push(receipt.pos_name)
        this.posDataArray.push(1)
      } else {
        this.posDataArray[this.posChartLabels.indexOf(receipt.pos_name)]++
      }
    }

    for (let i = 0; i < this.posDataArray.length; i++) {
      let pos = {} as BarChartData
      pos.data = [this.posDataArray[i]]
      pos.label = this.posChartLabels[i]

      this.posBarChartObjectArray.push(pos)
    }
    this.posBarChartObjectArray = this.posBarChartObjectArray.sort(function (
      a,
      b
    ) {
      return a.data[0] > b.data[0] ? -1 : 1
    })
    this.posBarChartData.datasets = this.posBarChartObjectArray
    //

    //Product Chart
    for (let product of receiptItemList) {
      this.product_array.push(product.name)

      if (!this.productChartLabels.includes(product.name)) {
        this.productChartLabels.push(product.name)
        this.productDataArray.push(1)
      } else {
        this.productDataArray[this.productChartLabels.indexOf(product.name)]++
      }
    }

    for (let i = 0; i < this.productDataArray.length; i++) {
      let product = {} as BarChartData
      product.data = [this.productDataArray[i]]
      product.label = this.productChartLabels[i]

      this.productBarChartObjectArray.push(product)
    }
    this.productBarChartObjectArray = this.productBarChartObjectArray.sort(
      function (a, b) {
        return a.data[0] > b.data[0] ? -1 : 1
      }
    )
    this.ProductBarChartData.datasets = this.productBarChartObjectArray.slice(
      0,
      5
    )

    //

    //Brand Chart
    for (let brand of receiptItemBrandList) {
      this.brand_array.push(brand.name)

      if (!this.brandChartLabels.includes(brand.name)) {
        this.brandChartLabels.push(brand.name)
        this.brandDataArray.push(1)
      } else {
        this.brandDataArray[this.brandChartLabels.indexOf(brand.name)]++
      }
    }

    for (let i = 0; i < this.brandDataArray.length; i++) {
      let brand = {} as BarChartData
      brand.data = [this.brandDataArray[i]]
      brand.label = this.brandChartLabels[i]

      this.brandBarChartObjectArray.push(brand)
    }
    this.brandBarChartObjectArray = this.brandBarChartObjectArray.sort(
      function (a, b) {
        return a.data[0] > b.data[0] ? -1 : 1
      }
    )

    this.brandBarChartData.datasets = this.brandBarChartObjectArray.slice(0, 5)
    //
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
