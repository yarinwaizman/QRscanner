<?php
// Database connection settings
$host = 'localhost'; // Change if necessary
$db = 'qr_scanner_db'; // Replace with your database name
$user = 'root'; // Replace with your MySQL username
$pass = 'Yy@201096207174160!Waizman?'; // Replace with your MySQL password

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Prepare the SQL statement
$stmt = $conn->prepare("INSERT INTO scans (vehicle_number, scanned_codes) VALUES (?, ?)");
$stmt->bind_param("ss", $vehicle_number, $scanned_codes);

// Loop through the incoming data
$vehicle_number = $data['vehicleNumber'];
$scanned_codes = json_encode($data['codes']); // Convert array to JSON string

// Execute the statement
if ($stmt->execute()) {
    echo json_encode(["message" => "Data saved successfully!"]);
} else {
    echo json_encode(["error" => "Error saving data: " . $stmt->error]);
}

// Close connections
$stmt->close();
$conn->close();
?>

