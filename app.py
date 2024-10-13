import os
from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app

# Use environment variable for Excel file path
EXCEL_FILE_PATH = os.getenv('EXCEL_FILE_PATH', '/app/data.xlsx')
print(f"Using Excel file path: {EXCEL_FILE_PATH}")

# Load the existing Excel file or create a new one
def load_excel():
    try:
        df = pd.read_excel(EXCEL_FILE_PATH)
        # Reorder columns if they exist
        df = df[['VehicleNumber', 'ScannedCode', 'Timestamp']]
        return df
    except FileNotFoundError:
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
    print("Received submit request")
    data = request.get_json()
    print(f"Received data: {data}")
    vehicle_number = data.get('vehicleNumber')
    scanned_codes = data.get('codes')

    if not vehicle_number or not scanned_codes:
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

    return jsonify({'message': 'Data saved successfully!'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
