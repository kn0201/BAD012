import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core'
import { IonModal } from '@ionic/angular'

import Swal from 'sweetalert2'
import { AddToCartResult, CustomerService } from '../customer.service'
import { sweetalert2error } from 'utils/sweetalert2'
import { Router } from '@angular/router'
import { ProductService } from '../product.service'

declare var roboflow: any
@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage {
  items: {
    id: number
    name: string
    brand_id: number
    categories_id: number
    unit_price: number
    quantity: number
    price: number
  }[] = []
  originals: {
    id: number
    name: string
    brand_id: number
    categories_id: number
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
  paymentMethods: {
    name: string
    method: string
  }[] = [
    { name: 'logo-alipay', method: 'Alipay' },
    { name: 'card-outline', method: 'Credit Card' },
  ]
  selected: any

  user_id = null
  username = 'Guest'
  findID: number | string = ''

  quantity: number = 0
  discountAmount: number = +''
  idToFilter: number = +''

  canDismiss = true
  showDeleteButton = false

  totalQuantity: number = 0
  totalPrice: number = 0
  totalDiscount: number = 0
  totalBalance: number = 0
  totalBagAmount: number = 0

  mediaStream?: MediaStream
  coolDownProductLabels = new Set<string>()

  @ViewChild(IonModal) modal!: IonModal

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>

  model: any
  context!: CanvasRenderingContext2D

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    if (sessionStorage['user_id'] != null) {
      this.user_id = sessionStorage['user_id']
      this.username = sessionStorage['username']
    }
    setTimeout(() => {
      this.router.navigate(['login'])
      this.items = []
      this.discounts = []
      this.originals = []
      this.price_discount = []
      sessionStorage.removeItem('user_id')
      sessionStorage.removeItem('username')
      sessionStorage.removeItem('role')
    }, 600000)
  }

  async ionViewDidEnter() {
    await this.startCam()
  }

  ionViewWillLeave() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
    }
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
    this.mediaStream = stream
    this.video.nativeElement.srcObject = stream
    this.context = this.canvas.nativeElement.getContext('2d')!

    var publishable_key = 'rf_lmQyrjb8JIWuxlFLi7CDwWUSPZq1'
    var toLoad = {
      model: 'bad012-pldqj',
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
    let predictions: {
      bbox: { x: number; y: number; width: number; height: number }
      class: string
      confidence: number
    }[] = await this.model.detect(this.video.nativeElement)

    // predictions = predictions.filter(
    //   (prediction) =>
    //     prediction.confidence > 0.8 &&
    //     !this.coolDownProductLabels.has(prediction.class)
    // )

    if (predictions.length > 0) {
      console.log({ predictions })
    }

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

      if (
        prediction.confidence < 0.8 ||
        this.coolDownProductLabels.has(prediction.class)
      ) {
        continue
      }
      this.coolDownProductLabels.add(prediction.class)
      setTimeout(() => {
        this.coolDownProductLabels.delete(prediction.class)
      }, 3500)

      this.customerService
        .addToCartByProductLabel(prediction.class)
        .then((json) => this.handleAddItemResult(json))
    }

    requestAnimationFrame(() => this.detectFrame())
  }

  exit() {
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('role')
    this.router.navigate(['/login'])
  }

  async addItemFromInput() {
    let product_id = +this.findID
    if (!product_id) {
      sweetalert2error('Empty Product ID')
      return
    }
    this.findID = ''

    let json = await this.customerService.addToCartByProductId(product_id)
    this.handleAddItemResult(json)
  }

  handleAddItemResult(json: AddToCartResult) {
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
      brand_id: itemData.product_brand_id,
      categories_id: itemData.product_categories_id,
      unit_price: itemData.unit_price,
      quantity: 1,
      price: itemData.unit_price,
    }
    let item = this.items.find((item) => item.id == itemData.id)
    let brandItem = this.items.find(
      (item) =>
        item.brand_id == itemData.product_brand_id &&
        item.categories_id == itemData.product_categories_id
    )

    if (!item) {
      this.items.push(newItem)
      this.originals.push(newItem)
    } else {
      item.quantity++
      item.price += newItem.unit_price
      if (
        discount_id &&
        discount_title &&
        discount_product_id &&
        discount_quantity &&
        discount_amount &&
        item.quantity % discount_quantity == 0
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
          brand_id: +'',
          categories_id: +'',
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
          this.calculateTotalDiscount()
        }
      }
    }
    if (brandItem) {
      if (discount_quantity) {
        let sameBrand = this.items.filter((item) => {
          return (
            item.brand_id == discount_brand_id &&
            item.categories_id == discount_categories_id
          )
        })
        let sameBrandNum = sameBrand.reduce(
          (total, item) => total + item.quantity,
          0
        )
        if (
          discount_id &&
          discount_title &&
          discount_brand_id &&
          discount_categories_id &&
          discount_amount &&
          sameBrandNum % discount_quantity == 0
        ) {
          const newBrandDiscount = {
            id: discount_id,
            name: discount_title,
            unit_price: -discount_amount,
            quantity: 1,
            price: -discount_amount,
          }
          const newBrandDiscountItem = {
            id: discount_id,
            name: discount_title,
            brand_id: +'',
            categories_id: +'',
            unit_price: +'',
            quantity: +'',
            price: discount_amount,
          }
          let checkBrandDiscountList = this.discounts.find(
            (discount) => discount.id == discount_id
          )
          if (!checkBrandDiscountList) {
            this.items.push(newBrandDiscountItem)
            this.discounts.push(newBrandDiscount)
          } else {
            checkBrandDiscountList.quantity++
            checkBrandDiscountList.price += newBrandDiscount.unit_price
            let checkBrandDiscountListItem = this.items.find(
              (discount) => discount.name == discount_title
            )
            if (checkBrandDiscountListItem) {
              checkBrandDiscountListItem.price -= newBrandDiscount.unit_price
            }
            this.calculateTotalDiscount()
          }
        }
      }
    }
    this.calculateTotalBalance()
    if (json.price_discount) {
      let discountAmount
      for (const discount of json.price_discount) {
        if (discount) {
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
      }
      this.calculateTotalDiscount()
      this.calculateTotalBalance()
    }
  }

  handleRemoveItemResult(json: AddToCartResult) {
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
    let item = this.items.find((item) => item.id == itemData.id)
    let brandItem = this.items.find(
      (item) =>
        item.brand_id == itemData.product_brand_id &&
        item.categories_id == itemData.product_categories_id
    )
    if (item) {
      item.quantity--
      item.price -= itemData.unit_price
      if (item.quantity <= 0) {
        const indexToRemove = this.items.findIndex(
          (item) => item.id == itemData.id
        )
        if (indexToRemove !== -1) {
          this.items.splice(indexToRemove, 1)
        }
        const indexToRemoveOriginal = this.originals.findIndex(
          (item) => item.id == itemData.id
        )
        if (indexToRemoveOriginal !== -1) {
          this.originals.splice(indexToRemoveOriginal, 1)
        }
      }
      if (
        discount_id &&
        discount_title &&
        discount_product_id &&
        discount_quantity &&
        discount_amount
      ) {
        let checkDiscountList = this.discounts.find(
          (discount) => discount.id == discount_id
        )
        let checkDiscountListItem = this.items.find(
          (discount) => discount.name == discount_title
        )
        if (checkDiscountList && checkDiscountListItem) {
          let discountQuantity = +Math.floor(
            item.quantity / discount_quantity
          ).toFixed(0)
          if (discountQuantity >= 0) {
            checkDiscountList.quantity = discountQuantity
            checkDiscountList.price =
              checkDiscountList.unit_price * discountQuantity
            checkDiscountListItem.price =
              -checkDiscountList.unit_price * discountQuantity
          }
          if (discountQuantity <= 0) {
            const indexToRemove = this.items.findIndex(
              (item) => item.id == checkDiscountList!.id
            )
            if (indexToRemove !== -1) {
              this.items.splice(indexToRemove, 1)
            }
            const indexToRemoveDiscount = this.discounts.findIndex(
              (discount) => discount.id == checkDiscountListItem!.id
            )
            if (indexToRemoveDiscount !== -1) {
              this.discounts.splice(indexToRemoveDiscount, 1)
            }
          }
          this.calculateTotalDiscount()
        }
      }
    }
    if (brandItem) {
      if (discount_quantity) {
        let sameBrand = this.items.filter((item) => {
          return (
            item.brand_id == discount_brand_id &&
            item.categories_id == discount_categories_id
          )
        })
        let sameBrandNum = sameBrand.reduce(
          (total, item) => total + item.quantity,
          0
        )
        if (
          discount_id &&
          discount_title &&
          discount_brand_id &&
          discount_categories_id &&
          discount_amount
        ) {
          let checkBrandDiscountList = this.discounts.find(
            (discount) => discount.id == discount_id
          )
          let checkBrandDiscountListItem = this.items.find(
            (discount) => discount.name == discount_title
          )
          if (checkBrandDiscountList && checkBrandDiscountListItem) {
            let brandDiscountQuantity = +Math.floor(
              sameBrandNum / discount_quantity
            ).toFixed(0)
            if (brandDiscountQuantity >= 0) {
              checkBrandDiscountList.quantity = brandDiscountQuantity
              checkBrandDiscountList.price =
                checkBrandDiscountList.unit_price * brandDiscountQuantity
              checkBrandDiscountListItem.price =
                -checkBrandDiscountList.unit_price * brandDiscountQuantity
            }
            if (brandDiscountQuantity <= 0) {
              const indexToRemoveBrand = this.items.findIndex(
                (item) => item.id == checkBrandDiscountList!.id
              )
              if (indexToRemoveBrand !== -1) {
                this.items.splice(indexToRemoveBrand, 1)
              }
              const indexToRemoveBrandDiscount = this.discounts.findIndex(
                (discount) => discount.id == checkBrandDiscountListItem!.id
              )
              if (indexToRemoveBrandDiscount !== -1) {
                this.discounts.splice(indexToRemoveBrandDiscount, 1)
              }
            }
            this.calculateTotalDiscount()
          }
        }
      }
    }
    this.calculateTotalBalance()
    if (json.price_discount) {
      let discountAmount
      for (const discount of json.price_discount) {
        if (discount) {
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
            let checkPriceDiscountList = this.price_discount.length > 0
            if (
              checkPriceDiscountList &&
              typeof discountAmount !== 'undefined'
            ) {
              this.price_discount[0].id = price_discount_id
              this.price_discount[0].name = price_discount_title
              this.price_discount[0].price = +discountAmount.toFixed(2)
            }
          }
          if (
            this.price_discount[0] &&
            total < this.price_discount[0].price &&
            typeof discountAmount !== 'undefined'
          ) {
            if (typeof discountAmount !== 'undefined') {
              this.price_discount[0].id = price_discount_id
              this.price_discount[0].name = price_discount_title
              this.price_discount[0].price = +discountAmount.toFixed(2)
            }
          }
        }
      }
      this.calculateTotalDiscount()
      this.checkPriceDiscount(json.price_discount)
      this.calculateTotalBalance()
    }
  }

  handleDeleteItemResult(json: AddToCartResult) {
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
    let item = this.items.find((item) => item.id == itemData.id)
    let brandItem = this.items.find(
      (item) =>
        item.brand_id == itemData.product_brand_id &&
        item.categories_id == itemData.product_categories_id
    )
    if (item) {
      item.quantity = 0
      item.price = 0
      const indexToRemove = this.items.findIndex(
        (item) => item.id == itemData.id
      )
      if (indexToRemove !== -1) {
        this.items.splice(indexToRemove, 1)
      }
      const indexToRemoveOriginal = this.originals.findIndex(
        (item) => item.id == itemData.id
      )
      if (indexToRemoveOriginal !== -1) {
        this.originals.splice(indexToRemoveOriginal, 1)
      }
    }
    if (
      discount_id &&
      discount_title &&
      discount_product_id &&
      discount_quantity &&
      discount_amount
    ) {
      let checkDiscountList = this.discounts.find(
        (discount) => discount.id == discount_id
      )
      let checkDiscountListItem = this.items.find(
        (discount) => discount.name == discount_title
      )
      if (checkDiscountList && checkDiscountListItem) {
        checkDiscountList.quantity = 0
        checkDiscountList.price = 0
        checkDiscountListItem.price = 0
        const indexToRemove = this.items.findIndex(
          (item) => item.id == checkDiscountList!.id
        )
        if (indexToRemove !== -1) {
          this.items.splice(indexToRemove, 1)
        }
        const indexToRemoveDiscount = this.discounts.findIndex(
          (discount) => discount.id == checkDiscountListItem!.id
        )
        if (indexToRemoveDiscount !== -1) {
          this.discounts.splice(indexToRemoveDiscount, 1)
        }
      }
      this.calculateTotalDiscount()
    }
    if (brandItem) {
      if (discount_quantity) {
        let sameBrand = this.items.filter((item) => {
          return (
            item.brand_id == discount_brand_id &&
            item.categories_id == discount_categories_id
          )
        })
        let sameBrandNum = sameBrand.reduce(
          (total, item) => total + item.quantity,
          0
        )
        if (
          discount_id &&
          discount_title &&
          discount_brand_id &&
          discount_categories_id &&
          discount_amount
        ) {
          let checkBrandDiscountList = this.discounts.find(
            (discount) => discount.id == discount_id
          )
          let checkBrandDiscountListItem = this.items.find(
            (discount) => discount.name == discount_title
          )
          if (checkBrandDiscountList && checkBrandDiscountListItem) {
            let brandDiscountQuantity = +Math.floor(
              sameBrandNum / discount_quantity
            ).toFixed(0)
            if (brandDiscountQuantity >= 0) {
              checkBrandDiscountList.quantity = brandDiscountQuantity
              checkBrandDiscountList.price =
                checkBrandDiscountList.unit_price * brandDiscountQuantity
              checkBrandDiscountListItem.price =
                -checkBrandDiscountList.unit_price * brandDiscountQuantity
            }
            if (brandDiscountQuantity <= 0) {
              const indexToRemoveBrand = this.items.findIndex(
                (item) => item.id == checkBrandDiscountList!.id
              )
              if (indexToRemoveBrand !== -1) {
                this.items.splice(indexToRemoveBrand, 1)
              }
              const indexToRemoveBrandDiscount = this.discounts.findIndex(
                (discount) => discount.id == checkBrandDiscountListItem!.id
              )
              if (indexToRemoveBrandDiscount !== -1) {
                this.discounts.splice(indexToRemoveBrandDiscount, 1)
              }
            }
            this.calculateTotalDiscount()
          }
        }
      }
    }
    this.calculateTotalBalance()
    if (json.price_discount) {
      let discountAmount
      for (const discount of json.price_discount) {
        if (discount) {
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
            let checkPriceDiscountList = this.price_discount.length > 0
            if (
              checkPriceDiscountList &&
              typeof discountAmount !== 'undefined'
            ) {
              this.price_discount[0].id = price_discount_id
              this.price_discount[0].name = price_discount_title
              this.price_discount[0].price = +discountAmount.toFixed(2)
            }
          }
          if (
            total < this.price_discount[0].price &&
            typeof discountAmount !== 'undefined'
          ) {
            if (typeof discountAmount !== 'undefined') {
              this.price_discount[0].id = price_discount_id
              this.price_discount[0].name = price_discount_title
              this.price_discount[0].price = +discountAmount.toFixed(2)
            }
          }
        }
      }
      this.calculateTotalDiscount()
      this.checkPriceDiscount(json.price_discount)
      this.calculateTotalBalance()
    }
  }

  checkPriceDiscount(json: any) {
    let total =
      this.totalPrice -
      +this.discounts
        .reduce((total, discount) => total + discount.price, 0)
        .toFixed(2)
    if (
      json.every((discount: any) => {
        return discount.price_discount_total > total
      })
    ) {
      this.price_discount.splice(0, 1)
    }
    this.calculateTotalDiscount()
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

  async addBag() {
    const product_id = 1
    let json = await this.customerService.addToCartByProductId(product_id)
    this.handleAddItemResult(json)
  }

  async increase(index: number) {
    let id = this.items[index].id
    let json = await this.customerService.addToCartByProductId(id)
    this.handleAddItemResult(json)
  }

  async decrease(index: number) {
    let id = this.items[index].id
    let json = await this.customerService.addToCartByProductId(id)
    this.handleRemoveItemResult(json)
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'The item has been deleted.',
          icon: 'success',
          confirmButtonColor: '#ffa065',
          heightAuto: false,
        })
        let id = this.items[index].id
        let json = await this.customerService.addToCartByProductId(id)
        this.handleDeleteItemResult(json)
      }
    })
  }

  calculateTotalBalance(): number {
    this.totalQuantity = +this.originals
      .reduce((total, item) => total + item.quantity, 0)
      .toFixed(2)
    this.totalPrice = +this.originals
      .reduce((total, item) => total + item.price, 0)
      .toFixed(2)
    this.totalBalance = +(this.totalPrice - this.totalDiscount).toFixed(2)
    return this.totalQuantity, this.totalPrice, this.totalBalance
  }

  calculateTotalDiscount(): number {
    const priceDiscountAmount = this.price_discount[0]
      ? this.price_discount[0].price
      : 0
    this.totalDiscount =
      +this.discounts
        .reduce((total, discount) => total + discount.price, 0)
        .toFixed(2) - priceDiscountAmount
    return this.totalDiscount
  }

  cancel() {
    this.modal.dismiss()
  }

  toggleDeleteButton() {
    this.showDeleteButton = !this.showDeleteButton
  }

  select(item: any) {
    this.selected = this.selected === item ? null : item
  }
  isActive(item: any) {
    return this.selected === item
  }

  async payment() {
    let receipt_items = this.originals.map((item) => {
      return {
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        product_id: item.id,
        brand_id: item.brand_id,
        category_id: item.categories_id,
      }
    })
    let pos_id = sessionStorage['pos']
    let json = await this.customerService.postReceipt({
      items: receipt_items,
      user_id: this.user_id,
      pos_id: pos_id,
      discount: this.totalDiscount,
      balance: this.totalBalance,
    })
    if (json) {
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
              this.router.navigate(['/login'])
              sessionStorage.removeItem('user_id')
              sessionStorage.removeItem('username')
              sessionStorage.removeItem('role')
            }
          })
        }
      })
    }
  }
}
