const api = 'http://localhost:3000';
const token = localStorage.getItem('token');

if (localStorage.getItem('token')) {
    fetch(api + '/account', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
        .then(response => {
            if (!response.ok) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            return response.json();
        })
        .then(user => {
            document.getElementById('login-link').innerText = 'Účet';
            document.getElementById('login-link').href = '/account';
        })
        .catch(error => {
            console.error('Error:', error);
        });
} else {
    document.getElementById('login-link').innerText = 'Prihlásiť sa';
}
