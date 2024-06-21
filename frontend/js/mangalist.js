let urlString = window.location.href;
let profileName = urlString.split("mangalist/")[1];

const sortElement = document.getElementById('sort');

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
        let response = await fetch(api + '/profile/' + profileName + '/manga?sort=' + sortElement.value);
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
        userName.textContent = user.name + " - Manga List";

        const mangaListDiv = document.getElementById('list');
        mangaListDiv.innerHTML = '';
        for (let i = 0; i < user.manga.length; i++) {
            const div = document.createElement('div');
            div.classList.add('resultDivSection', 'flex', 'items-center', 'justify-between', 'border-b', 'border-gray-200', 'py-2');
            const p = document.createElement('p');
            p.textContent = user.manga[i].id.name;
            p.classList.add('text-lg', 'font-semibold');
            const img = document.createElement('img');
            img.src = user.manga[i].id.img;
            img.alt = user.manga[i].id.name;
            img.classList.add('w-16', 'object-cover', 'rounded');
            div.appendChild(p);
            div.appendChild(img);
            mangaListDiv.appendChild(div);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchProfileAndMangaList();

sortElement.addEventListener('change', fetchProfileAndMangaList);