import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPagePageRoutingModule } from './admin-page-routing.module';
import { TableModule } from 'ngx-easy-table';
import { AdminPagePage } from './admin-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPagePageRoutingModule,
    TableModule,
  ],
  declarations: [AdminPagePage],
})
export class AdminPagePageModule {}
