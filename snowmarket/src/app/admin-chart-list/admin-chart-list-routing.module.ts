import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminChartListPage } from './admin-chart-list.page';

const routes: Routes = [
  {
    path: '',
    component: AdminChartListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminChartListPageRoutingModule {}
