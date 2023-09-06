import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminBrandListPage } from './admin-brand-list.page';

const routes: Routes = [
  {
    path: '',
    component: AdminBrandListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminBrandListPageRoutingModule {}
