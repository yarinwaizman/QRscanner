from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/save_scans.php": {"origins": "https://yarinwaizman.github.io"}})

# Database connection details
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Yy@201096207174160!Waizman?',
    'database': 'qr_scanner_db'
}

@app.route('/save_scans.php', methods=['POST'])
def save_scans():
    try:
        data = request.get_json()
        vehicle_number = data['vehicleNumber']
        scanned_codes = data['codes']

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        for code in scanned_codes:
            cursor.execute("INSERT INTO scans (vehicle_number, scanned_codes) VALUES (%s, %s)", (vehicle_number, code))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'status': 'success', 'message': 'Scans saved successfully'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
