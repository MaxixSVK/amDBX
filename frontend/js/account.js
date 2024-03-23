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

fetch('http://localhost:3000/api/account/anime/list', {
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

fetch('http://localhost:3000/api/account/manga/list', {
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