//BAJAR EL Y CARGAR EL MODELO DESDE DRIVE
const res=document.getElementById('result');
let modeloCargado=false;

async function loadModelFromGoogleDrive(scriptURL) {
    const estadoModelo=document.getElementById('modelStatus');

    try {
        estadoModelo.innerText='Cargando modelo *';

        const response = await fetch(scriptURL);
        estadoModelo.innerText='Cargando modelo **';

        const data = await response.json();


        const binaryString = atob(data.content);

        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Parsear el contenido decodificado como JSON
        const jsonString = new TextDecoder().decode(bytes);
        const artifactsData = JSON.parse(jsonString);
        //console.log('Datos del archivo:', decodeWeightData(modelArtifacts['weightData']));

        const modelArtifacts = {
            modelTopology: artifactsData.modelTopology,
            weightSpecs: artifactsData.weightSpecs,
            weightData: decodeWeightData(artifactsData['weightData']),
        };
    
        // Reconstruir el modelo desde el JSON y los pesos
        const modelitito = await tf.loadLayersModel(tf.io.fromMemory(
            modelArtifacts.modelTopology,
            modelArtifacts.weightSpecs,
            modelArtifacts.weightData
        ));
        model=modelitito;
        estadoModelo.innerText='Modelo cargado correctamente';
        modeloCargado=true;

        


    } catch (error) {
        console.error('Error al cargar el modelo:', error);
    }
}

function decodeWeightData(weightDataBase64) {
    // Decodificar el contenido desde base64
    const binaryString = atob(weightDataBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}



  
// Llamada a la función con el ID del archivo y la URL del script de Google Apps Script
const scriptURL = 'https://script.google.com/macros/s/AKfycbypkzjtGFKjtqcprtxYg0sTVvmexPq_ew_vPvInzGs0aqBnt0jFZ_KWkgbqjgaiw9x4qQ/exec';

loadModelFromGoogleDrive(scriptURL);
