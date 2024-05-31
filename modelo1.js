// Definir el modelo
let keyModel;
function createModel(){
  const model = tf.sequential();
  model.add(tf.layers.conv2d({
      inputShape: [32, 32, 3],
      filters: 128,
      kernelSize: 3,
      activation: 'tanh'//relu//sigmoid
  }));
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
  model.add(tf.layers.conv2d({
      filters: 64,
      kernelSize: 3,
      activation: 'tanh'
  }));
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
  model.add(tf.layers.conv2d({
      filters: 512,
      kernelSize: 3,
      activation: 'tanh'
  }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({
      units: 128,
      activation: 'tanh'
  }));
  model.add(tf.layers.dropout({ rate: 0.5 }));  // Agrega Dropout
  model.add(tf.layers.dense({
        units: 128,
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
      units: 20,
      activation: 'softmax'
    }));
    
    // Compilar el modelo
    model.compile({
      optimizer: tf.train.adam(0.0001),
      loss: 'sparseCategoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
}
let model=createModel();
  // Definir el modelo

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Leer y procesar imágenes desde la carpeta seleccionada
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
  
  // Función para cargar una imagen y convertirla a tensor
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
  
  // Función para iniciar el entrenamiento del modelo
  async function startTraining() {
    const input = document.getElementById('image-folder');
    console.log(input.files);
    const status = document.getElementById('status');
    if (input.files.length === 0) {
      alert('Please select a folder of images.');
      return;
    }
    
    status.innerText = 'Loading training data...';

    
        const { X_train, y_train } = await loadTrainingData(input.files);
        console.log(y_train);
        status.innerText = 'Training model...';
        await model.fit(X_train, y_train, {
          epochs: 15,  // Ajusta el número de épocas según sea necesario
          batchSize: 4,  // Ajusta el tamaño del batch según sea necesario
          validationSplit: 0.5,  // Ajusta el split de validación según sea necesario
          callbacks: {
            onEpochEnd: (epoch, logs) => {
              console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}, accuracy = ${logs.acc}, val_loss = ${logs.val_loss}, val_accuracy = ${logs.val_acc}`);
              status.innerText = `Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}, val_loss = ${logs.val_loss.toFixed(4)}, val_accuracy = ${logs.val_acc.toFixed(4)}`;
              loss=  logs.val_acc.toFixed(4);
            }

          }

        });
    

  
    status.innerText = 'Model trained successfully';
    trainToPred();
  }
  
  // Función para hacer una predicción con una nueva imagen
  async function makePrediction() {
    const input = document.getElementById('predict-image');
    if (input.files.length === 0) {
      alert('Please select an image to predict.');
      return;
    }
  
    const file = input.files[0];
    const image = await loadImage(file);
    const resizedImage = tf.image.resizeBilinear(image, [32, 32]);
    const inputTensor = resizedImage.expandDims(0);
  
    const prediction = model.predict(inputTensor);
    const predictedClass = (await prediction.argMax(-1).data())[0];
    console.log(predictedClass);
    hacerCheckRecibir(null,null, null, predictedClass)
    document.getElementById('status').innerText = `Predicted class: ${predictedClass}`;

  }
  

 function trainToPred(){
    const archivo=document.getElementById('carpeta');
    archivo.style.zIndex=-1
    const imagen=document.getElementById('imagen')
    imagen.style.zIndex=1
  }

