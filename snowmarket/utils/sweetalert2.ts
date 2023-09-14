import Swal from 'sweetalert2'

export function sweetalert2error(error: string) {
  Swal.fire({
    icon: 'error',
    title: 'Fail',
    text: error,
    heightAuto: false,
  })
}

export function sweetalert2Success(msg: string) {
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: msg,
    heightAuto: false,
    didClose: () => {
      return
    },
  })
}
