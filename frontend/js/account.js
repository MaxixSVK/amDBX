let user = localStorage.getItem('user');
console.log(user);
if (!user) {
    window.location.href = 'login.html';
}
user = JSON.parse(user);
document.getElementById('user-name').innerText = user.name;
document.getElementById('user-email').innerText = user.email;

document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

document.getElementById('edit-account').style.display = 'none';

document.getElementById('edit-account-btn').addEventListener('click', function() {
    document.getElementById('edit-account').style.display = 'block';
    document.getElementById('edit-account-btn').style.display = 'none';
});