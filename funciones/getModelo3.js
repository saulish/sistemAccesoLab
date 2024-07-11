//BAJAR EL Y CARGAR EL MODELO DESDE DRIVE
const res=document.getElementById('result');
let modeloCargado=false;
let modelDetectFace;


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
        estadoModelo.innerText='Cargando modelo ***';

        model=modelitito;
        estadoModelo.innerText='Modelo cargado correctamente';
        modelDetectFace=await loadDetecFaceModel();

        await setupCamera();
        //setInterval(() => detectFace(), 1000);

        modeloCargado=true;
        const prueba=document.getElementById("horario");
        console.log(prueba)
        if(prueba==null) setInterval(() => detectFace(), 1000);

        
        const outputLayer = model.layers[model.layers.length - 1];

        // Obtener la cantidad de unidades en la capa de salida (número de clases)
        const numLabels = outputLayer.units;
        model.summary()
        console.log(`El modelo ha sido entrenado para reconocer ${numLabels} etiquetas.`);
        return numLabels;

        


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


async function bajarModelos(){
    modelDetectFace=await loadDetecFaceModel();
}

// Llamada a la función con el ID del archivo y la URL del script de Google Apps Script
const scriptURL = 'https://script.google.com/macros/s/AKfycbxhYnQPIcvAlcPTL45GDuh_-7szvsPDxwOycXlOOm6CeVwDGPWmZCWI4m4bmwETT8Llqg/exec';

loadModelFromGoogleDrive(scriptURL);
