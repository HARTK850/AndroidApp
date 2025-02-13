document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const file = document.getElementById('zipFile').files[0];
    if (!file) {
        alert('נא לבחור קובץ ZIP!');
        return;
    }

    document.getElementById('status').innerText = '⌛ מעלה ומפעיל קומפילציה...';

    const repoOwner = 'שם_המשתמש_בגיטהב'; // החלף לשם המשתמש שלך
    const repoName = 'my-apk-builder';    // החלף לשם הריפו שלך
    const githubToken = 'XXXX'; // הכנס PAT תקין

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
