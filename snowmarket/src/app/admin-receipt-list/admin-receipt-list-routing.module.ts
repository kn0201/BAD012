import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminReceiptListPage } from './admin-receipt-list.page';

const routes: Routes = [
  {
    path: '',
    component: AdminReceiptListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminReceiptListPageRoutingModule {}
