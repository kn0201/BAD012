import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

export type Option<T> = {
  value: T
  text: string
}

@Component({
  selector: 'searchable-select-modal',
  templateUrl: './searchable-select-modal.component.html',
  styleUrls: ['./searchable-select-modal.component.scss'],
})
export class SearchableSelectModalComponent<
  O = {},
  V extends O[keyof O] = O[keyof O]
> implements OnInit
{
  @Input()
  isOpen = false

  searchText = ''

  @Input()
  title: string = ''

  @Input()
  options!: Option<V>[]

  matchedOptions: Option<V>[] = []

  @Input()
  object!: O

  @Input()
  key!: keyof O

  @Output()
  select = new EventEmitter()

  @Output()
  close = new EventEmitter()

  constructor() {}

  ngOnInit() {
    this.searchOption()
  }

  searchOption() {
    this.matchedOptions.length = 0
    let searchText = this.searchText.toLowerCase()
    for (let option of this.options) {
      if (option.text.toLowerCase().includes(searchText)) {
        this.matchedOptions.push(option)
      }
    }
  }

  chooseOption(option: Option<V>) {
    this.object[this.key] = option.value
    this.select.emit(option)
    this.close.emit()
  }
}
