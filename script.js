document.addEventListener('DOMContentLoaded', () => {
    const resultContainer = document.getElementById('qr-reader-results');
    const submitButton = document.getElementById('submit');
    const vehicleNumberInput = document.createElement('input');  // Add this input in your HTML if necessary
    const startCameraButton = document.getElementById('start-camera');
    let scannedCodes = [];

    function onScanSuccess(decodedText, decodedResult) {
        console.log(`Code matched = ${decodedText}`, decodedResult);
        resultContainer.innerText = `Scanned Code: ${decodedText}`;

        scannedCodes.push(decodedText);
        submitButton.disabled = false;
    }

    function onScanError(errorMessage) {
        console.log(`Error scanning QR Code: ${errorMessage}`);
    }

    const html5QrCode = new Html5Qrcode("qr-reader");
    const qrCodeScannerConfig = {
        fps: 10,
        qrbox: 250
    };

    startCameraButton.addEventListener('click', () => {
        console.log('Starting camera...');
        html5QrCode.start(
            { facingMode: "environment" },
            qrCodeScannerConfig,
            onScanSuccess,
            onScanError
        ).then(() => {
            console.log('Camera started');
        }).catch(err => {
            console.error(`Unable to start QR code scanner: ${err}`);
        });
    });

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
                alert("Data saved successfully!");
                location.reload();
            })
            .catch(error => console.error('Error:', error));
        } else {
            console.log("No scanned codes or vehicle number to submit.");
        }
    });

    console.log('DOM fully loaded and parsed');
});
