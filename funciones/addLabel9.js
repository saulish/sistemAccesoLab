let global_X_train;
let global_y_train;

async function addTraining(fotos){
    console.log(fotos);
    console.log('Reentrenando modelo con nuevas fotos')
    const valueLabel=document.getElementById('facialV');


    //Congelar las capas previas para evitar problemas

    
    for (let i = 0; i < model.layers.length - 1; i++) {
        model.layers[i].trainable = true;
    }

    const outputLayer = model.layers[model.layers.length - 1];

    // Obtener la cantidad de unidades en la capa de salida (número de clases)
    const numLabels = outputLayer.units;
    valueLabel.setAttribute('value',numLabels);

    const { X_new, y_new } = await loadCarpetaFotos([], fotos, numLabels);
    const  {X_old, y_old}=await loadTensorsFromDrive();


    const {X_train, y_train}= await combineDatasets(X_new,y_new,X_old,y_old);

    //const {X_train, y_train}= await pruebaMezclar(x_data,y_data);


    
    console.log(y_train.arraySync())
    global_X_train=X_train
    global_y_train=y_train
    console.log('Shape of y_new:', y_new.shape);
    console.log('Shape of y_old:', y_old.shape);
    console.log('Shape of y_train:', y_train.shape);
    const {shuffledX, shuffledY} = await pruebaMezclar(X_train,y_train);


    await reEntrenar(shuffledX,shuffledY,numLabels);

}



