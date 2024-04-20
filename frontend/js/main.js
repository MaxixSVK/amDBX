const api = 'http://localhost:3000/api';
const cdn = 'http://localhost:3000/cdn';

const token = localStorage.getItem('token');

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const body = document.body; 

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    if (nav.classList.contains('active')) {
        body.classList.add('no-scroll');
    } else {
        body.classList.remove('no-scroll');
    }
});

if (localStorage.getItem('token')) {
    fetch(api + '/account', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
        .then(response => {
            if (!response.ok) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            }
            return response.json();
        })
        .then(user => {
            document.getElementById('login-link').innerText = user.name;
        })
        .catch(error => {
            console.error('Error:', error);
        });
} else {
    document.getElementById('login-link').innerText = 'Prihlásiť sa';
}

var modal = document.getElementById("search-modal");

let userAnimeList = [];
let userMangaList = [];

function search() {
    modal.style.display = "block";

    if (localStorage.getItem('token')) {
        fetch(api + '/account/anime/list', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(animeList => {
                userAnimeList = animeList.map(a => a.id._id);
            })

        fetch(api + '/account/manga/list', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(mangaList => {
                userMangaList = mangaList.map(m => m.id._id);
            })
    }
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', function (event) {
    event.preventDefault();

    modal.style.display = "block";

    const searchTerm = searchInput.value;

    if (searchTerm.length === 0) {
        document.getElementById('search-results').innerHTML = '';
        return;
    }

    fetch(api + `/anime/search/${searchTerm}`)
        .then(response => response.json())
        .then(anime => {
            const resultsDiv = document.getElementById('search-results');
            resultsDiv.innerHTML = '';

            if (anime.length === 0) {
                const p = document.createElement('p');
                p.textContent = 'No Anime found';
                p.classList.add('noResults');
                resultsDiv.appendChild(p);
                return;
            } else {
                const p = document.createElement('p');
                p.textContent = 'Anime';
                p.classList.add('searchSection');
                resultsDiv.appendChild(p);
            }

            anime.forEach(a => {
                const resultDivSection = document.createElement('div');
                resultDivSection.classList.add('resultDivSection');

                const titleButtonWrapper = document.createElement('div');
                titleButtonWrapper.classList.add('title-button-wrapper');

                const p = document.createElement('p');
                p.textContent = a.name;

                const button = document.createElement('button');
                if (token) {
                    if (userAnimeList.includes(a._id)) {
                        button.textContent = 'Upraviť';

                    } else {
                        button.textContent = 'Pridať';
                        button.onclick = function () {
                            fetch(api + '/account/anime/add', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': localStorage.getItem('token')
                                },
                                body: JSON.stringify({
                                    id: a._id
                                })
                            })
                            button.textContent = 'Upraviť';
                        };
                    }
                } else {
                    button.textContent = 'Prihlásiť sa';
                    button.onclick = function () {
                        window.location.href = 'login.html';
                    };
                }
                titleButtonWrapper.appendChild(p);
                titleButtonWrapper.appendChild(button);

                const img = document.createElement('img');
                img.src = a.img;

                resultDivSection.appendChild(titleButtonWrapper);
                resultDivSection.appendChild(img);
                resultsDiv.appendChild(resultDivSection);
            });
        });

    fetch(api + `/manga/search/${searchTerm}`)
        .then(response => response.json())
        .then(manga => {
            const resultsDiv = document.getElementById('search-results');

            if (manga.length === 0) {
                const p = document.createElement('p');
                p.textContent = 'No Manga found';
                p.classList.add('noResults');
                resultsDiv.appendChild(p);
                return;
            } else {
                const p = document.createElement('p');
                p.textContent = 'Manga';
                p.classList.add('searchSection');
                resultsDiv.appendChild(p);
            }

            manga.forEach(a => {
                const resultDivSection = document.createElement('div');
                resultDivSection.classList.add('resultDivSection');

                const titleButtonWrapper = document.createElement('div');
                titleButtonWrapper.classList.add('title-button-wrapper');

                const p = document.createElement('p');
                p.textContent = a.name;

                const button = document.createElement('button');
                if (token) {
                    if (userMangaList.includes(a._id)) {
                        button.textContent = 'Upraviť';
                    } else {
                        button.textContent = 'Pridať';
                        button.onclick = function () {
                            fetch(api + '/account/manga/add', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': localStorage.getItem('token')
                                },
                                body: JSON.stringify({
                                    id: a._id
                                })
                            })
                            button.textContent = 'Upraviť';
                        };
                    }
                } else {
                    button.textContent = 'Prihlásiť sa';
                    button.onclick = function () {
                        window.location.href = 'login.html';
                    };
                }
                titleButtonWrapper.appendChild(p);
                titleButtonWrapper.appendChild(button);

                const img = document.createElement('img');
                img.src = a.img;

                resultDivSection.appendChild(titleButtonWrapper);
                resultDivSection.appendChild(img);
                resultsDiv.appendChild(resultDivSection);
            });
        });
});