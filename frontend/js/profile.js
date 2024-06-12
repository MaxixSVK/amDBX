let urlString = window.location.href;
let profileName = urlString.split("profile/")[1];

async function fetchProfileAndAnimeMangaList() {
    if (!profileName) {
        await fetchProfileName();
    }

    try {
        let user = await fetchUserProfile(profileName);
        displayProfile(user);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchProfileName() {
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

async function fetchUserProfile(profileName) {
    let response = await fetch(api + '/profile/' + profileName);
    if (!response.ok) {
        handleErrorResponse(response.status);
    }
    return await response.json();
}

function handleErrorResponse(status) {
    window.location.href = '/404';
}

function displayProfile(user) {
    displayUserName(user.user.name);
    displayUserStats(user.stats);
    displayList(user.user.anime, 'anime', 'Anime list');
    displayList(user.user.manga, 'manga', 'Manga list');
}

function displayUserName(name) {
    const profileNameElement = document.getElementById('user-name');
    profileNameElement.textContent = name;
}

function displayUserStats(stats) {
    const statsElement = document.getElementById('user-info');
    statsElement.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            ${createStatCard('Anime', stats.animeCount)}
            ${createStatCard('Manga', stats.mangaCount)}
            ${createStatCard('Epizódy', stats.episodeCount)}
            ${createStatCard('Kapitoly', stats.chapterCount)}
        </div>
    `;
}

function createStatCard(title, value) {
    return `
        <div class="p-4 bg-white rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-2">${title}</h2>
            <p class="text-2xl text-gray-700">${value}</p>
        </div>
    `;
}

function displayList(items, listId, listTitle) {
    const listDiv = document.getElementById(listId + '-list');
    const h2 = document.createElement('h2');
    h2.textContent = listTitle;
    h2.classList.add('text-2xl', 'font-bold',);
    listDiv.appendChild(h2);

    for (let i = 0; i < Math.min(items.length, 3); i++) {
        listDiv.appendChild(createListItem(items[i]));
    }

    listDiv.appendChild(createListLink(listId));
}

function createListItem(item) {
    const div = document.createElement('div');
    div.classList.add('resultDivSection', 'flex', 'items-center', 'justify-between', 'border-b', 'border-gray-200', 'py-2');
    const p = document.createElement('p');
    p.textContent = item.id.name;
    p.classList.add('text-lg', 'font-semibold');
    const img = document.createElement('img');
    img.src = item.id.img;
    img.alt = item.id.name;
    img.classList.add('w-16', 'object-cover', 'rounded');
    div.appendChild(p);
    div.appendChild(img);
    return div;
}

function createListLink(listId) {
    const div = document.createElement('div');
    div.classList.add('list-item', 'list-none', 'mt-4');
    const a = document.createElement('a');
    a.href = '/' + listId + 'list/' + profileName;
    a.textContent = 'Zobraziť celý list';
    a.classList.add('border', 'border-blue-500', 'hover:border-blue-700', 'text-blue-500', 'hover:text-blue-700', 'py-1', 'px-4', 'rounded');
    div.appendChild(a);
    return div;
}

fetchProfileAndAnimeMangaList();