let urlString = window.location.href;

let profileName = urlString.split("mangalist/")[1];

async function fetchProfileAndMangaList() {
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
            window.location.href = '/mangalist/' + user.name;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    try {
        let response = await fetch(api + '/profile/' + profileName + '/manga');
        if (!response.ok) {
            if (response.status == 404) {
                window.location.href = '/404';
            } else {
                window.location.href = '/500';
            }
        }
        let user = await response.json();
        const userName = document.getElementById('user-name');
        userName.textContent = user.name;

        const mangaListDiv = document.getElementById('list');
        const h2 = document.createElement('h2');
        h2.textContent = 'Manga list';
        mangaListDiv.appendChild(h2);

        for (let i = 0; i < user.manga.length; i++) {
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
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchProfileAndMangaList();