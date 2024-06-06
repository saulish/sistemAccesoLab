//SUBIR EL MODELO A DRIVE


async function saveModelAndUpload() {
    await model.save('indexeddb://modeloPendejo');
    console.log('Peso de modelo');
    console.log(model.getWeights()[0].arraySync());
    saveModelToGoogleDrive();

}
async function saveModelToGoogleDrive(modelName='modeloPendejo', scriptURL='https://script.google.com/macros/s/AKfycbw9S9lIe0S-J2lgWqhucGqBIm5kjXpTPQdl6iAJeMkgkCOt9gTmRvYgPIv7bCFMAVD9Hg/exec') {
  try {
      const modelJson = await model.save(tf.io.withSaveHandler(async (artifacts) => {
        return artifacts;
    }));

    const weightDataBuffer = modelJson.weightData;

    // Combinar la topología del modelo y los pesos en un objeto
    const modelArtifacts = {
        modelTopology: modelJson.modelTopology,
        weightSpecs: modelJson.weightSpecs,
        weightData: weightDataBuffer,
    };


    function encodeWeightData(weightData) {
        const CHUNK_SIZE = 0x8000; // Tamaño de los fragmentos para evitar desbordamientos de pila
        const bytes = new Uint8Array(weightData);
        let binaryString = '';
    
        for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
            binaryString += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK_SIZE));
        }
    
        return btoa(binaryString);
    }
    
    const weightDataBase64 = encodeWeightData(modelArtifacts.weightData);

    const modelBlob = new Blob([JSON.stringify({
        modelTopology: modelArtifacts.modelTopology,
        weightSpecs: modelArtifacts.weightSpecs,
        weightData: weightDataBase64
    }), ], { type: 'application/json' });
      
    
    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64Data = reader.result.split(',')[1];
    
          const response = await fetch(scriptURL, {
              redirect: 'follow',
              method: 'POST',
              headers: {
                "Content-Type": "text/plain;charset=utf-8",
              },
              body: JSON.stringify({
                  fileName: modelName + '.json',
                  mimeType: 'application/json',
                  content: base64Data
              }),
              mode: 'cors'
          });
    
        const result = await response.json();
        if (result.result === 'success') {
            console.log('Archivo subido con éxito a Google Drive:', result.fileId);
        } else {
            console.error('Error al subir el archivo:', result.message);
        }
    };
    reader.readAsDataURL(modelBlob);


  } catch (error) {
      console.error('Error al guardar el modelo en Google Drive:', error);
  }
}








