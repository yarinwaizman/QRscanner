import os
import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database connection parameters
DB_CONFIG = {
    'user': 'root',  # replace with your MySQL username
    'password': 'Yy@201096207174160!Waizman?',  # replace with your MySQL password
    'host': 'localhost',  # or your DB host
    'database': 'qr_scanner_db'  # replace with your database name
}

# Connect to the database
def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

@app.route('/')
def home():
    return "Server is running!"

@app.route('/submit', methods=['POST'])
def submit_data():
    try:
        print("Received submit request")
        data = request.get_json()
        print(f"Received data: {data}")
        vehicle_number = data.get('vehicleNumber')
        scanned_codes = data.get('codes')

        if not vehicle_number or not scanned_codes:
            print("Invalid input data")
            return jsonify({'error': 'Invalid input data'}), 400

        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        connection = get_db_connection()
        if connection is None:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()

        for code in scanned_codes:
            cursor.execute(
                "INSERT INTO scans (vehicle_number, scanned_code, created_at) VALUES (%s, %s, %s)",
                (vehicle_number, code, timestamp)
            )

        connection.commit()
        cursor.close()
        connection.close()

        print("Data saved successfully")
        return jsonify({'message': 'Data saved successfully!'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
