document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // מונע את רענון הדף
    
    const fileInput = document.getElementById('zipFile');
    const file = fileInput.files[0];
    if (!file) {
        alert('❗ נא לבחור קובץ ZIP!');
        return;
    }

    document.getElementById('status').innerText = '⌛ מעלה ומפעיל קומפילציה...';

document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // מונע את רענון הדף
    
    const fileInput = document.getElementById('zipFile');
    const file = fileInput.files[0];
    if (!file) {
        alert('❗ נא לבחור קובץ ZIP!');
        return;
    }

    document.getElementById('status').innerText = '⌛ מעלה ומפעיל קומפילציה...';

    const repoOwner = 'שם_המשתמש_בגיטהב';
    const repoName = 'my-apk-builder';
    const githubToken = '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'; // הכנס טוקן תקף

    try {
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
            document.getElementById('status').innerText = '✅ קובץ הועבר בהצלחה! הקומפילציה החלה...';
        } else {
            const errorText = await response.text();
            document.getElementById('status').innerText = `❌ שגיאה: ${errorText}`;
        }
    } catch (error) {
        document.getElementById('status').innerText = `⚠️ שגיאת רשת: ${error.message}`;
    }
});

    const githubToken = 'ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // הכנס טוקן תקף

    try {
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
            document.getElementById('status').innerText = '✅ קובץ הועבר בהצלחה! הקומפילציה החלה...';
        } else {
            const errorText = await response.text();
            document.getElementById('status').innerText = `❌ שגיאה: ${errorText}`;
        }
    } catch (error) {
        document.getElementById('status').innerText = `⚠️ שגיאת רשת: ${error.message}`;
    }
});
