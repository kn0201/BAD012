import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminReceiptListPageRoutingModule } from './admin-receipt-list-routing.module';

import { AdminReceiptListPage } from './admin-receipt-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminReceiptListPageRoutingModule
  ],
  declarations: [AdminReceiptListPage]
})
export class AdminReceiptListPageModule {}
