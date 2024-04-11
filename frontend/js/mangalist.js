if (!token) {
    window.location.href = 'login.html';
}

fetch(api + '/account/manga/list', {
    headers: {
        'Authorization': token
    }
})
    .then(response => response.json())
    .then(animeList => {
        const animeListDiv = document.getElementById('list');
        const h2 = document.createElement('h2');
        h2.textContent = 'Moja manga';
        animeListDiv.appendChild(h2);

        for(let i = 0; i < animeList.length; i++) {
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
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });