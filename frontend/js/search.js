let userAnimeList = [];
let userMangaList = [];

var modal = document.getElementsByTagName("search")[0];

async function getLists() {
    const [animeList, mangaList] = await Promise.all([
        fetchData(api + '/account/anime/list', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }),
        fetchData(api + '/account/manga/list', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
    ]);

    userAnimeList = animeList.map(a => a.id._id);
    userMangaList = mangaList.map(m => m.id._id);
}

function search() {
    modal.style.display = "block";
    if (token) {
        getLists();
    }
}

const searchInput = document.getElementById('search-input');
function createElement(type, properties = {}) {
    const element = document.createElement(type);
    Object.assign(element, properties);
    return element;
}

function appendChildren(parent, children) {
    children.forEach(child => parent.appendChild(child));
}

async function fetchData(url, options = {}) {
    const response = await fetch(url, options);
    return response.json();
}

searchInput.addEventListener('input', async function (event) {
    event.preventDefault();

    modal.style.display = "block";

    const searchTerm = searchInput.value;

    if (searchTerm.length === 0) {
        document.getElementById('search-results').innerHTML = '';
        return;
    }

    const [anime, manga] = await Promise.all([
        fetchData(api + `/anime/search/${searchTerm}`),
        fetchData(api + `/manga/search/${searchTerm}`)
    ]);

    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = '';

    function createSearchResults(type, list, addUrl) {
        if (list.length === 0) {
            appendChildren(resultsDiv, [createElement('p', {textContent: `No ${type} found`, classList: ['noResults']})]);
        } else {
            appendChildren(resultsDiv, [createElement('p', {textContent: type, classList: ['searchSection']})]);
        }
    
        list.forEach(item => {
            const resultDivSection = createElement('div', {classList: ['resultDivSection']});
            const titleButtonWrapper = createElement('div', {classList: ['title-button-wrapper']});
            const p = createElement('p', {textContent: item.name});
            const button = createElement('button', {
                textContent: token && (type === 'Anime' ? userAnimeList.includes(item._id) : userMangaList.includes(item._id)) ? 'Upraviť' : 'Pridať',
                onclick: function () {
                    if (!token) {
                        window.location.href = '/login';
                        return;
                    }
                    fetch(addUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            id: item._id
                        })
                    })
                    this.textContent = 'Upraviť';
                }
            });
            const img = createElement('img', {src: item.img});
    
            appendChildren(titleButtonWrapper, [p, button]);
            appendChildren(resultDivSection, [titleButtonWrapper, img]);
            resultsDiv.appendChild(resultDivSection);
        });
    }

    createSearchResults('Anime', anime, api + '/account/anime/add');
    createSearchResults('Manga', manga, api + '/account/manga/add');
});

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}