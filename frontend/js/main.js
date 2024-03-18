const token = localStorage.getItem('token');

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});
window.onload = function () {
    if (localStorage.getItem('token')) {
        fetch('http://localhost:3000/api/account/', {
            headers: {
                'Authorization': token
            }
        })
        .then(response => response.json())
        .then(user => {
            console.log(user);
            document.getElementById('login-link').innerText = user.name;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
};