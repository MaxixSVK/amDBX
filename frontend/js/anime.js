document.addEventListener('DOMContentLoaded', function () {
  let urlString = window.location.href;
  let Slug = urlString.split("anime/")[1];
  fetch(api + '/anime/slug/' + Slug)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(anime => {
      const mainElement = document.querySelector('main');
      const animeDiv = document.createElement('div');
      animeDiv.classList.add('p-4', 'mx-auto', 'mt-4', 'max-w-4xl', 'bg-white', 'rounded-lg', 'flex', 'flex-wrap', 'md:flex-nowrap');

      const imgDiv = document.createElement('div');
      imgDiv.classList.add('w-full', 'md:w-1/2', 'mb-4', 'md:mb-0');
      const img = document.createElement('img');
      img.src = anime.img;
      img.alt = anime.name;
      img.classList.add('w-full', 'rounded');
      imgDiv.appendChild(img);
      animeDiv.appendChild(imgDiv);

      const textDiv = document.createElement('div');
      textDiv.classList.add('w-full', 'md:w-1/2', 'md:pl-4');

      const h2 = document.createElement('h2');
      h2.textContent = anime.name;
      h2.classList.add('text-2xl', 'font-bold', 'mb-2');
      textDiv.appendChild(h2);

      const userEntry = document.createElement('button');
      userEntry.classList.add('border', 'border-blue-500', 'hover:border-blue-700', 'text-blue-500', 'hover:text-blue-700', 'py-2', 'px-4', 'rounded');
      if (token) {
        fetchDataSearch(api + '/account/anime', {
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        }).then(data => {
          if (data.some(item => item.id._id === anime._id)) {
            userEntry.textContent = 'Upraviť';
            userEntry.onclick = () => {
              editUserEntry(anime, 'Anime');
            };
          } else {
            userEntry.textContent = 'Pridať';
            userEntry.onclick = async () => {
              await addUserEntry(anime, 'Anime');
              userEntry.textContent = 'Upraviť';
              editUserEntry(anime, 'Anime');
            };
          }
        });
      } else {
        userEntry.textContent = 'Pridať';
        userEntry.onclick = () => {
          window.location.href = '/login';
        };
      }
      textDiv.appendChild(userEntry);

      const description = document.createElement('p');
      description.textContent = anime.description;
      description.classList.add('text-gray-700', 'mb-2');
      textDiv.appendChild(description);

      const genre = document.createElement('p');
      genre.textContent = `Genre: ${anime.genre}`;
      genre.classList.add('text-sm', 'text-gray-500', 'mb-2');
      textDiv.appendChild(genre);

      const releaseDate = document.createElement('p');
      releaseDate.textContent = `Release Date: ${new Date(anime.releaseDate).toLocaleDateString()}`;
      releaseDate.classList.add('text-sm', 'text-gray-500', 'mb-2');
      textDiv.appendChild(releaseDate);

      const episodes = document.createElement('p');
      episodes.textContent = `Episodes: ${anime.episodes}`;
      episodes.classList.add('text-sm', 'text-gray-500', 'mb-2');
      textDiv.appendChild(episodes);

      const status = document.createElement('p');
      status.textContent = `Status: ${anime.status}`;
      status.classList.add('text-sm', 'text-gray-500', 'mb-2');
      textDiv.appendChild(status);

      const studio = document.createElement('p');
      studio.textContent = `Studio: ${anime.studio}`;
      studio.classList.add('text-sm', 'text-gray-500', 'mb-2');
      textDiv.appendChild(studio);

      const lastUpdated = document.createElement('p');
      lastUpdated.textContent = `Last Updated: ${new Date(anime.lastUpdated).toLocaleDateString()}`;
      lastUpdated.classList.add('text-sm', 'text-gray-500', 'mb-2');
      textDiv.appendChild(lastUpdated);

      animeDiv.appendChild(textDiv);
      mainElement.appendChild(animeDiv);
    })
    .catch(error => {
      window.location.href = '/404';
    });
});