const api = 'http://localhost:3000';

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

let userAnimeList = [];
let userMangaList = [];

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

if (localStorage.getItem('token')) {
    fetch(api + '/account', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
        .then(response => {
            if (!response.ok) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            return response.json();
        })
        .then(user => {
            document.getElementById('login-link').innerText = user.name;
            document.getElementById('login-link').href = '/account';
            getLists();
        })
        .catch(error => {
            console.error('Error:', error);
        });
} else {
    document.getElementById('login-link').innerText = 'Prihlásiť sa';
}
