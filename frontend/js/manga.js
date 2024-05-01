document.addEventListener('DOMContentLoaded', function() {
    let urlString = window.location.href;
    let slug = urlString.split("manga/")[1];
    fetch(api + '/manga/name/' + slug)
      .then(response => response.json())
      .then(manga => {
        const mainElement = document.querySelector('main');
        const mangaDiv = document.createElement('div');
        mangaDiv.innerHTML = `
          <h2>${manga.name}</h2>
          <img src="${manga.img}" alt="${manga.name}" />
          <p>${manga.description}</p>
          <p>Genre: ${manga.genre}</p>
          <p>Release Date: ${new Date(manga.releaseDate).toLocaleDateString()}</p>
          <p>Volumes: ${manga.volumes}</p>
          <p>Chapters: ${manga.chapters}</p>
          <p>Status: ${manga.status}</p>
          <p>Last Updated: ${new Date(manga.lastUpdated).toLocaleDateString()}</p>
        `;
        mainElement.appendChild(mangaDiv);
      })
      .catch(error => console.error('Error:', error));
  });