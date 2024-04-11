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
        document.getElementById('user-email').innerText = 'Email: ' + user.email;
    })
    .catch(error => {
        console.error('Error:', error);
    });

document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

document.getElementById('edit-account').style.display = 'none';

document.getElementById('edit-account-btn').addEventListener('click', function () {
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

        const h2 = document.createElement('h2');
        h2.textContent = 'Moje anime';

        animeListDiv.appendChild(h2);

        let counter = 0;
        for (let i = 0; i < animeList.length; i++) {
            if (counter < 3) {
                const div = document.createElement('div');
                div.classList.add('list-item');

                const p = document.createElement('p');
                p.textContent = animeList[i].id.name;

                const img = document.createElement('img');
                img.src = animeList[i].id.img;
                img.alt = animeList[i].id.name;

                div.appendChild(p);
                div.appendChild(img);

                animeListDiv.appendChild(div);
                counter++;
            }
        }
        const div = document.createElement('div');
        div.classList.add('list-item');

        const p = document.createElement('p');
        p.textContent = 'Anime list';

        const img = document.createElement('img');

        const a = document.createElement('a');
        a.href = 'animelist.html';
        a.textContent = 'Anime list';

        div.appendChild(p);
        div.appendChild(img);
        div.appendChild(a);

        animeListDiv.appendChild(div);
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

        const h2 = document.createElement('h2');
        h2.textContent = 'Moja manga';

        mangaListDiv.appendChild(h2);

        let counter = 0;
        for (let i = 0; i < mangaList.length; i++) {
            if (counter < 3) {
                const div = document.createElement('div');
                div.classList.add('list-item');

                const p = document.createElement('p');
                p.textContent = mangaList[i].id.name;

                const img = document.createElement('img');
                img.src = mangaList[i].id.img;
                img.alt = mangaList[i].id.name;

                div.appendChild(p);
                div.appendChild(img);

                mangaListDiv.appendChild(div);
                counter++;
            }
        }
        const div = document.createElement('div');
        div.classList.add('list-item');

        const p = document.createElement('p');
        p.textContent = 'Manga list';

        const img = document.createElement('img');

        const a = document.createElement('a');
        a.href = 'mangalist.html';
        a.textContent = 'Manga list';

        div.appendChild(p);
        div.appendChild(img);
        div.appendChild(a);

        mangaListDiv.appendChild(div);
    })

document.getElementById('change-password-btn').addEventListener('click', function () {
    const div = document.createElement('div');
    div.classList.add('change-div');
    div.innerHTML = `
        <input type="password" id="old-password" placeholder="Old password">
        <input type="password" id="new-password" placeholder="New password">
        <button id="change-password">Change password</button>
    `;
    document.getElementById('edit-account').appendChild(div);

    document.getElementById('change-password').addEventListener('click', function () {
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;

        if (!oldPassword || !newPassword) {
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

            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});

document.getElementById('change-email-btn').addEventListener('click', function () {
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

document.getElementById('delete-account-btn').addEventListener('click', function () {
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