import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { AdminTrashListPageRoutingModule } from './admin-trash-list-routing.module'

import { AdminTrashListPage } from './admin-trash-list.page'
import { TableModule } from 'ngx-easy-table'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminTrashListPageRoutingModule,
    TableModule,
  ],
  declarations: [AdminTrashListPage],
})
export class AdminTrashListPageModule {}