async function pruebaMezclar(x,y){
    if (x.shape[0] !== y.shape[0]) {
        throw new Error('Las dimensiones de x e y no coinciden');
    }

    const numSamples = x.shape[0];

    // Generar un array de índices de 0 a numSamples - 1
    const indices = Array.from({ length: numSamples }, (_, i) => i);

    // Barajar los índices usando Fisher-Yates
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Crear un tensor a partir de los índices barajados
    const shuffledIndices = tf.tensor1d(indices, 'int32');

    // Reordenar x e y usando los índices barajados
    const shuffledX = tf.gather(x, shuffledIndices);
    const shuffledY = tf.gather(y, shuffledIndices);
    console.log(shuffledY)
    return {shuffledX, shuffledY};
    
}
async function reEntrenar(X_train,y_train,numLabels){
    console.log("Estructura del modelo antes de modificar:");
    model.summary();

    model.layers.pop();

    // Crear una nueva entrada del modelo
    const input = model.input;
    
    // Obtener la salida de la penúltima capa
    const output = model.layers[model.layers.length - 1].output;
    
    // Añadir la nueva capa de salida con 4 unidades
    const newOutput = tf.layers.dense({
        units: numLabels + 1, // numLabels + 1 sería 4 en este caso
        activation: 'softmax',
        name: 'denseF_' + (numLabels + 1)
    }).apply(output);
    
    // Crear un nuevo modelo
    const newModel = tf.model({
        inputs: input,
        outputs: newOutput
    });
    
    // Compilar el nuevo modelo
    newModel.compile({
        optimizer: tf.train.adam(0.00001),
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy']
    });
    model=newModel;
    model.summary();
    console.log(y_train)
    console.log(y_train.shape)
    console.log(y_train.arraySync())
    
    const oneHotLabels = tf.oneHot(y_train.arraySync(), numLabels+1); 

    oneHotLabels.print();




    const status=document.getElementById('modelStatus');
    const k = 2;
    const numSamples = X_train.shape[0];
    const foldSize = Math.floor(numSamples / k);
    
    for (let i = 0; i < k; i++) {
        const valStart = i * foldSize;
        const valEnd = valStart + foldSize;
        const X_val = X_train.slice([valStart, 0], [foldSize, -1]);
        const y_val = y_train.slice([valStart], [foldSize]);
    
        const X_trainFold = tf.concat([X_train.slice([0, 0], [valStart, -1]), X_train.slice([valEnd, 0], [numSamples - valEnd, -1])]);
        const y_trainFold = tf.concat([y_train.slice([0], [valStart]), y_train.slice([valEnd], [numSamples - valEnd])]);
    
        await model.fit(X_trainFold, y_trainFold, {
            epochs: 30,  // Ajusta el número de épocas según sea necesario
            batchSize: 4,  // Ajusta el tamaño del batch según sea necesario
            validationData: [X_val, y_val],  // Usar validationData en lugar de validationSplit
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(`Fold ${i + 1}, Epoch ${epoch + 1}: loss = ${logs.loss}, accuracy = ${logs.acc}, val_loss = ${logs.val_loss}, val_accuracy = ${logs.val_acc}`);
                    status.innerText = `Fold ${i + 1}, Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}, val_loss = ${logs.val_loss.toFixed(4)}, val_accuracy = ${logs.val_acc.toFixed(4)}`;
                },
                onTrainEnd: () => {
                    console.log('Entrenamiento terminado');
                },
                onTrainBegin: () => {
                    console.log('Entrenamiento iniciado');
                },
                onEpochBegin: (epoch, logs) => {
                    console.log(`Inicio de la época ${epoch + 1}`);
                },
                onBatchEnd: (batch, logs) => {
                    console.log(`Batch ${batch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
                }
            }
        });
    }
    console.log("Estructura del modelo después de modificar:");
    model.summary();
    

    status.innerText='Modelo actualizado (no subido)';
    console.log('Modelo actualizado para detectar '+model.layers[model.layers.length - 1].units)
    if(confirm('Deseas sobreescribir el modelo?')){
         saveTensorsToDrive(global_X_train,global_y_train);
        //console.log(global_X_train,global_y_train)
        await saveModelAndUpload();
        status.innerText='Modelo actualizado y subido';
    }
}



    
async function combineDatasets(X_new, y_new, X_old, y_old) {

    
    console.log(y_new.arraySync())
    console.log(y_old.arraySync())
    // Concatenar los nuevos y viejos datasets
    const X_train = tf.concat([X_old, X_new]);
    const y_train = tf.concat([y_old, y_new]);




    return { X_train, y_train};
}
async function loadTensorsFromDrive() {
    // URL of your Google Apps Script Web App
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwF6yZ7BY6GCOQGNx4I_Muy6Ib0bPgtBK8W-mriFP8PKQZUBQqOhgzLjPorm4SczDUu1w/exec';

    // Fetch the data from Google Apps Script
    const response = await fetch(scriptURL, {
        method: 'GET',
    });

    const result = await response.json();

    if (result.result === 'error') {
        throw new Error(result.error);
    }

    // Parse the data to tensors
    const X_train_array = result.X_train;
    const y_train_array = result.y_train;

    const X_old = tf.tensor(X_train_array);
    const y_old = tf.tensor(y_train_array);

    return { X_old, y_old };
}



async function saveTensorsToDrive(X_train, y_train) {
    // Convert tensors to arrays
    const X_train_array = X_train.arraySync();
    const y_train_array = y_train.arraySync();

    // Convert arrays to JSON
    const data = {
        X_train: X_train_array,
        y_train: y_train_array
    };

    // URL of your Google Apps Script Web App
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxOGveRvtq7xur8jz-My-9mkl7ZtT9kg048FoOVFU6qnHDiFFoQcv9s1o-kXfZ1Uft0/exec';

    // Send data to Google Apps Script
    const response = await fetch(scriptURL, {
        redirect: 'follow',
        method: 'POST',
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(data),
        mode: 'cors'
    });

    const result = await response.json();
    console.log(result);
}



async function loadCarpetaFotos(files, capturedPhotos, newLabel) {
    const imageSize = 32;
    const labels = [];
    const images = [];

    // Procesar archivos de la carpeta
    for (const file of files) {
        const label = file.webkitRelativePath.split('/')[1]; // Obtener el nombre de la subcarpeta
        const image = await loadImage(file);
        const resizedImage = tf.image.resizeBilinear(image, [imageSize, imageSize]);
        labels.push(parseInt(label));
        images.push(resizedImage);
    }
    console.log("1: "+labels)
    // Procesar fotos capturadas
    for (const photo of capturedPhotos) {
        const image = await loadImageFromBlob(photo);
        const resizedImage = tf.image.resizeBilinear(image, [imageSize, imageSize]);
        labels.push(newLabel); // Etiqueta para las nuevas fotos
        images.push(resizedImage);
    }
    console.log("2: "+labels)

    // Mezclar las imágenes y etiquetas
    const indices = Array.from(images.keys());
    shuffle(indices);
    const shuffledImages = indices.map(i => images[i]);
    const shuffledLabels = indices.map(i => labels[i]);

    // Convertir las imágenes y etiquetas en tensores
    const X_new = tf.stack(shuffledImages);
    const y_new = tf.tensor1d(shuffledLabels, 'int32');

    return { X_new, y_new };
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

async function loadImageFromBlob(blob) {
    const img = new Image();
    const promise = new Promise((resolve, reject) => {
        img.src = URL.createObjectURL(blob);
        img.onload = () => {
            resolve(tf.browser.fromPixels(img));
        };
        img.onerror = reject;
    });

    return promise;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


    /*
    LO QUE EL CODIGO DEBE HACER EN PASOS
    1-. EL MODELO DEBE DE SER CONGELADO YA QUE SUPONEMOS QUE ES UN MODELO CHINGON QUE PUEDE HACERLO TODO, ENTONCES SOLO NECESITA CAMBIAR LA ULTIMA CAPA
    2-. ELIMINAR LA ULTIMA CAPA Y AÑADIR LA NUEVA CON LA CANTIDA DE LABELS QUE LLEVAMOS
    (LOS LABELS VAN HARDOCDED AHORITA PERO LUEGO LO SACAMOS DEL ARCHIVO DE DRIVE DE LOS LABELS)



    3-. EL CODIGO DEBE DE BAJAR DE DRIVE LOS LOS LABELS Y LA DATA, SIENDO QUE PREVIAMENTE SE DUBIERON SUBIR
    2.9-. SE DEBE DE TOMAR X_TRAIN E Y_TRAIN Y PODER SUBIRLOS A DRIVE, ESTO TOMANDO EN CUENTA QUE NO VAYA CON MIS FOOTOS PARA PROBAR

    HASTA AQUI SE HIZO

    4-.UNA VEZ TOMADA LA DATA DESDE EL DRIVE, SE DEBE DE TOMAR LAS 3 FOTOS QUE NECESITA EL MODELO Y PASARLAS POR loadTrainingData PARA PODER OBTENER LA DATA
    DEL NUEVO LABEL
    5-. UNA VEZ OBTENIDA DEBEMOS DE COMBINARLA CON LA DATA TOMADA DE DRIVE PARA ASÍ TENER LA DATA COMPLETA DE LOS LABELS PREVIOS MAS EL NUEVO
    6-. CON ESTO ENTRENAMOS EL MODELO TOMANDO EN CUENTA QUE LAS CAPAS PREVIAS NO CAMBIAN POR CONGELAMIENTO Y SOLO SE REENTRENA LA ULTIMA CAPA DE RECONOMIENTO
    7-. UNA VEZ LISTO, DEBE SER SUBIDO EL MODELO A DRIVE, ASÍ COMO LAS NUEVOS X_TRAIN E Y_TRAIN PARA PODER SER USADOS EN OTRO CICLO DE NUEVO LABEL
    */