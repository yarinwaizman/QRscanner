import os
from flask import Flask, request, jsonify, send_file
import pandas as pd
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app

# Use environment variable for Excel file path
EXCEL_FILE_PATH = os.getenv('EXCEL_FILE_PATH', '/app/data.xlsx')
print(f"Using Excel file path: {EXCEL_FILE_PATH}")

# Ensure the directory exists
os.makedirs(os.path.dirname(EXCEL_FILE_PATH), exist_ok=True)

# Load the existing Excel file or create a new one
def load_excel():
    try:
        print(f"Loading from {EXCEL_FILE_PATH}")
        df = pd.read_excel(EXCEL_FILE_PATH)
        df = df[['VehicleNumber', 'ScannedCode', 'Timestamp']]
        return df
    except FileNotFoundError:
        print("Excel file not found. Creating a new one.")
        return pd.DataFrame(columns=['VehicleNumber', 'ScannedCode', 'Timestamp'])

# Save the DataFrame back to the Excel file
def save_excel(df):
    print(f"Saving to {EXCEL_FILE_PATH}")
    df.to_excel(EXCEL_FILE_PATH, index=False)
    print("Save complete")

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

        df = load_excel()

        new_rows = pd.DataFrame({
            'VehicleNumber': [vehicle_number] * len(scanned_codes),
            'ScannedCode': scanned_codes,
            'Timestamp': [timestamp] * len(scanned_codes)
        })

        df = pd.concat([df, new_rows], ignore_index=True)

        save_excel(df)

        print("Data saved successfully")
        return jsonify({'message': 'Data saved successfully!'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/download', methods=['GET'])
def download_file():
    return send_file(EXCEL_FILE_PATH, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
