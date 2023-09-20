import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SearchableSelectModalComponent } from './searchable-select-modal.component'
import { IonicModule } from '@ionic/angular'
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [SearchableSelectModalComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [SearchableSelectModalComponent],
})
export class SearchableSelectModalModule {}
