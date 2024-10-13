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
        body: JSON.stringify({ code: scannedCode })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
