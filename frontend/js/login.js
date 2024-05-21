if (token) {
    window.location.href = '/account';
}

var errorMsgElement = document.getElementById('error-msg');

document.getElementById('login-email').focus();

document.getElementById('switch-btn').addEventListener('click', function () {
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const switchBtn = document.getElementById('switch-btn');
    const errorMsgElement = document.getElementById('error-msg');

    if (!loginForm.classList.contains('hidden')) {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        switchBtn.textContent = 'Už mám účet';
        errorMsgElement.style.display = 'none';
        document.getElementById('register-name').focus();
    } else {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        switchBtn.textContent = 'Ešte nemám účet';
        errorMsgElement.style.display = 'none';
        document.getElementById('login-email').focus();
    }
});

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch(api + '/auth', {
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
                localStorage.setItem('language', data.language);
                window.location.href = '/account';
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

    fetch(api + '/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, language })
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
                window.location.href = '/account';
            }
        })
        .catch(error => {
            errorMsgElement.textContent = error.msg;
            errorMsgElement.style.display = 'block';
        });
});