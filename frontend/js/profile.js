let urlString = window.location.href;

let profileName = urlString.split("profile/")[1];

async function fetchProfileAndAnimeMangaList() {
    if (profileName == undefined) {
        if (!token) {
            window.location.href = "/login";
        }

        try {
            let response = await fetch(api + '/account', {
                headers: {
                    'Authorization': token
                }
            });
            let user = await response.json();
            profileName = user.name;
            window.location.href = '/profile/' + user.name;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    try {
        let response = await fetch(api + '/profile/' + profileName);
        if (!response.ok) {
            if (response.status == 404) {
                window.location.href = '/404';
            } else {
                window.location.href = '/500';
            }
        }
        let user = await response.json();
        const profileNameElement = document.getElementById('user-name'); 
        profileNameElement.textContent = user.name;

        const animeListDiv = document.getElementById('anime-list');
        const h2 = document.createElement('h2');
        h2.textContent = 'Anime list';
        animeListDiv.appendChild(h2);

        for (let i = 0; i < Math.min(user.anime.length, 3); i++) {
            const div = document.createElement('div');
            div.classList.add('list-item');
            const p = document.createElement('p');
            p.textContent = user.anime[i].id.name;
            const img = document.createElement('img');
            img.src = user.anime[i].id.img;
            img.alt = user.anime[i].id.name;
            div.appendChild(p);
            div.appendChild(img);
            animeListDiv.appendChild(div);
        }

        const div = document.createElement('div');
        div.classList.add('list-item');
        const p = document.createElement('p');
        p.textContent = 'Anime list';
        const img = document.createElement('img');
        const a = document.createElement('a');
        a.href = '/animelist/' + user.name;
        a.textContent = 'Anime list';
        div.appendChild(p);
        div.appendChild(img);
        div.appendChild(a);
        animeListDiv.appendChild(div);

        const mangaListDiv = document.getElementById('manga-list');
        const h3 = document.createElement('h3');
        h3.textContent = 'Manga list';
        mangaListDiv.appendChild(h3);

        for (let i = 0; i < Math.min(user.manga.length, 3); i++) {
            const div = document.createElement('div');
            div.classList.add('list-item');
            const p = document.createElement('p');
            p.textContent = user.manga[i].id.name;
            const img = document.createElement('img');
            img.src = user.manga[i].id.img;
            img.alt = user.manga[i].id.name;
            div.appendChild(p);
            div.appendChild(img);
            mangaListDiv.appendChild(div);
        }

        const div2 = document.createElement('div');
        div2.classList.add('list-item');
        const p2 = document.createElement('p');
        p2.textContent = 'Manga list';
        const img2 = document.createElement('img');
        const a2 = document.createElement('a');
        a2.href = '/mangalist/' + user.name;
        a2.textContent = 'Manga list';
        div2.appendChild(p2);
        div2.appendChild(img2);
        div2.appendChild(a2);
        mangaListDiv.appendChild(div2);
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchProfileAndAnimeMangaList();