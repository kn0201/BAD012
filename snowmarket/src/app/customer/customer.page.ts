import { Component, OnInit, HostListener, ViewChild } from '@angular/core'
import { IonModal } from '@ionic/angular'

import { WebcamInitError, WebcamUtil } from 'ngx-webcam'
import { productList } from 'src/assets/product'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {
  items: { id: number; name: string; quantity: number; price: number }[] = []
  summarizedItems: {
    id: number
    name: string
    quantity: number
    price: number
  }[] = []

  findID: number | string = ''

  discountAmount: number = +''
  idToFilter: number = +''

  canDismiss = true
  showDeleteButton = false

  public multipleWebcamsAvailable = false
  public errors: WebcamInitError[] = []

  public width: number = 640
  public height: number = 480

  @ViewChild(IonModal) modal!: IonModal

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    const win = !!event ? (event.target as Window) : window
    this.width = win.innerWidth / 1.75
    this.height = win.innerHeight / 1.75
  }

  constructor() {
    this.onResize()
  }

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1
      }
    )
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error)
  }

  showError(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#ffa065',
      heightAuto: false,
    })
  }

  addItem() {
    const id = +this.findID

    if (!id) return this.showError('Invalid Product ID')

    const product = productList.find((product) => product.id === id)

    if (!product) return this.showError('Product not found')

    this.findID = ''

    let item = this.items.find((item) => item.id == id)
    if (item) return item.quantity++

    this.items.push({
      id: product.id,
      name: product.name,
      quantity: 1,
      price: product.price,
    })
  }

  addBag() {
    const idBag = 0

    const matchingProduct = productList.find((product) => product.id === idBag)

    if (matchingProduct) {
      const newItem = {
        id: matchingProduct.id,
        name: matchingProduct.name,
        quantity: 1,
        price: matchingProduct.price,
      }
      this.items.push(newItem)
    } else {
      throw new Error('No item matching')
    }
  }

  removeItem(index: number) {
    Swal.fire({
      title: 'Confirm to delete below item?',
      text: `Name: ${this.items[index].name} | Quantity: ${this.items[index].quantity} | Price: $${this.items[index].price}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffa065',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'The item has been deleted.',
          icon: 'success',
          confirmButtonColor: '#ffa065',
          heightAuto: false,
        })
        this.items.splice(index, 1)
      }
    })
  }

  calculateTotalPrice(): number {
    return +this.items.reduce((total, item) => total + item.price, 0).toFixed(2)
  }

  calculateBalance(): number {
    const totalPrice = this.calculateTotalPrice()
    return +(totalPrice - this.discountAmount).toFixed(2)
  }

  summarizeItem() {
    type ResultItem = {
      id: number
      name: string
      totalQuantity: number
      totalPrice: number
    }
    type ResultMap = Record<number, ResultItem>
    let result: ResultItem[] = Object.values(
      this.items.reduce((r: ResultMap, { id, name, quantity, price }) => {
        r[id] ??= { id, name, totalQuantity: 0, totalPrice: 0 }
        r[id].totalQuantity += quantity
        r[id].totalPrice += price
        return r
      }, {})
    )
    let mappedResult = result.map((item) => {
      return {
        id: item.id,
        name: item.name,
        quantity: item.totalQuantity,
        price: item.totalPrice,
      }
    })
    this.summarizedItems = mappedResult
  }

  cancel() {
    this.modal.dismiss()
  }

  toggleDeleteButton() {
    this.showDeleteButton = !this.showDeleteButton
  }

  payment() {
    let timerInterval: any
    Swal.fire({
      title: 'Payment Processing...',
      timer: 1500,
      timerProgressBar: true,
      heightAuto: false,
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {
        clearInterval(timerInterval)
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        Swal.fire({
          title: 'Payment Success!',
          text: 'You have paid the items.',
          icon: 'success',
          confirmButtonColor: '#ffa065',
          confirmButtonText: 'OK',
          heightAuto: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.items = []
            this.cancel()
          }
        })
      }
    })
  }
}
