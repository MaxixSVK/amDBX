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
    console.error('Error:', error);
  });