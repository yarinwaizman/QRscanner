import os
from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database configuration (replace with your own details)
db_config = {
    'host': 'localhost',  # Use 'localhost' for local MySQL, or your MySQL server's IP
    'user': 'root',  # Your MySQL username
    'password': 'Yy@201096207174160!Waizman?',  # Your MySQL password
    'database': 'qr_scanner_db',  # Your MySQL database name
    'port': 3306  # Default MySQL port is 3306
}

# Connect to the MySQL database and create table if it doesn't exist
def initialize_database():
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Create the table if it doesn't exist
        create_table_query = """
        CREATE TABLE IF NOT EXISTS scans (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_number VARCHAR(255) NOT NULL,
            scanned_code VARCHAR(255) NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        cursor.execute(create_table_query)
        connection.commit()
        print("Database initialized and table created (if it didn't exist).")

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Route to check if the server is running
@app.route('/')
def home():
    return "Server is running!"

# Route to submit data
@app.route('/submit', methods=['POST'])
def submit_data():
    try:
        data = request.get_json()
        vehicle_number = data.get('vehicleNumber')
        scanned_codes = data.get('codes')

        # Validate input
        if not vehicle_number or not scanned_codes:
            return jsonify({'status': 'error', 'message': 'Invalid input data'}), 400

        # Connect to MySQL
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Insert each scanned code into the database
        for code in scanned_codes:
            insert_query = """
            INSERT INTO scans (vehicle_number, scanned_code)
            VALUES (%s, %s);
            """
            cursor.execute(insert_query, (vehicle_number, code))
        
        connection.commit()

        return jsonify({'status': 'success', 'message': 'Data saved successfully!'}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    # Initialize database and table
    initialize_database()

    # Start Flask server
    app.run(host='0.0.0.0', port=5000)
