let userAnimeListSearch = [];
let userMangaListSearch = [];

let searchModal = document.getElementsByTagName("search")[0];
let editEntryModalElement

async function getSearchLists() {
    const [animeList, mangaList] = await Promise.all([
        fetchDataSearch(api + '/account/anime', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }),
        fetchDataSearch(api + '/account/manga', {
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
    searchModal.classList.add('hidden');
    document.body.classList.add('overflow-hidden')

    const response = await fetch(api + `/account`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    });

    const data = await response.json();

    let anime, manga;

    if (type == 'Anime') {
        anime = data.anime.find(a => a.id === item._id);
    } else {
        manga = data.manga.find(m => m.id === item._id);
    }

    const editEntryModal = document.createElement('div');
    editEntryModal.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'flex', 'items-center', 'justify-center');
    editEntryModal.id = 'edit-entry-modal';

    const editEntryBackground = document.createElement('div');
    editEntryBackground.classList.add('fixed', 'inset-0', 'bg-black', 'opacity-50', 'blur', 'z-10');
    editEntryModal.appendChild(editEntryBackground);

    const editEntryForm = document.createElement('form');
    editEntryForm.classList.add('bg-white', 'p-6', 'rounded', 'shadow-lg', 'flex', 'flex-col', 'items-start', 'space-y-4', 'w-full', 'h-full', 'md:w-3/4', 'md:h-3/4', 'z-20', 'm-4', 'text-gray-700');
    editEntryForm.id = 'edit-entry-form';

    const closeButton = document.createElement('button');
    closeButton.id = 'close-modal-edit-entry';
    closeButton.classList.add('absolute', 'top-2', 'right-2', 'w-10', 'h-10', 'bg-red-500', 'text-white', 'rounded-full', 'p-2', 'focus:outline-none', 'lg:hidden');
    closeButton.textContent = 'X';
    editEntryForm.appendChild(closeButton);

    const editEntryTitle = document.createElement('h2');
    editEntryTitle.textContent = item.name;
    editEntryTitle.classList.add('text-2xl', 'font-bold', 'mb-4');

    const editEntryScoreLabel = document.createElement('label');
    editEntryScoreLabel.textContent = 'Hodnotenie';
    editEntryScoreLabel.classList.add('block', 'text-sm', 'font-medium', 'text-gray-700');
    const editEntryScoreInput = document.createElement('input');
    editEntryScoreInput.type = 'number';
    editEntryScoreInput.min = 0;
    editEntryScoreInput.max = 10;
    editEntryScoreInput.value = type == 'Anime' ? anime.userRating : manga.userRating;


    editEntryForm.append(editEntryTitle);

    let editEpisodesInput, editStatusInput;

    if (type == 'Anime') {
        const editEpisodesLabel = document.createElement('label');
        editEpisodesLabel.textContent = 'Epizódy';
        editEpisodesInput = document.createElement('input');
        editEpisodesInput.type = 'number';
        editEpisodesInput.min = 0;
        editEpisodesInput.value = anime.userEpisodes;

        const editStatusLabel = document.createElement('label');
        editStatusLabel.textContent = 'Status';
        editStatusInput = document.createElement('select');

        const statusOptions = ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'];
        const displayTexts = ['Práve sledujem', 'Dokončené', 'Odložené', 'Dropnuté', 'Plánujem'];
        
        statusOptions.forEach((option, index) => {
            const statusOption = document.createElement('option');
            statusOption.value = option;
            statusOption.textContent = displayTexts[index];
            statusOption.selected = anime.userStatus === option;
            editStatusInput.appendChild(statusOption);
        });

        editEntryForm.append(editEntryScoreLabel, editEntryScoreInput, editEpisodesLabel, editEpisodesInput, editStatusLabel, editStatusInput);
    } else {
        const editChaptersLabel = document.createElement('label');
        editChaptersLabel.textContent = 'Kapitoly';
        editChaptersInput = document.createElement('input');
        editChaptersInput.type = 'number';
        editChaptersInput.min = 0;
        editChaptersInput.value = manga.userChapters;

        const editStatusLabel = document.createElement('label');
        editStatusLabel.textContent = 'Status';
        editStatusInput = document.createElement('select');

        const statusOptions = ['Reading', 'Completed', 'On Hold', 'Dropped', 'Plan to Read'];

        statusOptions.forEach(option => {
            const statusOption = document.createElement('option');
            statusOption.value = option;
            statusOption.textContent = option;
            statusOption.selected = manga.userStatus === option;
            editStatusInput.appendChild(statusOption);
        });

        editEntryForm.append(editEntryScoreLabel, editEntryScoreInput, editChaptersLabel, editChaptersInput, editStatusLabel, editStatusInput);
    }

    const editEntrySubmit = document.createElement('button');
    editEntrySubmit.classList.add('border', 'border-blue-500', 'hover:border-blue-700', 'text-blue-500', 'hover:text-blue-700', 'py-1', 'px-4', 'rounded');
    editEntrySubmit.type = 'submit';
    editEntrySubmit.textContent = 'Uložiť';

    editEntryForm.append(editEntryScoreLabel, editEntryScoreInput, editEntrySubmit);
    editEntryModal.appendChild(editEntryForm);

    document.body.appendChild(editEntryModal)

    editEntryModalElement = document.getElementById('edit-entry-modal');

    editEntryForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        let entryData;

        if (type == 'Anime') {
            const userRating = editEntryScoreInput.value;
            const userEpisodes = editEpisodesInput.value;
            const userStatus = editStatusInput.value;
            entryData = { userRating, userEpisodes, userStatus };
        } else {
            const userRating = editEntryScoreInput.value;
            const userChapters = editChaptersInput.value;
            const userStatus = editStatusInput.value;
            entryData = { userRating, userChapters, userStatus };
        }

        fetch(api + `/account/${type.toLowerCase()}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                id: item._id,
                ...entryData
            })
        });
        document.body.classList.remove('overflow-hidden')
        editEntryModal.remove();
    });

    document.getElementById('close-modal-edit-entry').addEventListener('click', function () {
        document.body.classList.remove('overflow-hidden')
        editEntryModal.remove();
    });
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
                onclick: async function () {
                    if (!token) {
                        window.location.href = '/login';
                        return;
                    }
                    if (this.textContent === 'Upraviť') {
                        editUserEntry(item, type);
                    } else {
                        addUserEntry(item, type);
                        this.textContent = 'Upraviť';
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

document.getElementById('close-modal').addEventListener('click', function () {
    searchModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden')
});

window.onclick = function (event) {
    if (event.target == document.querySelector('#search-modal > div:first-child')) {
        searchModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    } else if (event.target == document.querySelector('#edit-entry-modal > div:first-child')) {
        document.body.classList.remove('overflow-hidden');
        editEntryModalElement.remove();
    }
}