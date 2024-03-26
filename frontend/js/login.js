if (token) {
    window.location.href = 'account.html';
}

var errorMsgElement = document.getElementById('error-msg');

document.getElementById('switch-btn').addEventListener('click', function () {
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const switchBtn = document.getElementById('switch-btn');

    if (loginForm.style.display !== 'none') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        switchBtn.textContent = 'Už mám účet';
        errorMsgElement.style.display = 'none';
    } else {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        switchBtn.textContent = 'Ešte nemám účet';
        errorMsgElement.style.display = 'none';
    }
});

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch(api + '/account/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw error;
                });
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                localStorage.setItem('token', data.token);
                window.location.href = 'account.html';
            }
        })
        .catch(error => {
            errorMsgElement.textContent = error.msg;
            errorMsgElement.style.display = 'block';
        });
});

document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    fetch(api + '/account/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw error;
                });
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                localStorage.setItem('token', data.token);
                window.location.href = 'account.html';
            }
        })
        .catch(error => {
            errorMsgElement.textContent = error.msg;
            errorMsgElement.style.display = 'block';
        });
});