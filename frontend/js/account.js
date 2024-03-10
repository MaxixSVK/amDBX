window.onload = function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('user-name').textContent = user.name;
    }
};

document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});