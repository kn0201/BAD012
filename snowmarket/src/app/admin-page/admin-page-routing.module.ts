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
      {
        path: 'discount-list',
        loadChildren: () =>
          import('../admin-discount-list/admin-discount-list.module').then(
            (m) => m.AdminDiscountListPageModule
          ),
      },
      {
        path: 'member-list',
        loadChildren: () =>
          import('../admin-member-list/admin-member-list.module').then(
            (m) => m.AdminMemberListPageModule
          ),
      },
      {
        path: 'trash-list',
        loadChildren: () =>
          import('../admin-trash-list/admin-trash-list.module').then(
            (m) => m.AdminTrashListPageModule
          ),
      },
      {
        path: 'receipt-list',
        loadChildren: () =>
          import('../admin-receipt-list/admin-receipt-list.module').then(
            (m) => m.AdminReceiptListPageModule
          ),
      },
      {
        path: 'brand-list',
        loadChildren: () =>
          import('../admin-brand-list/admin-brand-list.module').then(
            (m) => m.AdminBrandListPageModule
          ),
      },
      {
        path: 'b&c-list',
        loadChildren: () =>
          import('../admin-categories-list/admin-categories-list.module').then(
            (m) => m.AdminCategoriesListPageModule
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
