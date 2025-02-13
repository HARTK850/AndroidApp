import os
import zipfile
import subprocess
from flask import Flask, request, send_file, jsonify

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    zip_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(zip_path)

    extract_path = os.path.join(UPLOAD_FOLDER, "extracted")
    os.makedirs(extract_path, exist_ok=True)

    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_path)
    except zipfile.BadZipFile:
        return jsonify({'error': 'Invalid ZIP file'}), 400

    apk_output_path = os.path.join(OUTPUT_FOLDER, "app.apk")
    
    # הרצת קימפול (יש להחליף בפקודה המתאימה לפרויקט שלך)
    compile_command = f"cd {extract_path} && ./gradlew assembleDebug"
    process = subprocess.Popen(compile_command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    for line in process.stdout:
        print(line.decode(), end="")  # הדפסת התקדמות לקונסולה

    process.wait()

    if process.returncode != 0:
        return jsonify({'error': 'Compilation failed'}), 500

    # העתקת קובץ ה-APK למקום שניתן להורדה
    apk_source = os.path.join(extract_path, "AndroidApp/app-debug.apk")
    if not os.path.exists(apk_source):
        return jsonify({'error': 'APK file not found'}), 500

    os.rename(apk_source, apk_output_path)

    return send_file(apk_output_path, as_attachment=True, download_name="app.apk")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
