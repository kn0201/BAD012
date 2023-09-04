import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminMemberListPageRoutingModule } from './admin-member-list-routing.module';

import { AdminMemberListPage } from './admin-member-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminMemberListPageRoutingModule
  ],
  declarations: [AdminMemberListPage]
})
export class AdminMemberListPageModule {}
