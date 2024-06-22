import {hacerCheckRecibir, hacerCheck} from '/funciones/funciones1.js';
let model;
let modeloCargado=false;
export function setNewModel(newModel){
  model=newModel;
  modeloCargado=true;
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
  
  async function loadImage(file) {
    const img = new Image();
    const reader = new FileReader();
  
    const promise = new Promise((resolve, reject) => {
      reader.onload = () => {
        img.src = reader.result;
        img.onload = () => {
          resolve(tf.browser.fromPixels(img));
        };
        img.onerror = reject;
      };
      reader.readAsDataURL(file);
    });
  
    return promise;
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('capture-button').addEventListener('click', async () => {
        if(!modeloCargado){
          const estadoModelo=document.getElementById('modelStatus');
          estadoModelo.innerText='El modelo no ha sido cargado';
        }else{
          const capturedImage = await capturePhoto();
          makePrediction(capturedImage);
        }

    });
});


  


  async function makePrediction(file) {
    
    if (!file) {
      alert('No se ha seleccionado ninguna imagen');
      return;
    }

    try{ 

        const image = await loadImage(file);

        const resizedImage = tf.image.resizeBilinear(image, [32, 32]);
        const inputTensor = resizedImage.expandDims(0);
    
        const prediction = model.predict(inputTensor);
        const predictedClass = (await prediction.argMax(-1).data())[0];
    
        //document.getElementById('prediction-result').innerText = `Predicted class: ${predictedClass}`;
        //result.innerText = `Predicted class: ${predictedClass}`;
        clearImageFields();
        console.log(predictedClass);
        document.getElementById('capture-button').setAttribute('value', predictedClass);
        document.getElementById('status').innerText = `Clase: ${predictedClass}`;
        //hacerCheckRecibir(null,null,null,predictedClass);
        }catch(error){
            console.log(error)
        }
  }
