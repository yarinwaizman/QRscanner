<?php
// Allow access from your frontend
header('Access-Control-Allow-Origin: https://yarinwaizman.github.io');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit;
}

// Database connection parameters
$servername = "localhost"; // Use your Render DB host here for cloud DB
$username = "root"; // Update accordingly
$password = "Yy@201096207174160!Waizman?"; // Update accordingly
$dbname = "qr_scanner_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Handle the POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $vehicleNumber = $data['vehicleNumber'] ?? '';
    $codes = $data['codes'] ?? [];

    // Validate input
    if (empty($vehicleNumber) || empty($codes)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
        exit;
    }

    // Prepare SQL statement to insert data
    $stmt = $conn->prepare("INSERT INTO scans (vehicle_number, scanned_code) VALUES (?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'SQL statement preparation failed: ' . $conn->error]);
        exit;
    }

    // Bind parameters and execute for each scanned code
    foreach ($codes as $code) {
        $stmt->bind_param("ss", $vehicleNumber, $code);
        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Execution failed: ' . $stmt->error]);
            exit;
        }
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Data saved successfully!']);
}
?>
