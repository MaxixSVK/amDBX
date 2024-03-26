if (!token) {
    window.location.href = 'login.html';
}

fetch(api + '/account', {
    headers: {
        'Authorization': token
    }
})
.then(response => response.json())
.then(user => {
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

fetch(api + '/account/anime/list', {
    headers: {
        'Authorization': token
    }
})
.then(response => response.json())
.then(animeList => {
    const animeListDiv = document.getElementById('anime-list');
    animeList.forEach(anime => {
        const p = document.createElement('p');
        p.textContent = anime.id.name; 
        animeListDiv.appendChild(p);
    });
})
.catch(error => {
    console.error('Error:', error);
});

fetch(api + '/account/manga/list', {
    headers: {
        'Authorization': token
    }
})
.then(response => response.json())
.then(mangaList => {
    const mangaListDiv = document.getElementById('manga-list');
    mangaList.forEach(manga => {
        const p = document.createElement('p');
        p.textContent = manga.id.name; 
        mangaListDiv.appendChild(p);
    });
})

document.getElementById('change-password-btn').addEventListener('click', function() {
    const oldPassword = prompt('Enter your old password:');
    if (!oldPassword) {
        return;
    }
    const newPassword = prompt('Enter your new password:');
    if (!newPassword) {
        return;
    }
    
    fetch(api + '/account/change-password', {
        method: 'PUT',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.msg === 'Password changed') {
            alert('Password successfully changed.');
        } else {
            alert('Failed to change password.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('change-email-btn').addEventListener('click', function() {
    const password = prompt('Enter your password:');
    if (!password) {
        return;
    }
    const newEmail = prompt('Enter your new email:');
    if (!newEmail) {
        return;
    }
    
    fetch(api + '/account/change-email', {
        method: 'PUT',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, email: newEmail })
    })
    .then(response => response.json())
    .then(data => {
        if (data.msg === 'Email changed') {
            alert('Email successfully changed.');
        } else {
            alert('Failed to change email.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('delete-account-btn').addEventListener('click', function() {
    const password = prompt('Enter your password:');
    if (!password) {
        return;
    }
    
    fetch(api + '/account/delete', {
        method: 'DELETE',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.msg === 'Account deleted') {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        } else {
            alert('Failed to delete account.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});