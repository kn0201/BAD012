import { Component, OnInit, HostListener } from '@angular/core';

// import { Subject, Observable } from 'rxjs';
import { WebcamInitError, WebcamUtil } from 'ngx-webcam';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {
  items: { name: string; price: number }[] = [
    { name: 'KitKat Chocolate Bar', price: 6.0 },
    { name: 'Potato Chip', price: 12.0 },
  ];

  AIInput = { name: '', price: +'' };

  public multipleWebcamsAvailable = false;
  public errors: WebcamInitError[] = [];

  private width!: number;
  private height!: number;

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
    this.items.push(this.AIInput);
    this.AIInput.name = '';
    this.AIInput.price = +'';
  }

  removeItem(item: { name: string; price: number }) {
    let index = this.items.indexOf(item);
    this.items.splice(index, 1);
  }
}
