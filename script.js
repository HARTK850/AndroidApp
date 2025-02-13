document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const file = document.getElementById('zipFile').files[0];
    if (!file) {
        alert('נא לבחור קובץ ZIP!');
        return;
    }

    document.getElementById('status').innerText = '⌛ מעלה ומפעיל קומפילציה...';

    const repoOwner = 'HARTK850';
    const repoName = 'AndroidApp';    // החלף לשם הריפו שלך
    const githubToken = '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'; // הכנס PAT תקין

    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/dispatches`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json`,
            'Content-Type': 'application/json'
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
        const errorText = await response.text();
        document.getElementById('status').innerText = `❌ שגיאה: ${errorText}`;
    }
});
