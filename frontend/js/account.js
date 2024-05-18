if (!token) {
    window.location.href = '/login';
}

fetch(api + '/account', {
    headers: {
        'Authorization': token
    }
})
    .then(response => response.json())
    .then(user => {
        document.getElementById('user-name').innerText = user.name;
        document.getElementById('user-email').innerText = user.email;
        if (user.role === 'mod') {
            document.getElementById('administration').classList.remove('hidden');
            document.getElementById('mod-panel').classList.remove('hidden');
        }
        if (user.role === 'admin') {
            document.getElementById('administration').classList.remove('hidden');
            document.getElementById('mod-panel').classList.remove('hidden');
            document.getElementById('admin-panel').classList.remove('hidden');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = '/';
});

function toggleSection(showId, hideIds) {
    const showElement = document.getElementById(showId);
    if (showElement.classList.contains('hidden')) {
        showElement.classList.remove('hidden');
        hideIds.forEach(id => document.getElementById(id).classList.add('hidden'));
    } else {
        showElement.classList.add('hidden');
    }
}

document.getElementById('change-email-btn').addEventListener('click', function () {
    toggleSection('change-email', ['change-password', 'delete-account']);
});

document.getElementById('change-password-btn').addEventListener('click', function () {
    toggleSection('change-password', ['change-email', 'delete-account']);
});

document.getElementById('delete-account-btn').addEventListener('click', function () {
    toggleSection('delete-account', ['change-email', 'change-password']);
});

const errorMsgElement = document.getElementById('error-message');
const successMsgElement = document.getElementById('success-message');

document.getElementById('change-email-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const password = document.getElementById('password-email').value;
    const newEmail = document.getElementById('new-email').value;

    fetch(api + '/account/change-email', {
        method: 'PUT',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, email: newEmail })
    })
        .then(response => response.json())
        .then(data => {
            if (!data.email) {
                errorMsgElement.textContent = data.msg;
                errorMsgElement.style.display = 'block';
                successMsgElement.style.display = 'none';
                return;
            }

            errorMsgElement.style.display = 'none';
            successMsgElement.textContent = data.msg;
            successMsgElement.style.display = 'block';

            document.getElementById('user-email').innerText = 'Email: ' + data.email;
        })
        .catch(error => {
            console.error('Error:', error);
        });
});



document.getElementById('change-password-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('new-password-again').value;

    if (newPassword !== confirmPassword) {
        errorMsgElement.textContent = 'Heslá sa nezhodujú';
        errorMsgElement.style.display = 'block';
        successMsgElement.style.display = 'none';
        return;
    }

    fetch(api + '/account/change-password', {
        method: 'PUT',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword })
    })
        .then(response => response.json())
        .then(data => {
            if (!data.token) {
                errorMsgElement.textContent = data.msg;
                errorMsgElement.classList.remove('hidden');
                successMsgElement.classList.add('hidden');
                return;
            }
            
            errorMsgElement.classList.add('hidden');
            successMsgElement.textContent = data.msg;
            successMsgElement.classList.remove('hidden');
            
            const token = data.token;
            localStorage.setItem('token', token);
        })

        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('delete-account-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const password = document.getElementById('password-delete').value;

    fetch(api + '/account/delete', {
        method: 'DELETE',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    })
        .then(response => response.json())
        .then(data => {
            if (!data.deleted) {
                errorMsgElement.textContent = data.msg;
                errorMsgElement.classList.remove('hidden');
                successMsgElement.classList.add('hidden');
                return;
            }
            
            localStorage.removeItem('token');
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


document.getElementById('public-profile-btn').addEventListener('click', function () {
    window.location.href = '/profile/' + document.getElementById('user-name').innerText;
});
