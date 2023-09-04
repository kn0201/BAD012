import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminChartListPageRoutingModule } from './admin-chart-list-routing.module';

import { AdminChartListPage } from './admin-chart-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminChartListPageRoutingModule
  ],
  declarations: [AdminChartListPage]
})
export class AdminChartListPageModule {}
