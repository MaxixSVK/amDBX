if (!token) {
    window.location.href = 'login.html';
}

fetch(api + '/account', {
    headers: {
        'Authorization': token
    }
})
    .then(response => response.json())
    .then(user => {
        document.getElementById('user-name').innerText = user.name;
        document.getElementById('user-email').innerText = 'Email: ' + user.email;
    })
    .catch(error => {
        console.error('Error:', error);
    });

document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

document.getElementById('edit-account').style.display = 'none';

document.getElementById('edit-account-btn').addEventListener('click', function () {
    document.getElementById('edit-account').style.display = 'block';
    document.getElementById('edit-account-btn').style.display = 'none';
});

const errorMsgElement = document.getElementById('error-message');
const successMsgElement = document.getElementById('success-message');

document.getElementById('change-password-btn').addEventListener('click', function () {
    var changeDiv = document.getElementById('change-password');
    changeDiv.style.display = 'block';

    var changeDiv = document.getElementById('change-email');
    changeDiv.style.display = 'none';

    var changeDiv = document.getElementById('delete-account');
    changeDiv.style.display = 'none';

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
                    errorMsgElement.style.display = 'block';
                    successMsgElement.style.display = 'none';
                    return;
                }

                errorMsgElement.style.display = 'none';
                successMsgElement.textContent = data.msg;
                successMsgElement.style.display = 'block';

                const token = data.token;
                localStorage.setItem('token', token);
            })

            .catch(error => {
                console.error('Error:', error);
            });
    });
});

document.getElementById('change-email-btn').addEventListener('click', function () {
    var changeDiv = document.getElementById('change-password');
    changeDiv.style.display = 'none';

    var changeDiv = document.getElementById('change-email');
    changeDiv.style.display = 'block';

    var changeDiv = document.getElementById('delete-account');
    changeDiv.style.display = 'none';

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
});

document.getElementById('delete-account-btn').addEventListener('click', function () {
    var changeDiv = document.getElementById('change-password');
    changeDiv.style.display = 'none';

    var changeDiv = document.getElementById('change-email');
    changeDiv.style.display = 'mone';

    var changeDiv = document.getElementById('delete-account');
    changeDiv.style.display = 'block';

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
                    errorMsgElement.style.display = 'block';
                    successMsgElement.style.display = 'none';
                    return;
                }

                localStorage.removeItem('token');
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});