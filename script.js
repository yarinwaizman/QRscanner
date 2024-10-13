document.addEventListener('DOMContentLoaded', () => {
    const scannersContainer = document.getElementById('scanners');
    const submitButton = document.getElementById('submit');
    const vehicleNumberInput = document.getElementById('vehicle-number');
    
    let scannedCodes = Array(6).fill('');  // Array to store scanned codes from all scanners

    // Function to handle successful scan
    function onScanSuccess(decodedText, index) {
        console.log(`Code matched = ${decodedText}`);
        document.getElementById(`output-${index}`).innerText = decodedText;
        scannedCodes[index] = decodedText;
        if (scannedCodes.some(code => code)) {
            submitButton.disabled = false;
        }
    }

    // Function to handle scanning error
    function onScanError(errorMessage) {
        console.log(`Error scanning QR Code: ${errorMessage}`);
    }

    // Function to create a scanner row
    function createScanner(index) {
        const container = document.createElement('div');
        container.className = 'scanner-container';
        container.innerHTML = `
            <div class="camera-icon" id="start-camera-${index}">&#x1F4F7; Scan</div>
            <div id="qr-reader-${index}" style="width:100%; max-width:500px; display:none;"></div>
            <div id="qr-reader-results-${index}"></div>
        `;
        scannersContainer.appendChild(container);
    
        const startCameraButton = document.getElementById(`start-camera-${index}`);
        const qrReader = document.getElementById(`qr-reader-${index}`);
        const html5QrCode = new Html5Qrcode(`qr-reader-${index}`);
    
        startCameraButton.addEventListener('click', () => {
            qrReader.style.display = 'block';
    
            // Now that the element is rendered, calculate its width
            const containerWidth = qrReader.offsetWidth;
            
            // Ensure qrbox is not larger than container
            const qrCodeScannerConfig = {
                fps: 10,
                qrbox: Math.min(300, containerWidth * 0.9)  // Set qrbox to 80% of container width or max 250px
            };
    
            console.log(`Starting camera ${index} with qrbox size: ${qrCodeScannerConfig.qrbox}...`);
            
            html5QrCode.start(
                { facingMode: "environment" },
                qrCodeScannerConfig,
                (decodedText) => onScanSuccess(decodedText, index),
                onScanError
            ).then(() => {
                console.log(`Camera ${index} started`);
            }).catch(err => {
                console.error(`Unable to start QR code scanner ${index}: ${err}`);
            });
        });
    }
    
    // Create six scanners
    for (let i = 0; i < 6; i++) {
        createScanner(i);
    }

    // Submit button functionality
    submitButton.addEventListener('click', () => {
        const vehicleNumber = vehicleNumberInput.value;
        if (scannedCodes.some(code => code) && vehicleNumber) {
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
