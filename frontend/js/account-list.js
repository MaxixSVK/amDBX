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