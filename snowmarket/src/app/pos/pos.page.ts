import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import Swal from 'sweetalert2'
import { sweetalert2Success } from 'utils/sweetalert2'

@Component({
  selector: 'app-pos',
  templateUrl: './pos.page.html',
  styleUrls: ['./pos.page.scss'],
})
export class PosPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  async systemLogin() {
    const { value: pos_id } = await Swal.fire({
      title: 'Enter the POS ID',
      input: 'text',
      inputLabel: 'POS ID',
      heightAuto: false,
      showCancelButton: true,
      inputValidator: (pos_id) => {
        if (pos_id == '000161') {
          sweetalert2Success('System Login')
          sessionStorage.setItem('POS', '1')
          this.router.navigate(['/login'])
        }
      },
    })
  }
}
