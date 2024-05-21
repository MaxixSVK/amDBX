const api = 'https://apiamdbx.maxix.sk';
const cdn = 'https://cdnamdbx.maxix.sk';
const token = localStorage.getItem('token');

if (!localStorage.getItem('language')) {
    localStorage.setItem('language', 'sk');
}

const language = localStorage.getItem('language');

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
            document.getElementById('login-link').href = '/account';
        })
        .catch(error => {
            console.error('Error:', error);
        });
} else {
    document.getElementById('login-link').innerText = 'Prihlásiť sa';
}
