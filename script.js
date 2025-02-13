document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const file = document.getElementById('zipFile').files[0];
    if (!file) {
        alert('נא לבחור קובץ ZIP!');
        return;
    }

    document.getElementById('status').innerText = '⌛ מעלה ומפעיל קומפילציה...';

    const repoOwner = 'שם_המשתמש_בגיטהב';
    const repoName = 'my-apk-builder';
    const githubToken = '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'; // יש ליצור PAT בגיטהב (ללא שיתוף!)

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/dispatches`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            event_type: 'build_apk',
            client_payload: {
                filename: file.name
            }
        })
    });

    if (response.ok) {
        document.getElementById('status').innerText = '✅ קובץ הועבר לקומפילציה בהצלחה!';
    } else {
        document.getElementById('status').innerText = '❌ שגיאה בשליחה לגיטהב.';
    }
});
