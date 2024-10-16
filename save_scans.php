<?php
// CORS headers to allow requests from your frontend
header('Access-Control-Allow-Origin: https://yarinwaizman.github.io'); // Replace with your frontend URL
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Connect to MySQL database
    $servername = "localhost";  // Use your actual database host
$username = "root";
$password = "Yy@201096207174160!Waizman?";
$dbname = "qr_scanner_db";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]));
    }

    // Get the JSON input
    $data = json_decode(file_get_contents("php://input"), true);

    // Extract the vehicle number and scanned codes
    $vehicle_number = $data['vehicleNumber'];
    $scanned_codes = $data['codes'];

    // Check for missing inputs
    if (!$vehicle_number || empty($scanned_codes) || !is_array($scanned_codes)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
        http_response_code(400);
        exit;
    }

    // Insert each scanned code into the database
    $stmt = $conn->prepare("INSERT INTO scans (vehicle_number, scanned_code, created_at) VALUES (?, ?, NOW())");
    
    foreach ($scanned_codes as $code) {
        if (!empty($code)) {
            $stmt->bind_param("ss", $vehicle_number, $code);
            $stmt->execute();
        }
    }

    // Check if the insert was successful
    if ($stmt->error) {
        echo json_encode(['status' => 'error', 'message' => $stmt->error]);
        http_response_code(500);
    } else {
        echo json_encode(['status' => 'success', 'message' => 'Data saved successfully']);
        http_response_code(200);
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    http_response_code(405); // Method Not Allowed
}
?>
