import Swal from 'sweetalert2';

export const networkErrorAlert = (
  content = '네트워크 에러<br/>다시 시도해주세요'
) => {
  Swal.fire({
    position: 'top-end',
    title: `${content}`,
    imageUrl: '/images/errorImage.png',
    imageWidth: 100,
    imageHeight: 100,
    showConfirmButton: false,
    timer: 1500,
    padding: '2rem 0rem 2rem',
  });
};

export const defaultAlert = (content: string) => {
  Swal.fire({
    title: `${content}`,
    confirmButtonColor: '#A7C2E4',
    color: '#809dc1',
    background: 'rgba(228, 245, 255, 0.9)',
    width: 400,
    padding: '2rem 0rem 2rem',
  });
};
