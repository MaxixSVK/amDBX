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

document.getElementById('announcement-active-list').addEventListener('click', function () {
    fetch(api + '/announcements', {
        headers: {
            'Authorization': token
        }
    })
    .then(response => response.json())
    .then(data => {
        var wrapper = document.getElementById('announcement-list');
        wrapper.innerHTML = '';
        wrapper.classList.add('overflow-auto');
    
        var table = document.createElement('table');
        table.classList.add('w-full', 'max-w-full', 'min-w-0');
    
        var headerRow = document.createElement('tr');
        ['Názov', 'Podrobnosti', 'Platí do', 'ID'].forEach(header => {
            var th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
    
        data.forEach(announcement => {
            var row = document.createElement('tr');
            row.classList.add('border', 'border-gray-300');
            [announcement.name, announcement.description, new Date(announcement.until), announcement._id].forEach(text => {
                var td = document.createElement('td');
                td.textContent = text;
                td.classList.add('p-2');
                row.appendChild(td);
            });
            table.appendChild(row);
        });
    
        wrapper.appendChild(table);
    })
    .catch(error => {
        console.error('Error:', error);
    });
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

document.getElementById('announcementForm').addEventListener('submit', function (event) {
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

document.getElementById('deleteForm').addEventListener('submit', function (event) {
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