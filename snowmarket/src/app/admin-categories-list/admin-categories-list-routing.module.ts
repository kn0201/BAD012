import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminCategoriesListPage } from './admin-categories-list.page';

const routes: Routes = [
  {
    path: '',
    component: AdminCategoriesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminCategoriesListPageRoutingModule {}
