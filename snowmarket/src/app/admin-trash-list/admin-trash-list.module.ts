import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminTrashListPageRoutingModule } from './admin-trash-list-routing.module';

import { AdminTrashListPage } from './admin-trash-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminTrashListPageRoutingModule
  ],
  declarations: [AdminTrashListPage]
})
export class AdminTrashListPageModule {}
