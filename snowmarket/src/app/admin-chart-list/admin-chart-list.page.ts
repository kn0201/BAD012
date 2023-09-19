import { Component, OnInit, ViewChild } from '@angular/core'
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

  @ViewChild(BaseChartDirective) BaseChart?: BaseChartDirective

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

  //Bar Chart Default Setting
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,

    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
  }
  public barChartType: ChartType = 'bar'

  public barChartData: ChartData<'bar'> = {
    labels: ['Revenue'],
    datasets: [],
  }
  //

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

    let previousRevenue = previousTotal.sum
    let currentRevenue = currentDateTotal.sum

    this.barChartData.datasets = [
      { data: [previousRevenue], label: 'Previous Revenue' },
      { data: [currentRevenue], label: 'Today Revenue' },
    ]
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
