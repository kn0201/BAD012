import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

// import { Subject, Observable } from 'rxjs';
import { WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { productList } from 'src/assets/product';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {
  items: { id: number; name: string; price: number }[] = [];

  findID: number = +'';
  newID: number = +'';
  newName: string = '';
  newPrice: number = +'';

  discountAmount: number = +'';
  idToFilter: number = +'';

  canDismiss = true;

  public multipleWebcamsAvailable = false;
  public errors: WebcamInitError[] = [];

  private width!: number;
  private height!: number;

  @ViewChild(IonModal) modal!: IonModal;

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    const win = !!event ? (event.target as Window) : window;
    this.width = win.innerWidth;
    this.height = win.innerHeight;
  }

  constructor() {
    this.onResize();
  }

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  addItem() {
    const idToFilter = +this.findID;

    const matchingProduct = productList.find(
      (product) => product.id === idToFilter
    );

    if (matchingProduct) {
      const newItem = {
        id: matchingProduct.id,
        name: matchingProduct.name,
        price: matchingProduct.price,
      };

      this.items.push(newItem);

      this.newID = +'';
      this.newName = '';
      this.newPrice = +'';
    } else {
      throw new Error('No item matching');
    }
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  calculateTotalPrice(): number {
    return +this.items
      .reduce((total, item) => total + item.price, 0)
      .toFixed(2);
  }

  calculateBalance(): number {
    const totalPrice = this.calculateTotalPrice();
    return +(totalPrice - this.discountAmount).toFixed(2);
  }

  cancel() {
    this.modal.dismiss();
  }
}
