import { Component, OnInit } from '@angular/core'
import { Option } from '../searchable-select-modal/searchable-select-modal.component'

type User = {
  fruit: string
  name: string
}

type Field = {
  label: string
  options: string[]
  key: keyof User
}

type User2 = {
  fruit_id: number
}

@Component({
  selector: 'app-demo',
  templateUrl: './demo.page.html',
  styleUrls: ['./demo.page.scss'],
})
export class DemoPage implements OnInit {
  user = this.defaultUser()

  user2: User2 = {
    fruit_id: 1,
  }
  selectedFruitOption?: Option<User2>

  pickingFruit = false

  fruits = ['Apple', 'Banana', 'Cherry']
  fruitOptions = [
    { value: 1, text: 'Apple' },
    { value: 2, text: 'Banana' },
    { value: 3, text: 'Cherry' },
  ]
  names = ['Alice', 'Bobby', 'Cherry']

  fields: Field[] = [
    { label: 'Fruit', options: this.fruits, key: 'fruit' },
    { label: 'Agent', options: this.names, key: 'name' },
  ]

  searchText = ''

  chooseOption(value: string) {
    this.user.fruit = value
    this.pickingFruit = false
  }

  constructor() {}

  ngOnInit() {}

  defaultUser(): User {
    return {
      fruit: 'Apple',
      name: 'Alice',
    }
  }

  reset() {
    this.user = this.defaultUser()
  }

  submit() {
    console.log('submit:', this.user)
  }
}
