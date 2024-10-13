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

document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('video');
    const startCameraButton = document.getElementById('start-camera');
    
    startCameraButton.addEventListener('click', startRearCamera);

    function stopExistingVideo(videoElement) {
        if (videoElement.srcObject) {
            let tracks = videoElement.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoElement.srcObject = null;
        }
    }

    function startRearCamera() {
        stopExistingVideo(videoElement);

        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('back')) || videoDevices[0];
                const constraints = {
                    video: { deviceId: rearCamera.deviceId ? { exact: rearCamera.deviceId } : undefined, facingMode: 'environment' }
                };
                return navigator.mediaDevices.getUserMedia(constraints);
            })
            .then(stream => {
                videoElement.srcObject = stream;
                videoElement.play();
            })
            .catch(err => {
                console.error('Error accessing camera:', err);
                alert('Unable to access the rear camera. Please ensure camera permissions are enabled.');
            });
    }
});




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

submitButton.addEventListener('click', () => {
    const vehicleNumber = vehicleNumberInput.value;
    if (scannedCodes.length > 0 && vehicleNumber) {
        console.log("Submitting codes:", scannedCodes, "Vehicle number:", vehicleNumber);
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
            alert("Data saved successfully!"); // Display message box
            location.reload(); // Reload the page
        })
        .catch(error => console.error('Error:', error));
    } else {
        console.log("No scanned codes or vehicle number to submit.");
    }
});

