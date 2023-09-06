import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminCategoriesListPageRoutingModule } from './admin-categories-list-routing.module';

import { AdminCategoriesListPage } from './admin-categories-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminCategoriesListPageRoutingModule
  ],
  declarations: [AdminCategoriesListPage]
})
export class AdminCategoriesListPageModule {}
