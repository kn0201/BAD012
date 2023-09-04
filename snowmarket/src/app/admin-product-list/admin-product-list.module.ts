import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminProductListPageRoutingModule } from './admin-product-list-routing.module';

import { AdminProductListPage } from './admin-product-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminProductListPageRoutingModule
  ],
  declarations: [AdminProductListPage]
})
export class AdminProductListPageModule {}
