Quagga.onDetected(function(result) {
    const scannedCode = result.codeResult.code;
    
    // Display the scanned result on the page
    document.getElementById('scanned-result').textContent = scannedCode;
    
    // Send the scanned code to the backend for storage
   fetch('https://qrscanner-6dow.onrender.com/submit', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ codes: scannedCodes, vehicleNumber: vehicleNumber })
})

    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function startCamera(index) {
    if (videoElements[index]) {
        videoElements[index].style.display = 'block';
        startCameraButtons[index].style.display = 'none';
        codeReader
            .listVideoInputDevices()
            .then(videoInputDevices => {
                const firstDeviceId = videoInputDevices[0].deviceId;
                codeReader.decodeFromVideoDevice(firstDeviceId, videoElements[index].id, (result, err) => {
                    if (result) {
                        scannedResultElements[index].textContent = result.text;
                        scannedCodes[index] = result.text;
                        videoElements[index].style.display = 'none'; // Hide camera after scanning
                        console.log(`Scanned result ${index + 1}:`, result.text);
                    }
                    if (err && !(err instanceof ZXing.NotFoundException)) {
                        console.error(err);
                    }
                });
            })
            .catch(err => console.error(err));
    } else {
        console.error(`Video element not found for index ${index}`);
    }
}


const videoElements = [
    document.getElementById('video-1'),
    document.getElementById('video-2'),
    document.getElementById('video-3'),
    document.getElementById('video-4'),
    document.getElementById('video-5'),
    document.getElementById('video-6')
];

const startCameraButtons = [
    document.getElementById('start-camera-1'),
    document.getElementById('start-camera-2'),
    document.getElementById('start-camera-3'),
    document.getElementById('start-camera-4'),
    document.getElementById('start-camera-5'),
    document.getElementById('start-camera-6')
];

