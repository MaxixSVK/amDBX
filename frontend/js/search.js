let userAnimeListSearch = [];
let userMangaListSearch = [];

var searchModal = document.getElementsByTagName("search")[0];

async function getSearchLists() {
    const [animeList, mangaList] = await Promise.all([
        fetchDataSearch(api + '/account/anime/list', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }),
        fetchDataSearch(api + '/account/manga/list', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
    ]);

    userAnimeListSearch = animeList.map(a => a.id._id);
    userMangaListSearch = mangaList.map(m => m.id._id);
}

const searchInputSearch = document.getElementById('search-input');
const resultsDivSearch = document.getElementById('search-results');

searchModalDisplay = function () {
    if (token) {
        getSearchLists();
    }

    searchModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    searchInputSearch.value = '';
    resultsDivSearch.innerHTML = '<p>Začnite hľadať vaše obľúbené anime/mangu</p>';

    searchInputSearch.focus();
}

function createSearchElement(type, properties = {}) {
    const element = document.createElement(type);
    Object.assign(element, properties);
    return element;
}

function appendSearchChildren(parent, children) {
    children.forEach(child => parent.appendChild(child));
}

async function fetchDataSearch(url, options = {}) {
    const response = await fetch(url, options);
    return response.json();
}

async function editUserEntry(item, type) {
    // TODO: Implement editing user entry
}

searchInputSearch.addEventListener('input', async function (event) {
    event.preventDefault();

    searchModal.classList.remove('hidden');

    const searchTerm = searchInputSearch.value;

    if (searchTerm.length === 0) {
        document.getElementById('search-results').innerHTML = '';
        document.getElementById('search-results').innerHTML = '<p>Začnite hľadať vaše obľúbené anime/mangu</p>';
        return;
    }

    const [anime, manga] = await Promise.all([
        fetchDataSearch(api + `/anime/search/${searchTerm}`),
        fetchDataSearch(api + `/manga/search/${searchTerm}`)
    ]);


    resultsDivSearch.innerHTML = '';

    function createSearchResultsSearch(type, list, addUrl) {
        if (list.length === 0) {
            const noResultsElement = createSearchElement('p', { textContent: `Žiadne výsledky - ${type}`, classList: ['noResults'] });
            noResultsElement.classList.add('text-2xl', 'font-semibold', 'mb-2');
            appendSearchChildren(resultsDivSearch, [noResultsElement]);
        } else {
            appendSearchChildren(resultsDivSearch, [createSearchElement('p', { textContent: type, classList: ['searchSection'] })]);
            const searchSections = document.querySelectorAll('.searchSection');
            searchSections.forEach(section => {
                section.classList.add('text-2xl', 'font-semibold', 'mb-2');
            });
        }

        function addUserEntry(item, type) {
            fetch(addUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    id: item._id,
                })
            })
        }

        list.forEach(item => {
            const resultDivSectionSearch = createSearchElement('div', { classList: ['resultDivSection'] });
            resultDivSectionSearch.classList.add('resultDivSection', 'flex', 'items-center', 'justify-between', 'border-b', 'border-gray-200', 'py-2');

            const titleButtonWrapperSearch = createSearchElement('div', { classList: ['title-button-wrapper'] });
            titleButtonWrapperSearch.classList.add('flex', 'flex-col', 'items-start', 'justify-start',);

            const pSearch = createSearchElement('p', { textContent: item.name });
            pSearch.classList.add('text-lg', 'font-semibold');

            const buttonSearch = createSearchElement('button', {
                textContent: token && (type === 'Anime' ? userAnimeListSearch.includes(item._id) : userMangaListSearch.includes(item._id)) ? 'Upraviť' : 'Pridať',
                onclick: function () {
                    if (!token) {
                        window.location.href = '/login';
                        return;
                    }
                    if (this.textContent === 'Upraviť') {
                        editUserEntry(item, type);
                    } else {
                        addUserEntry(item, type);
                        this.textContent = 'Upraviť';
                        // TODO: fix function not running
                    }
                }
            });


            buttonSearch.classList.add('border', 'border-blue-500', 'hover:border-blue-700', 'text-blue-500', 'hover:text-blue-700', 'py-1', 'px-4', 'rounded');

            const imgSearch = createSearchElement('img', { src: item.img });
            imgSearch.classList.add('w-16', 'object-cover', 'rounded');

            appendSearchChildren(titleButtonWrapperSearch, [pSearch, buttonSearch]);
            appendSearchChildren(resultDivSectionSearch, [titleButtonWrapperSearch, imgSearch]);
            resultsDivSearch.appendChild(resultDivSectionSearch);
        });
    }

    createSearchResultsSearch('Anime', anime, api + '/account/anime/add');
    createSearchResultsSearch('Manga', manga, api + '/account/manga/add');
});

window.onclick = function (event) {
    if (event.target == document.querySelector('#search-modal > div:first-child')) {
        searchModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden')
    }
}

document.getElementById('close-modal').addEventListener('click', function () {
    document.getElementById('search-modal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
});