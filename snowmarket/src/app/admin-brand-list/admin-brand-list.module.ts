import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminBrandListPageRoutingModule } from './admin-brand-list-routing.module';

import { AdminBrandListPage } from './admin-brand-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminBrandListPageRoutingModule
  ],
  declarations: [AdminBrandListPage]
})
export class AdminBrandListPageModule {}
