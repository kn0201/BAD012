import Swal from 'sweetalert2'

export function sweetalert2error(error: any) {
  Swal.fire({
    title: 'Error!',
    text: error,
    icon: 'error',
    confirmButtonColor: '#ffa065',
    heightAuto: false,
  })
}

export function sweetalert2Success(msg: string) {
  Swal.fire({
    title: 'Done!',
    text: msg,
    icon: 'success',
    confirmButtonColor: '#ffa065',
    confirmButtonText: 'OK',
    heightAuto: false,
  })
}
