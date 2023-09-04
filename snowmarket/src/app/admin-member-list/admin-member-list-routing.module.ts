import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminMemberListPage } from './admin-member-list.page';

const routes: Routes = [
  {
    path: '',
    component: AdminMemberListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminMemberListPageRoutingModule {}
