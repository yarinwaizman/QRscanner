<?php
$servername = "localhost";
$username = "root";
$password = "Yy@201096207174160!Waizman?";
$dbname = "qr_scanner_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>
