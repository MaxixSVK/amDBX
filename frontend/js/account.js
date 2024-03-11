let userId = localStorage.getItem('userId');
let token = localStorage.getItem('token');

if (!userId || !token) {
    window.location.href = 'login.html';
}

// TODO: Fetch user data from the server and display them in the account.html
/*fetch('http://localhost:3000/user/' + userId, {
    headers: {
        'Authorization': 'Bearer ' + token
    }
})
.then(response => response.json())
.then(user => {
    document.getElementById('user-name').innerText = user.name;
    document.getElementById('user-email').innerText = user.email;
})
.catch(error => {
    console.error('Error:', error);
});*/

document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

document.getElementById('edit-account').style.display = 'none';

document.getElementById('edit-account-btn').addEventListener('click', function() {
    document.getElementById('edit-account').style.display = 'block';
    document.getElementById('edit-account-btn').style.display = 'none';
});