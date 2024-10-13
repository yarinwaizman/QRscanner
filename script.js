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
}

