fetch('http://localhost:3000/api/anime/lastUpdated')
  .then(response => response.json())
  .then(data => {
    const lastUpdatedDiv = document.querySelector('#lastUpdated_anime_row');
    data.forEach(anime => {
      const animeDiv = document.createElement('div');
      animeDiv.classList.add('lastUpdated_row_item');
      animeDiv.innerHTML = `
        <img id='anime-img' src="${anime.img}" alt="${anime.name}" />
        <h3>${anime.name}</h3>
      `;
      lastUpdatedDiv.appendChild(animeDiv);
    });
  })
.catch(error => {
  const lastUpdatedDiv = document.querySelector('#lastUpdated_anime_row');
  lastUpdatedDiv.innerHTML = `<h3>Nastala chyba pri načítavaní dát</h3>`;
});

fetch('http://localhost:3000/api/manga/lastUpdated')
  .then(response => response.json())
  .then(data => {
    const lastUpdatedDiv = document.querySelector('#lastUpdated_manga_row');
    data.forEach(manga => {
      const mangaDiv = document.createElement('div');
      mangaDiv.classList.add('lastUpdated_row_item');
      mangaDiv.innerHTML = `
        <img id='manga-img' src="${manga.img}" alt="${manga.name}" />
        <h3>${manga.name}</h3>
      `;
      lastUpdatedDiv.appendChild(mangaDiv);
    });
  })
  .catch(error => {
    const lastUpdatedDiv = document.querySelector('#lastUpdated_manga_row');
    lastUpdatedDiv.innerHTML = `<h3>Nastala chyba pri načítavaní dát</h3>`;
  });

fetch('http://localhost:3000/api/alerts')
  .then(response => response.json())
  .then(data => {
    const alertsDiv = document.querySelector('#alerts');
    data.forEach(alert => {
      const alertDiv = document.createElement('div');
      alertDiv.classList.add('alert');
      alertDiv.innerHTML = `
        <h3>${alert.name}</h3>
        <p>${alert.description}</p>
      `;
      alertsDiv.appendChild(alertDiv);
    });
  })
  .catch(error => {
    const alertsDiv = document.querySelector('#alerts');
    alertsDiv.innerHTML = `<h3>Nastala chyba pri načítavaní dát</h3>`;
  });