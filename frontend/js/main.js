const token = localStorage.getItem('token');

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});
window.onload = function () {
    if (localStorage.getItem('token')) {
        fetch('http://localhost:3000/api/account/', {
            headers: {
                'Authorization': token
            }
        })
            .then(response => response.json())
            .then(user => {
                console.log(user);
                document.getElementById('login-link').innerText = user.name;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
};


var modal = document.getElementById("search-modal");

function search() {
    modal.style.display = "block";
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

    fetch(`http://localhost:3000/api/anime/search/${searchTerm}`)
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
                const p = document.createElement('p');
                p.textContent = a.name;
                resultsDiv.appendChild(p);
            });
        })
        .catch(err => {
            console.error(err);
        });

    fetch(`http://localhost:3000/api/manga/search/${searchTerm}`)
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
                const p = document.createElement('p');
                p.textContent = a.name;
                resultsDiv.appendChild(p);
            });
        })
        .catch(err => {
            console.error(err);
        });
});