document.getElementById('switch-btn').addEventListener('click', function () {
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const switchBtn = document.getElementById('switch-btn');

    if (loginForm.style.display !== 'none') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        switchBtn.textContent = 'Už mám účet';
    } else {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        switchBtn.textContent = 'Ešte nemáte účet?';
    }
});

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data) {
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'account.html';
            }
        })
        .catch(error => console.error('Error:', error));
});

document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data) {
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'account.html';
            }
        })
        .catch(error => console.error('Error:', error));
});