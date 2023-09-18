import { Injectable, inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'
import { Router } from '@angular/router'
import { sweetalert2error } from 'utils/sweetalert2'

Injectable({
  providedIn: 'root',
})
export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = sessionStorage.getItem('role')
  if (token == 'admin') {
    return true
  }
  sweetalert2error('You are not admin!')
  router.navigate(['/login'])
  return false
}

export const posGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = sessionStorage.getItem('pos')
  if (token) {
    return true
  }
  sweetalert2error('Please Login System')
  router.navigate(['/pos'])
  return false
}
