import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { DemoPageRoutingModule } from './demo-routing.module'

import { DemoPage } from './demo.page'
import { SearchableSelectModalModule } from '../searchable-select-modal/searchable-select-modal.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemoPageRoutingModule,
    SearchableSelectModalModule,
  ],
  declarations: [DemoPage],
})
export class DemoPageModule {}
