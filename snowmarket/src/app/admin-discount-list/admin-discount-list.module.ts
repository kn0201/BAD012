import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminDiscountListPageRoutingModule } from './admin-discount-list-routing.module';

import { AdminDiscountListPage } from './admin-discount-list.page';
import { TableModule } from 'ngx-easy-table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminDiscountListPageRoutingModule,
    TableModule,
  ],
  declarations: [AdminDiscountListPage],
})
export class AdminDiscountListPageModule {}
