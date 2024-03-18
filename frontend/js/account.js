const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
}

fetch('http://localhost:3000/api/account/', {
    headers: {
        'Authorization': token
    }
})
.then(response => response.json())
.then(user => {
    console.log(user);
    document.getElementById('user-name').innerText = user.name;
    document.getElementById('user-email').innerText = user.email;
})
.catch(error => {
    console.error('Error:', error);
});

document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

document.getElementById('edit-account').style.display = 'none';

document.getElementById('edit-account-btn').addEventListener('click', function() {
    document.getElementById('edit-account').style.display = 'block';
    document.getElementById('edit-account-btn').style.display = 'none';
});