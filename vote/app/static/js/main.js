function generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function getOrCreateSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

function loadVoteFromStorage() {
    const userVote = localStorage.getItem('userVote');
    if (userVote) {
        const {courseId, courseName} = JSON.parse(userVote);
        updateButtonState(courseId);
        showVoteStatus(courseName);
    }
}

function updateButtonState(courseId) {
    document.querySelectorAll('.vote-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    const selectedBtn = document.querySelector(`button[onclick*="vote(${courseId}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
}

function showVoteStatus(courseName) {
    const statusEl = document.getElementById('voteStatus');
    statusEl.textContent = `You voted for: ${courseName} (click another course to change)`;
    statusEl.classList.add('show');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function vote(courseId, courseName) {
    const sessionId = getOrCreateSessionId();
    const existingVote = localStorage.getItem('userVote');

    if (existingVote) {
        const {courseId: previousCourseId} = JSON.parse(existingVote);
        console.log(`Changed vote from course ${previousCourseId} to course ${courseId}`);
    }

    localStorage.setItem('userVote', JSON.stringify({courseId, courseName, timestamp: new Date().toISOString()}));

    updateButtonState(courseId);
    showVoteStatus(courseName);

    fetch('/vote', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({course_id: courseId, session_id: sessionId})
    })
        .then(response => response.json())
        .then(data => {
            showToast('Voted Successfully', 'success');
        })
        .catch(err => {
            console.error('Vote submission failed:', err);
            showToast('Vote failed', 'error');
        });
}

document.addEventListener('DOMContentLoaded', getOrCreateSessionId);
document.addEventListener('DOMContentLoaded', loadVoteFromStorage);