import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import Swal from 'sweetalert2'
import { sweetalert2Success, sweetalert2error } from 'utils/sweetalert2'
import { PosService } from '../pos.service'

@Component({
  selector: 'app-pos',
  templateUrl: './pos.page.html',
  styleUrls: ['./pos.page.scss'],
})
export class PosPage implements OnInit {
  constructor(private router: Router, private posService: PosService) {}

  ngOnInit() {}

  async systemLogin() {
    const { value: pos_id } = await Swal.fire({
      title: 'Enter the POS ID',
      input: 'text',
      inputLabel: 'POS ID',
      heightAuto: false,
      showCancelButton: true,
      inputValidator: async (pos_id) => {
        let json = await this.posService.checkPOS({ pos: pos_id })
        if (json.error != null) {
          sweetalert2error(json.error)
          return
        } else if (json.id) {
          let id = json.id.toString()
          if (pos_id == json.code) {
            sweetalert2Success('System Login')
            sessionStorage.setItem('pos', id)
            this.router.navigate(['/login'])
          }
        }
      },
    })
  }
}
