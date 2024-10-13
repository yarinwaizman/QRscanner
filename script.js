document.addEventListener('DOMContentLoaded', () => {
    const resultContainer = document.getElementById('qr-reader-results');
    const submitButton = document.getElementById('submit');
    const vehicleNumberInput = document.getElementById('vehicle-number');

    let scannedCodes = [];

    function onScanSuccess(decodedText, decodedResult) {
        // Display the scanned result on the page
        console.log(`Code matched = ${decodedText}`, decodedResult);
        resultContainer.innerText = `Scanned Code: ${decodedText}`;

        // Store scanned codes
        scannedCodes.push(decodedText);

        // Enable submit button
        submitButton.disabled = false;
    }

    function onScanError(errorMessage) {
        // Handle the error
        console.log(`Error scanning QR Code: ${errorMessage}`);
    }

    // Initialize the QR code scanner
    const html5QrCode = new Html5Qrcode("qr-reader");

    const qrCodeScannerConfig = {
        fps: 10,    // Scanning frequency in frames per second
        qrbox: 250, // Dimension of QR Code scanning box
    };

    html5QrCode.start(
        { facingMode: "environment" },  // Prefer rear camera
        qrCodeScannerConfig,
        onScanSuccess,
        onScanError
    ).catch(err => {
        console.error(`Unable to start QR code scanner: ${err}`);
    });

    // Submit button click handler
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
});
