from flask import Flask, request, send_file
import zipfile
import os
import subprocess

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file and file.filename.endswith('.zip'):
        zip_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(zip_path)

        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(UPLOAD_FOLDER)

        apk_path = compile_to_apk(UPLOAD_FOLDER)
        return send_file(apk_path, as_attachment=True)

def compile_to_apk(project_path):
    subprocess.run(['./gradlew', 'assembleDebug'], cwd=project_path)
    return os.path.join(project_path, 'app/build/outputs/apk/debug/app-debug.apk')

if __name__ == '__main__':
    app.run()
