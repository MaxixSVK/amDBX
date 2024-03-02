fetch('http://localhost:3000/api/anime/lastUpdated')
  .then(response => response.json())
  .then(data => {
    const lastUpdatedDiv = document.querySelector('#lastUpdated_anime_row');
    data.forEach(anime => {
      const animeDiv = document.createElement('div');
      animeDiv.classList.add('anime');
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
      mangaDiv.classList.add('manga');
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