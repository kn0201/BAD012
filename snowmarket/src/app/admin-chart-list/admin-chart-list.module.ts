import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { AdminChartListPageRoutingModule } from './admin-chart-list-routing.module'

import { AdminChartListPage } from './admin-chart-list.page'
import { NgChartsModule } from 'ng2-charts'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminChartListPageRoutingModule,
    NgChartsModule,
  ],
  declarations: [AdminChartListPage],
})
export class AdminChartListPageModule {}
