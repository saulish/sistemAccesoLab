//FUNCIONES DEL MODELO

function crearModelo(){
  const model = tf.sequential();
  model.add(tf.layers.conv2d({
      inputShape: [32, 32, 3],
      filters:256,
      kernelSize: [3,3],
      activation: 'tanh'
  }));
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
  model.add(tf.layers.conv2d({
      filters: 128, 
      kernelSize: [3,3],
      activation: 'tanh'
  }));
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
  model.add(tf.layers.conv2d({
      filters: 256, 
      kernelSize: [3,3],
      activation: 'tanh'
  }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({
      units: 128, 
      activation: 'tanh'
  }));
  model.add(tf.layers.dropout({ rate: 0.5 })); 
  model.add(tf.layers.dense({
      units: 128,
      activation: 'relu'
  }));
  model.add(tf.layers.dense({
      units: 20,
      activation: 'softmax'
  }));
  


  model.compile({
      optimizer: tf.train.adam(0.0001),
      loss: 'sparseCategoricalCrossentropy',
      metrics: ['accuracy']
  });
  return model;
}
const model=crearModelo();


//MEZCLAR
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function loadImageFromBase64(base64) {
  const img = new Image();
  const promise = new Promise((resolve, reject) => {
    img.onload = () => {
      try {
        const tensor = tf.browser.fromPixels(img);
        resolve(tensor);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = (error) => reject(error);
    img.src = base64;
  });

  return promise;
}


//ENTRENAR POR CARPETA
async function startTraining() {
  const input = document.getElementById('image-folder');
  console.log(input.files);
  const status = document.getElementById('training-status');
  if (input.files.length === 0) {
    alert('Please select a folder of images.');
    return;
  }

  status.innerText = 'Loading training data...';
  const { X_train, y_train } = await loadTrainingData(input.files);
  console.log(y_train);
  status.innerText = 'Training model...';
  await model.fit(X_train, y_train, {
    epochs: 25,  // Ajusta el número de épocas según sea necesario
    batchSize: 4,  // Ajusta el tamaño del batch según sea necesario
    validationSplit: 0.5,  // Ajusta el split de validación según sea necesario
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}, accuracy = ${logs.acc}, val_loss = ${logs.val_loss}, val_accuracy = ${logs.val_acc}`);
        status.innerText = `Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}, val_loss = ${logs.val_loss.toFixed(4)}, val_accuracy = ${logs.val_acc.toFixed(4)}`;
      }
    }
  });
  status.innerText = 'Model trained successfully';
  console.log(model.summary());
  guardarModelo();

}


async function loadTrainingData(files) {
  const imageSize = 32;
  const labels = [];
  const images = [];
  
  for (const file of files) {
    const label = file.webkitRelativePath.split('/')[1]; // Obtener el nombre de la subcarpeta
    const image = await loadImage(file);
    const resizedImage = tf.image.resizeBilinear(image, [imageSize, imageSize]);
    labels.push(parseInt(label));
    images.push(resizedImage);

  }

  const indices = Array.from(images.keys());
  shuffle(indices);
  const shuffledImages = indices.map(i => images[i]);
  const shuffledLabels = indices.map(i => labels[i]);

  console.log(shuffledLabels);
  const X_train = tf.stack(shuffledImages);
  const y_train = tf.tensor1d(shuffledLabels, 'float32');

  return { X_train, y_train };
}




//ENTRENAR POR LAS FOTOS DE DRIVE
async function loadTrainingDataFromBase64(data) {
  console.log(data.length)
  const imageSize = 32;
  const labels = [];
  const images = [];

  for (const folder of data) {
    const label = folder.name; // Usar el nombre de la carpeta como etiqueta
    const promises = folder.photos.map(async (photo) => {
      try {
        const image = await loadImageFromBase64(photo.base64);
        const resizedImage = tf.image.resizeBilinear(image, [imageSize, imageSize]);
        return { resizedImage, label: parseInt(label) };
      } catch (error) {
        console.error(`Error al cargar la imagen ${photo.url}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    results.forEach((result) => {
      if (result) {
        labels.push(result.label);
        images.push(result.resizedImage);
      }
    });
  }

  const indices = Array.from(images.keys());
  shuffle(indices);
  const shuffledImages = indices.map(i => images[i]);
  const shuffledLabels = indices.map(i => labels[i]);

  const X_train = tf.stack(shuffledImages);
  const y_train = tf.tensor1d(shuffledLabels, 'float32'); // Ajuste de tipo de tensor para la etiqueta

  return { X_train, y_train };
}



async function startTrainingFromBase64(pageSize = 10) {
  const status = document.getElementById('training-status');
  let pageToken = null;
  let allData = [];

  while (true) {
    const response = await fetch(`https://script.google.com/macros/s/AKfycbzS5fxQ8OPZK8xzrLvgO66oSRAeiPPZmiwuUeUjkJ-TgAMLUoWm0en9ECQkzOe0aRyc/exec?pageSize=${pageSize}&pageToken=${pageToken}`);
    const data = await response.json();

    if (data.length === 0) {
      alert('No se encontraron imágenes en Google Drive.');
      break;
    }

    allData = allData.concat(data);
    if (data[0].nextPageToken) {
      pageToken = data[0].nextPageToken;
    } else {
      break;
    }
  }

  status.innerText = 'Cargando datos de entrenamiento...';
  const { X_train, y_train } = await loadTrainingDataFromBase64(allData);
  console.log(y_train);
  status.innerText = 'Entrenando el modelo...';

  await model.fit(X_train, y_train, {
    epochs: 15,  // Ajusta el número de épocas según sea necesario
    batchSize: 4,  // Ajusta el tamaño del batch según sea necesario
    validationSplit: 0.5,  // Ajusta el split de validación según sea necesario
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}, accuracy = ${logs.acc}, val_loss = ${logs.val_loss}, val_accuracy = ${logs.val_acc}`);
        status.innerText = `Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}, val_loss = ${logs.val_loss.toFixed(4)}, val_accuracy = ${logs.val_acc.toFixed(4)}`;
      }
    }
  });

  status.innerText = 'Modelo entrenado exitosamente';
}

async function loadImage(file) {
  const img = new Image();
  const reader = new FileReader();

  const promise = new Promise((resolve, reject) => {
    console.log()
    reader.onload = () => {
      img.src = reader.result;
      img.onload = () => {
        resolve(tf.browser.fromPixels(img));
      };

      img.onerror = reject;
    };

    console.log(file)
    reader.readAsDataURL(file);

  });

  return promise;
}


function guardarModelo(){
  if(confirm("¿Desea subir el modelo?")){
    saveModelAndUpload();

  }
}
