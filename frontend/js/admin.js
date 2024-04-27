if (!token) {
    window.location.href = '/login';
}

fetch(api + '/admin', {
    headers: {
        'Authorization': token
    }
}).then(response => {
    if (!response.ok) {
        window.location.href = '/';
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
        document.querySelector('#role-status').textContent = data.msg;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('announcementForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var name = document.getElementById('announcementTitle').value;
    var description = document.getElementById('announcementContent').value;
    var until = document.getElementById('announcementDate').value;
    fetch(api + '/admin/announcement', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ name, description, until })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('announcement-create-status').textContent = data.msg;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('deleteForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var id = document.getElementById('deleteId').value;
    console.log(id);
    fetch(api + '/admin/announcement/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': token
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('announcement-delete-status').textContent = data.msg;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});