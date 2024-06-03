//Facial
async function setupCamera(selectedDeviceId) {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined
        }
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function getCameraDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoSelect = document.getElementById('videoSource');
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    videoSelect.innerHTML = ''; // Clear previous options
    videoDevices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Camera ${videoSelect.length + 1}`;
        videoSelect.appendChild(option);
    });
    videoSelect.onchange = () => {
        startVideo();
    };
}

async function startVideo() {
    const videoSelect = document.getElementById('videoSource');
    await setupCamera(videoSelect.value);
}

async function detectFace() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    return new Promise((resolve) => {
        const detectionInterval = setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
            if (detections.length > 0) {
                clearInterval(detectionInterval);
                resolve();
            }
        }, 100);
    });
}

function takePhoto(video, canvas) {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    downloadPhoto(dataUrl);
}

function downloadPhoto(dataUrl) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'photo.png';
    link.click();
}

async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/../models');
    await getCameraDevices();
    startVideo();
}

async function iniciarDeteccionFacial() {
    await detectFace();
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    takePhoto(video, canvas);
}

loadModels();