import Swal from 'sweetalert2';

export default function sweetalert2error(error: string) {
  Swal.fire({
    icon: 'error',
    title: 'Fail',
    text: error,
    heightAuto: false,
  });
}
