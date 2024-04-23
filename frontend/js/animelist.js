let urlString = window.location.href;

let profileName = urlString.split("animelist/")[1];

if (profileName == undefined) {
    if (!token) {
        window.location.href = "/login";
    }

    fetch(api + '/account', {
        headers: {
            'Authorization': token
        }
    })
        .then(response => response.json())
        .then(user => {
            window.location.href = '/profile/' + user.name;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

fetch(api + '/profile/' + profileName + '/anime')
    .then(response => {
        if (!response.ok) {
            if (response.status == 404) {
                window.location.href = '/404';
            } else {
                window.location.href = '/500';
            }
        }
        return response.json();
    })
    .then(user => {
        const userName = document.getElementById('user-name');
        userName.textContent = user.name;

        const animeListDiv = document.getElementById('list');
        const h2 = document.createElement('h2');
        h2.textContent = 'Anime list';
        animeListDiv.appendChild(h2);

        for (let i = 0; i < user.anime.length; i++) {
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
    })
    .catch(error => {
        console.error('Error:', error);
    });