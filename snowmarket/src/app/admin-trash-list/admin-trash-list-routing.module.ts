import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminTrashListPage } from './admin-trash-list.page';

const routes: Routes = [
  {
    path: '',
    component: AdminTrashListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminTrashListPageRoutingModule {}
