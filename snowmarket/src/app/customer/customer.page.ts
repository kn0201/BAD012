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
import Swal from 'sweetalert2'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CustomerService } from '../customer.service'
import { sweetalert2error } from 'utils/sweetalert2'

declare var roboflow: any
@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit, AfterViewInit {
  items: {
    id: number
    name: string
    unit_price: number
    quantity: number
    price: number
  }[] = []
  discounts: {
    id: number
    title: string
    discount_amount: number
    discount_quantity: number
    total_discount: number
  }[] = []
  // summarizedItems: {
  //   id: number
  //   name: string
  //   quantity: number
  //   price: number
  // }[] = []

  findID: number | string = ''

  discountAmount: number = +''
  idToFilter: number = +''

  canDismiss = true
  showDeleteButton = false

  // Add Item Section
  // searchedItemIDList: number[] = []
  // itemListMap: Map<
  //   number /*product id */,
  //   { name: string; quantity: number; unit_price: number; price: number }
  // > = new Map()
  // productDiscountMap: Map<
  //   number /*product id */,
  //   { amount: number; quantity: number }
  // > = new Map()
  // /* */

  public multipleWebcamsAvailable = false
  public errors: WebcamInitError[] = []

  @ViewChild(IonModal) modal!: IonModal

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>

  model: any
  context!: CanvasRenderingContext2D

  constructor(private customerService: CustomerService) {}

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
    this.canvas.nativeElement.height =
      this.video.nativeElement.videoHeight / 1.6
  }

  async detectFrame() {
    this.context.drawImage(this.video.nativeElement, 0, 0)
    let predictions = await this.model.detect(this.video.nativeElement)

    for (let prediction of predictions) {
      console.log('predictions', prediction.class)
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

  async addItem() {
    if (this.findID == '') {
      sweetalert2error('Empty Product ID')
      return
    }

    const idToFilter = +this.findID
    try {
      let json = await this.customerService.postID({ id: idToFilter })
      if (json) {
        const newItem = {
          id: json.item.id,
          name: json.item.name,
          unit_price: json.item.unit_price,
          quantity: 1,
          price: json.item.unit_price,
        }
        let check = this.items.find((item) => item.id == idToFilter)
        if (!check) {
          this.items.push(newItem)
        } else {
          check.quantity++
          check.price += newItem.unit_price
        }
        this.findID = ''
        // const { discount_amount, discount_quantity,  } =
        // if (discount_amount && discount_quantity) {
        //         this.productDiscountMap.set(idToFilter, {
        //           amount: discount_amount,
        //           quantity: discount_quantity,
        //         })
        //       }
        //     }
        //     const productDiscountInfo = this.productDiscountMap.get(idToFilter)
        //     if (productDiscountInfo) {
        //       const productInConsideration = this.itemListMap.get(idToFilter)
        //       if (productInConsideration) {
        //         const discountTimes = Math.floor(
        //           productInConsideration.quantity / productDiscountInfo.quantity
        //         )
        //         /* Update the discount = discount times * productDiscountInfo.amount */
        //       }
      }
    } catch (err) {
      sweetalert2error(err)
    }
    //   let dummyArray = new Set([...this.searchedItemIDList, idToFilter])
    //   if (dummyArray.size === this.searchedItemIDList.length) {
    //     let objectInConsideration = this.itemListMap.get(idToFilter)
    //     if (objectInConsideration) {
    //       this.itemListMap.set(idToFilter, {
    //         ...objectInConsideration,
    //         quantity: objectInConsideration.quantity + 1,
    //         price:
    //           objectInConsideration.unit_price * objectInConsideration.quantity,
    //       })
    //     }
    //     let json = await this.customerService.postID({ id: idToFilter })
    //     this.searchedItemIDList.push(idToFilter)
    //     const { id, name, unit_price, discount_amount, discount_quantity } =
    //       json.item
    //     this.itemListMap.set(idToFilter, {
    //       name,
    //       unit_price,
    //       price: unit_price,
    //       quantity: 1,
    //     })
    //     if (discount_amount && discount_quantity) {
    //       this.productDiscountMap.set(idToFilter, {
    //         amount: discount_amount,
    //         quantity: discount_quantity,
    //       })
    //     }
    //   }
    //   const productDiscountInfo = this.productDiscountMap.get(idToFilter)
    //   if (productDiscountInfo) {
    //     const productInConsideration = this.itemListMap.get(idToFilter)
    //     if (productInConsideration) {
    //       const discountTimes = Math.floor(
    //         productInConsideration.quantity / productDiscountInfo.quantity
    //       )
    //       /* Update the discount = discount times * productDiscountInfo.amount */
    //     }
    //     this.items = Array.from(this.itemListMap).map(([id, productInfo]) => {
    //       return { ...productInfo, id }
    //     })
    //     this.findID = ''
    //   }
    // } catch (err) {
    //   sweetalert2error('Invalid Product ID')
    // }
  }

  async addBag() {
    const idToFilter = 1
    try {
      let json = await this.customerService.postID({ id: idToFilter })
      if (json) {
        const newItem = {
          id: json.item.id,
          name: json.item.name,
          unit_price: json.item.unit_price,
          quantity: 1,
          price: json.item.unit_price,
        }
        let check = this.items.find((item) => item.id == idToFilter)
        if (!check) {
          this.items.push(newItem)
        } else {
          check.quantity++
          check.price += newItem.unit_price
        }
      }
    } catch (err) {
      sweetalert2error(err)
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
  calculateTotalQuantity(): number {
    return +this.items
      .reduce((total, item) => total + item.quantity, 0)
      .toFixed(2)
  }

  calculateTotalPrice(): number {
    return +this.items.reduce((total, item) => total + item.price, 0).toFixed(2)
  }

  calculateBalance(): number {
    const totalPrice = this.calculateTotalPrice()
    return +(totalPrice - this.discountAmount).toFixed(2)
  }

  // summarizeItem2() {
  //   type ResultItem = {
  //     id: number
  //     name: string
  //     totalQuantity: number
  //     totalPrice: number
  //   }
  //   type ResultMap = Record<number, ResultItem>
  //   let result: ResultItem[] = Object.values(
  //     this.items.reduce((r: ResultMap, { id, name, quantity, price }) => {
  //       r[id] ??= { id, name, totalQuantity: 0, totalPrice: 0 }
  //       r[id].totalQuantity += quantity
  //       r[id].totalPrice += price
  //       return r
  //     }, {})
  //   )
  //   let mappedResult = result.map((item) => {
  //     return {
  //       id: item.id,
  //       name: item.name,
  //       quantity: item.totalQuantity,
  //       price: item.totalPrice,
  //     }
  //   })
  //   this.summarizedItems = mappedResult
  // }

  // summarizeItem() {
  //   const itemList: {
  //     id: number
  //     name: string
  //     quantity: number
  //     price: number
  //   }[] = []

  //   Array.from(this.itemListMap).map(([id, productInfo]) => {
  //     itemList.push({ ...productInfo, id })
  //   })
  //   console.log({ itemList })
  //   this.summarizedItems = itemList
  // }

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
