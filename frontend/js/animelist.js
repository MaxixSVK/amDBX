let urlString = window.location.href;
let profileName = urlString.split("animelist/")[1];

async function fetchProfileAndAnimeList() {
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
            window.location.href = '/animelist/' + user.name;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    try {
        let response = await fetch(api + '/profile/' + profileName + '/anime');
        if (!response.ok) {
            if (response.status == 404) {
                window.location.href = '/404';
            } else {
                window.location.href = '/500';
            }
        }
        let user = await response.json();
        const userName = document.getElementById('user-name');
        userName.classList.add('text-2xl', 'font-bold', 'mb-4');
        userName.textContent = user.name + " - Anime List";

        const animeListDiv = document.getElementById('list');
        for (let i = 0; i < user.anime.length; i++) {
            const div = document.createElement('div');
            div.classList.add('resultDivSection', 'flex', 'items-center', 'justify-between', 'border-b', 'border-gray-200', 'py-2');
            const p = document.createElement('p');
            p.classList.add('text-lg', 'font-semibold');
            p.textContent = user.anime[i].id.name;
            const img = document.createElement('img');
            img.classList.add('w-16', 'object-cover', 'rounded');
            img.src = user.anime[i].id.img;
            img.alt = user.anime[i].id.name;
            div.appendChild(p);
            div.appendChild(img);
            animeListDiv.appendChild(div);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchProfileAndAnimeList();