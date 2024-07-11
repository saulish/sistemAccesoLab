
  //document.addEventListener('DOMContentLoaded', () => {

    async function tomarFotos(){
        const fotos=[];
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
            const photo = await detectFaceSave();
            fotos.push(photo);
            displayPhoto(photo);
          }
          addTraining(fotos);
    
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
            photosContainer.appendChild(img);

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


  async function loadDetecFaceModel() {
    return await blazeface.load();
  }

  let cont=0;
  async function detectFace() {
    const predictions = await modelDetectFace.estimateFaces(video, false);
  
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, 640, 480);
  
    if (predictions.length > 0) {
      cont++;
      console.log(cont);
      if (cont == 4) {
        try {
          const capturedImage = await detectFaceSave();
          makePrediction(capturedImage);
        } catch (error) {
          console.error('Error capturing face image:', error);
        }
        cont = 0;
      }
    } else {
      cont = 0;
    }
  }
  

  async function detectFaceSave() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const predictions = await modelDetectFace.estimateFaces(video, false);
  
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    if (predictions.length > 0) {
      const pred = predictions[0]; // Asumiendo que solo hay una cara a la vez
      const start = pred.topLeft;
      const end = pred.bottomRight;
      const size = [end[0] - start[0], end[1] - start[1]];
  
      // Ajustes para aumentar el tamaño del rectángulo
      const heightIncrease = size[1] * 0.5;
      const widthIncrease = size[0] * 0.15;
  
      const adjustedStartX = start[0] - widthIncrease / 2;
      const adjustedEndX = end[0] + widthIncrease / 2;
      const adjustedStartY = start[1] - heightIncrease / 2;
      const adjustedEndY = end[1] + heightIncrease / 2;
  
      ctx.beginPath();
      ctx.rect(adjustedStartX, adjustedStartY, adjustedEndX - adjustedStartX, adjustedEndY - adjustedStartY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'red';
      ctx.stroke();
  
      // Extraer la imagen del rectángulo de la cara
      const faceCanvas = document.createElement('canvas');
      const faceCtx = faceCanvas.getContext('2d');
      const faceWidth = adjustedEndX - adjustedStartX;
      const faceHeight = adjustedEndY - adjustedStartY;
      faceCanvas.width = faceWidth;
      faceCanvas.height = faceHeight;
  
      // Dibujar la imagen recortada en el nuevo canvas
      faceCtx.drawImage(
        video,
        adjustedStartX,
        adjustedStartY,
        faceWidth,
        faceHeight,
        0,
        0,
        faceWidth,
        faceHeight
      );
  
      // Aquí puedes manejar la imagen recortada como desees. Por ejemplo, puedes agregar el canvas al documento:
      document.body.appendChild(faceCanvas);
  
      return new Promise((resolve) => {
        faceCanvas.toBlob((blob) => {
          console.log("Entro");
          resolve(new File([blob], 'captured_image.png', { type: 'image/png' }));
        }, 'image/png');
      });
    }
  }
  


