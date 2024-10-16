<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include 'db_connect.php'; // Include the database connection

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['vehicle_number']) || !isset($input['scanned_codes'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit;
}

$vehicle_number = $conn->real_escape_string($input['vehicle_number']);
$scanned_codes = implode(',', $input['scanned_codes']);  // Convert array to string for saving

// SQL query to insert data
$sql = "INSERT INTO scans (vehicle_number, scanned_codes) VALUES ('$vehicle_number', '$scanned_codes')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['status' => 'success', 'message' => 'Data saved successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $conn->error]);
}

$conn->close();
?>
