document.addEventListener('DOMContentLoaded', function() {
    let urlString = window.location.href;
    let Name = urlString.split("anime/")[1];
    fetch(api + '/anime/name/' + Name)
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
    })
      .then(anime => {
        const mainElement = document.querySelector('main');
        const animeDiv = document.createElement('div');
        animeDiv.innerHTML = `
          <h2>${anime.name}</h2>
          <img src="${anime.img}" alt="${anime.name}" />
          <p>${anime.description}</p>
          <p>Genre: ${anime.genre}</p>
          <p>Release Date: ${new Date(anime.releaseDate).toLocaleDateString()}</p>
          <p>Episodes: ${anime.episodes}</p>
          <p>Status: ${anime.status}</p>
          <p>Studio: ${anime.studio}</p>
          <p>Last Updated: ${new Date(anime.lastUpdated).toLocaleDateString()}</p>
        `;
        mainElement.appendChild(animeDiv);
      })
      .catch(error => {
        window.location.href = '/404';
      });
  });