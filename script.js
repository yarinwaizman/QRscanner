document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit');
    const vehicleNumberInput = document.getElementById('vehicle-number');
    let scannedCodes = Array(6).fill('');

    function onScanSuccess(decodedText, index) {
        console.log(`QR Code Scanned: ${decodedText}`);
        document.getElementById(`qr-reader-results-${index}`).innerText = `Scanned Code: ${decodedText}`;
        scannedCodes[index] = decodedText;
        submitButton.disabled = false;

        // Hide the video element after scanning
        document.getElementById(`qr-reader-${index}`).style.display = 'none';
    }

    function createScanner(index) {
        const qrReader = document.getElementById(`qr-reader-${index}`);
        document.getElementById(`start-camera-${index}`).addEventListener('click', () => {
            qrReader.style.display = 'block'; // Show the camera when the scan starts
            const codeReader = new ZXing.BrowserQRCodeReader();
            console.log('QR code reader initialized');

            codeReader.getVideoInputDevices()
                .then((videoInputDevices) => {
                    console.log('Available video input devices:', videoInputDevices);
                    
                    const rearCamera = videoInputDevices.find(device => device.label.toLowerCase().includes('back')) || 
                                        videoInputDevices.find(device => device.label.toLowerCase().includes('environment')) || 
                                        videoInputDevices[0];

                    console.log('Using camera:', rearCamera);
                    
                    codeReader.decodeFromVideoDevice(rearCamera.deviceId, qrReader, (result, err) => {
                        if (result) {
                            console.log(result);
                            onScanSuccess(result.text, index);
                            codeReader.reset();
                        }
                        if (err && !(err instanceof ZXing.NotFoundException)) {
                            console.error(err);
                            document.getElementById(`qr-reader-results-${index}`).textContent = `Error: ${err}`;
                        }
                    }, {
                        facingMode: { exact: "environment" }
                    });
                })
                .catch((err) => {
                    console.error(err);
                    document.getElementById(`qr-reader-results-${index}`).textContent = `Error: ${err}`;
                });
        });
    }

    for (let i = 0; i < 6; i++) {
        createScanner(i);
    }

    submitButton.addEventListener('click', () => {
        const vehicleNumber = vehicleNumberInput.value;
        if (scannedCodes.some(code => code) && vehicleNumber) {
            console.log("Submitting codes:", scannedCodes, "Vehicle number:", vehicleNumber);
            fetch('https://qrscanner-6dow.onrender.com/API/save_scans.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codes: scannedCodes, vehicleNumber: vehicleNumber })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert("Data saved successfully!");
                location.reload(); // Reload the page after submission
            })
            .catch(error => console.error('Error:', error));
        } else {
            console.log("No scanned codes or vehicle number to submit.");
        }
    });
    
    console.log('DOM fully loaded and parsed');
});
