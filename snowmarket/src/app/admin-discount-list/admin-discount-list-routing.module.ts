import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminDiscountListPage } from './admin-discount-list.page';

const routes: Routes = [
  {
    path: '',
    component: AdminDiscountListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDiscountListPageRoutingModule {}
