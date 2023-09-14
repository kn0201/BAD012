import { Component, OnInit } from '@angular/core'
import { AdminService } from '../admin.service'

@Component({
  selector: 'app-admin-trash-list',
  templateUrl: './admin-trash-list.page.html',
  styleUrls: ['./admin-trash-list.page.scss'],
})
export class AdminTrashListPage implements OnInit {
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.test()
  }

  async test() {
    let json = await this.adminService.getHello()
    console.log(json.result)
  }
}
