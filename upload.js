document.getElementById('upload-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('file-input');
    if (fileInput.files.length === 0) {
        alert('אנא בחר קובץ ZIP להעלאה.');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    progressContainer.style.display = 'block';

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('שגיאה בהעלאת הקובץ.');
        }

        const reader = response.body.getReader();
        const contentLength = response.headers.get('Content-Length');
        let receivedLength = 0;
        const chunks = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
            const progress = (receivedLength / contentLength) * 100;
            progressBar.value = progress;
            progressPercentage.textContent = `${Math.round(progress)}%`;
        }

        const blob = new Blob(chunks);
        const downloadUrl = URL.createObjectURL(blob);
        const downloadLink = document.getElementById('download-link');
        downloadLink.href = downloadUrl;
        downloadLink.download = 'app.apk';

        progressContainer.style.display = 'none';
        document.getElementById('download-container').style.display = 'block';
    } catch (error) {
        alert('אירעה שגיאה במהלך ההעלאה או ההמרה: ' + error.message);
    }
});
