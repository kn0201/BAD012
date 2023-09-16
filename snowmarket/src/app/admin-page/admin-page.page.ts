import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.page.html',
  styleUrls: ['./admin-page.page.scss'],
})
export class AdminPagePage implements OnInit {
  public adminPages = [
    { title: 'Chart', url: '/admin/chart-list', icon: 'stats-chart' },
    // { title: 'Brand', url: '/admin/brand-list', icon: 'ribbon' },
    {
      title: 'Brand & Categories',
      url: '/admin/b&c-list',
      icon: 'folder-open',
    },
    { title: 'Product', url: '/admin/product-list', icon: 'pricetag' },
    { title: 'Discount', url: '/admin/discount-list', icon: 'logo-usd' },
    { title: 'Member', url: '/admin/member-list', icon: 'people' },
    { title: 'Receipt', url: '/admin/receipt-list', icon: 'receipt' },
    { title: 'Trash', url: '/admin/trash-list', icon: 'trash' },
  ]
  constructor(private router: Router) {}

  ngOnInit() {}

  async logout() {
    const { value: logout } = await Swal.fire({
      title: 'What Do You Want?',
      icon: 'question',
      input: 'select',
      inputOptions: {
        logout: 'Logout System',
        shutdown: 'Shutdown POS',
      },
      inputPlaceholder: 'Choose One',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
      heightAuto: false,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value === 'logout') {
            sessionStorage.removeItem('user_id')
            sessionStorage.removeItem('username')
            this.router.navigate(['/admin'])
            resolve()
          } else if (value === 'shutdown') {
            sessionStorage.removeItem('user_id')
            sessionStorage.removeItem('username')
            sessionStorage.removeItem('POS')
            this.router.navigate(['/pos'])
            resolve()
          }
        })
      },
    })
  }
}
