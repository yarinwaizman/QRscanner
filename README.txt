***QRScanner Made By Yarin Waizman***

1. turn on server and verify logs - 
cmd - cd [path] app.py

2. run a debug test
cmd - curl -X POST http://localhost:5000/submit -H "Content-Type: application/json" -d "{\"vehicleNumber\":\"XYZ123\", \"codes\": [\"12345ABC\"]}"

3. open index.html run a test and check developers mode [F12] to verify "data saved successfully!"