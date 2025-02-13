from flask import Flask, request, send_file, render_template
import os
import zipfile
import subprocess

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
BUILD_FOLDER = 'build'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(BUILD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "לא נבחר קובץ", 400

    file = request.files['file']
    if file.filename == '':
        return "שם קובץ ריק", 400

    if file and file.filename.endswith('.zip'):
        zip_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(zip_path)

        # חילוץ הקובץ
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(BUILD_FOLDER)

        # בניית APK
        build_command = f'cd {BUILD_FOLDER} && ./gradlew assembleDebug'
        result = subprocess.run(build_command, shell=True, capture_output=True, text=True)

        if result.returncode != 0:
            return f"שגיאה בבנייה: {result.stderr}", 500

        apk_path = os.path.join(BUILD_FOLDER, 'app/build/outputs/apk/debug/app-debug.apk')
        if os.path.exists(apk_path):
            return send_file(apk_path, as_attachment=True)
        else:
            return "ה-APK לא נוצר", 500

    return "הועלה קובץ לא חוקי", 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
