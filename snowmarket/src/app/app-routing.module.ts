import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { adminGuard, posGuard } from './admin.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pos',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./admin-page/admin-page.module').then(
        (m) => m.AdminPagePageModule
      ),
  },
  {
    path: 'login',
    canActivate: [posGuard],
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'customer',
    canActivate: [posGuard],
    loadChildren: () =>
      import('./customer/customer.module').then((m) => m.CustomerPageModule),
  },
  {
    path: 'customer/:id',
    canActivate: [posGuard],
    loadChildren: () =>
      import('./customer/customer.module').then((m) => m.CustomerPageModule),
  },
  {
    path: 'pos',
    loadChildren: () => import('./pos/pos.module').then((m) => m.PosPageModule),
  },
  {
    path: 'demo',
    loadChildren: () => import('./demo/demo.module').then( m => m.DemoPageModule)
  },
  // {
  //   path: 'login',
  //   loadChildren: () =>
  //     import('./login/login.module').then((m) => m.LoginPageModule),
  // },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
