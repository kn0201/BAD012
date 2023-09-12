import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  showError(error: unknown) {
    Swal.fire({
      icon: 'error',
      title: 'Fail',
      text: String(error),
      heightAuto: false,
    });
  }

  showSuccess(msg: string) {
    Swal.fire({
      icon: 'success',
      title: 'Done',
      text: msg,
      heightAuto: false,
    });
  }
}
