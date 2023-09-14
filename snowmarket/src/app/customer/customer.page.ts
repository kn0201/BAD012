import {
  Component,
  OnInit,
  AfterViewInit,
  HostListener,
  ViewChild,
  ElementRef,
  ViewChildren,
} from '@angular/core'
import { IonModal } from '@ionic/angular'

import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam'
import { productList } from 'src/assets/product'
import Swal from 'sweetalert2'
import { HttpClient, HttpHeaders } from '@angular/common/http'

declare var roboflow: any
@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit, AfterViewInit {
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

  // private width!: number
  // private height!: number

  @ViewChild(IonModal) modal!: IonModal

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    // const win = !!event ? (event.target as Window) : window
    // this.width = win.innerWidth
    // this.height = win.innerHeight
  }

  model: any
  context!: CanvasRenderingContext2D

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

  ngAfterViewInit() {
    this.startCam()
  }

  async startCam() {
    let stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'environment',
        width: {
          ideal: 400,
        },
        height: {
          ideal: 400,
        },
      },
    })
    // console.log('video:', this.video)
    // console.log('canvas:', this.canvas)
    this.video.nativeElement.srcObject = stream
    this.context = this.canvas.nativeElement.getContext('2d')!

    var publishable_key = 'rf_lmQyrjb8JIWuxlFLi7CDwWUSPZq1'
    var toLoad = {
      model: 'bad-ovtnr',
      version: 1,
    }

    this.model = await roboflow
      .auth({
        publishable_key: publishable_key,
      })
      .load(toLoad)

    console.log('model:', this.model)
    this.resizeCanvas()
    this.detectFrame()
  }

  resizeCanvas() {
    this.canvas.nativeElement.width = this.video.nativeElement.videoWidth
    this.canvas.nativeElement.height = this.video.nativeElement.videoHeight
  }

  async detectFrame() {
    this.context.drawImage(this.video.nativeElement, 0, 0)
    let predictions = await this.model.detect(this.video.nativeElement)
    // console.log('predictions', predictions)

    for (let prediction of predictions) {
      this.context.strokeStyle = 'red'
      this.context.beginPath()
      this.context.rect(
        prediction.bbox.x,
        prediction.bbox.y,
        prediction.bbox.width,
        prediction.bbox.height
      )
      this.context.stroke()
      this.context.fillStyle = 'red'
      this.context.font = '64px sans-serif'
      this.context.fillText(
        prediction.class,
        prediction.bbox.x,
        prediction.bbox.y - 12
      )
    }

    requestAnimationFrame(() => this.detectFrame())
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error)
  }

  addItem() {
    const idToFilter = +this.findID

    const matchingProduct = productList.find(
      (product) => product.id === idToFilter
    )

    if (matchingProduct && this.findID !== '') {
      const newItem = {
        id: matchingProduct.id,
        name: matchingProduct.name,
        quantity: 1,
        price: matchingProduct.price,
      }

      this.items.push(newItem)
      this.findID = ''
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Invalid ID',
        icon: 'warning',
        confirmButtonColor: '#ffa065',
        heightAuto: false,
      })
    }
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
      title: 'Confirm to delete below gitem?',
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
