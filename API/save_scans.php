<?php
// Allow from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Check if the request method is OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Respond to preflight requests
    exit(0);
}

// Set the content type to application/json
header('Content-Type: application/json');

// Get the JSON data from the request
$data = json_decode(file_get_contents("php://input"));

// Validate the incoming data
if (isset($data->vehicle_number) && isset($data->scanned_codes)) {
    // Here you would include your logic to save the data to your MySQL database
    // For example:
    $vehicle_number = $data->vehicle_number;
    $scanned_codes = $data->scanned_codes;

    // Connect to your database
    $host = 'localhost'; // Change if necessary
    $db = 'qr_scanner_db'; // Replace with your database name
    $user = 'root'; // Replace with your MySQL username
    $pass = 'Yy@201096207174160!Waizman?'; // Replace with your MySQL password

    // Create connection
    $conn = new mysqli($host, $user, $pass, $db);

    // Check connection
    if ($conn->connect_error) {
        die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]));
    }

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO scans (vehicle_number, scanned_codes) VALUES (?, ?)");
    $stmt->bind_param("ss", $vehicle_number, json_encode($scanned_codes));

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save data']);
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
}
?>
