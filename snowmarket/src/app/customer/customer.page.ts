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
  originals: {
    id: number
    name: string
    unit_price: number
    quantity: number
    price: number
  }[] = []
  discounts: {
    id: number
    name: string
    unit_price: number
    quantity: number
    price: number
  }[] = []
  price_discount: {
    id: number
    name: string
    price: number
  }[] = []
  newDiscount: {
    id: number
    name: string
    unit_price: number
    quantity: number
    price: number
  } = { id: 0, name: '', unit_price: 0, quantity: 0, price: 0 }
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

  totalQuantity: number = 0
  totalPrice: number = 0
  totalDiscount: number = 0
  totalBalance: number = 0

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
      model: 'bad012-r9unv',
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
    let json = await this.customerService.postID({ id: idToFilter })
    if (json) {
      const {
        discount_id,
        discount_title,
        discount_product_id,
        discount_brand_id,
        discount_categories_id,
        discount_quantity,
        discount_amount,
        ...itemData
      } = json.item
      const newItem = {
        id: itemData.id,
        name: itemData.name,
        unit_price: itemData.unit_price,
        quantity: 1,
        price: itemData.unit_price,
      }
      let check = this.items.find((item) => item.id == idToFilter)
      if (!check) {
        this.items.push(newItem)
        this.originals.push(newItem)
      } else {
        check.quantity++
        check.price += newItem.unit_price
        if (
          discount_id &&
          discount_title &&
          discount_quantity &&
          discount_amount &&
          check.quantity % discount_quantity == 0
        ) {
          const newDiscount = {
            id: discount_id,
            name: discount_title,
            unit_price: -discount_amount,
            quantity: 1,
            price: -discount_amount,
          }
          const newDiscountItem = {
            id: discount_id,
            name: discount_title,
            unit_price: +'',
            quantity: +'',
            price: discount_amount,
          }
          let checkDiscountList = this.discounts.find(
            (discount) => discount.id == discount_id
          )
          if (!checkDiscountList) {
            this.items.push(newDiscountItem)
            this.discounts.push(newDiscount)
          } else {
            checkDiscountList.quantity++
            checkDiscountList.price += newDiscount.unit_price
            let checkDiscountListItem = this.items.find(
              (discount) => discount.name == discount_title
            )
            if (checkDiscountListItem) {
              checkDiscountListItem.price -= newDiscount.unit_price
            }
          }
          this.calculateTotalDiscount()
        }
      }
      this.calculateTotalQuantity()
      this.calculateTotalPrice()
      this.calculateBalance()
      if (json.price_discount) {
        let discountAmount
        for (const discount of json.price_discount) {
          const {
            price_discount_id,
            price_discount_title,
            price_discount_total,
            price_discount_rate,
          } = discount
          let total =
            this.totalPrice -
            +this.discounts
              .reduce((total, discount) => total + discount.price, 0)
              .toFixed(2)
          if (total >= price_discount_total) {
            if (price_discount_rate.startsWith('-')) {
              discountAmount = parseFloat(price_discount_rate)
            } else if (price_discount_rate.startsWith('*')) {
              const discountMultiplier = parseFloat(
                price_discount_rate.slice(1)
              )
              discountAmount = total * (discountMultiplier - 1)
            }
            if (typeof discountAmount !== 'undefined') {
              const PriceDiscount = {
                id: price_discount_id,
                name: price_discount_title,
                price: +discountAmount.toFixed(2),
              }
              let checkPriceDiscountList = this.price_discount.length > 0
              if (!checkPriceDiscountList) {
                this.price_discount.push(PriceDiscount)
              } else {
                this.price_discount[0].id = price_discount_id
                this.price_discount[0].name = price_discount_title
                this.price_discount[0].price = +discountAmount.toFixed(2)
              }
            }
          }
        }
        this.calculateTotalDiscount()
      }
      console.log('this.item', this.items)
      console.log('this.discounts', this.discounts)
      console.log('this.originals', this.originals)
      console.log('this.price_discount', this.price_discount[0])
      this.findID = ''
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
    this.totalQuantity = +this.originals
      .reduce((total, item) => total + item.quantity, 0)
      .toFixed(2)
    return this.totalQuantity
  }

  calculateTotalPrice(): number {
    this.totalPrice = +this.originals
      .reduce((total, item) => total + item.price, 0)
      .toFixed(2)
    return this.totalPrice
  }

  calculateTotalDiscount() {
    const priceDiscountAmount = this.price_discount[0]
      ? this.price_discount[0].price
      : 0

    this.totalDiscount =
      +this.discounts
        .reduce((total, discount) => total + discount.price, 0)
        .toFixed(2) - priceDiscountAmount
    return this.totalDiscount
  }

  calculateBalance(): number {
    this.totalBalance = +(this.totalPrice - this.totalDiscount).toFixed(2)
    return this.totalBalance
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
            this.discounts = []
            this.originals = []
            this.price_discount = []
            this.cancel()
          }
        })
      }
    })
  }
}
