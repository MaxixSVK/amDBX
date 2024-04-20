if (!token) {
    window.location.href = 'login.html';
}

fetch(api + '/admin', {
    headers: {
        'Authorization': token
    }
}).then(response => {
    if (!response.ok) {
        window.location.href = 'index.html';
    }
}).catch(error => {
    console.error('Error:', error);
});


document.getElementById('promoteForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.querySelector('#promoteName').value;
    const newRole = document.querySelector('#newRole').value;

    fetch(api + '/admin/role', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ username, newRole })
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector('#status').textContent = data.msg;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});