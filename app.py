from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app

# Load the existing Excel file or create a new one
def load_excel():
    try:
        df = pd.read_excel('data.xlsx')
        # Reorder columns if they exist
        df = df[['VehicleNumber', 'ScannedCode', 'Timestamp']]
        return df
    except FileNotFoundError:
        return pd.DataFrame(columns=['VehicleNumber', 'ScannedCode', 'Timestamp'])

# Save the DataFrame back to the Excel file
def save_excel(df):
    df.to_excel('data.xlsx', index=False)

@app.route('/submit', methods=['POST'])
def submit_data():
    data = request.get_json()
    vehicle_number = data.get('vehicleNumber')
    scanned_codes = data.get('codes')
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # Load the existing Excel file or create a new one
    df = load_excel()

    # Create new DataFrame with the new scanned codes and timestamp
    new_rows = pd.DataFrame({
        'VehicleNumber': [vehicle_number] * len(scanned_codes),
        'ScannedCode': scanned_codes,
        'Timestamp': [timestamp] * len(scanned_codes)
    })

    # Concatenate the new rows to the existing DataFrame
    df = pd.concat([df, new_rows], ignore_index=True)

    # Save the updated DataFrame back to the Excel file
    save_excel(df)

    return jsonify({'message': 'Data saved successfully!'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

