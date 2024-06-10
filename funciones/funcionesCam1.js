
  //document.addEventListener('DOMContentLoaded', () => {

    async function tomarFotos(){

        const photosContainer = document.getElementById('photos');
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
    
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
                video.play();
            })
            .catch(err => {
                console.error('Error al acceder a la cámara: ', err);
            });
          for (let i = 0; i < 3; i++) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const photo = await capturePhoto();
            displayPhoto(photo);
          }
  
    
        function capturePhoto() {
            return new Promise((resolve) => {
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/png');
            });
        }
    
        function displayPhoto(blob) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(blob);
            img.width = 200; // Ajusta el tamaño de la imagen si es necesario
            img.height = 100; // Ajusta el tamaño de la imagen si es necesario
            if(photosContainer){
                photosContainer.appendChild(img);
            }
        }
    }


async function setupCamera() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }
  
  async function capturePhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob], 'captured_image.png', { type: 'image/png' }));
      }, 'image/png');
    });
  }
  
  function clearImageFields() {

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  