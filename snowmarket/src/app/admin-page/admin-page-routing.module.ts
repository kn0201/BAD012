import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPagePage } from './admin-page.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPagePage,
    // redirectTo: 'chart-list',
    // pathMatch: 'full',
    children: [
      {
        path: 'chart-list',
        loadChildren: () =>
          import('../admin-chart-list/admin-chart-list.module').then(
            (m) => m.AdminChartListPageModule
          ),
      },
      {
        path: 'product-list',
        loadChildren: () =>
          import('../admin-product-list/admin-product-list.module').then(
            (m) => m.AdminProductListPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPagePageRoutingModule {}
