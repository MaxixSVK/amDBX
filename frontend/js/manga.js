document.addEventListener('DOMContentLoaded', function() {
  let urlString = window.location.href;
  let slug = urlString.split("manga/")[1];
  fetch(api + '/manga/name/' + slug)
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(manga => {
      const mainElement = document.querySelector('main');
      const mangaDiv = document.createElement('div');
      mangaDiv.classList.add('p-4', 'mx-auto', 'mt-4', 'max-w-4xl', 'bg-white', 'rounded-lg', 'flex', 'flex-wrap', 'md:flex-nowrap');

      const imgDiv = document.createElement('div');
      imgDiv.classList.add('w-full', 'md:w-1/2', 'mb-4', 'md:mb-0');
      const img = document.createElement('img');
      img.src = manga.img;
      img.alt = manga.name;
      img.classList.add('w-full', 'rounded');
      imgDiv.appendChild(img);
      mangaDiv.appendChild(imgDiv);

      const textDiv = document.createElement('div');
      textDiv.classList.add('w-full', 'md:w-1/2', 'md:pl-4', 'p-4');

      const h2 = document.createElement('h2');
      h2.textContent = manga.name;
      h2.classList.add('text-2xl', 'font-bold', 'mb-2');
      textDiv.appendChild(h2);

      const description = document.createElement('p');
      description.textContent = manga.description;
      description.classList.add('text-gray-700', 'mb-2');
      textDiv.appendChild(description);

      const genre = document.createElement('p');
      genre.textContent = `Genre: ${manga.genre}`;
      genre.classList.add('text-sm', 'text-gray-500', 'mb-2');
      textDiv.appendChild(genre);

      const releaseDate = document.createElement('p');
      releaseDate.textContent = `Release Date: ${new Date(manga.releaseDate).toLocaleDateString()}`;
      releaseDate.classList.add('text-sm', 'text-gray-500', 'mb-2');
      textDiv.appendChild(releaseDate);

      const chapters = document.createElement('p');
      chapters.textContent = `Chapters: ${manga.chapters}`;
      chapters.classList.add('text-sm', 'text-gray-500', 'mb-2');
      textDiv.appendChild(chapters);

      const status = document.createElement('p');
      status.textContent = `Status: ${manga.status}`;
      status.classList.add('text-sm', 'text-gray-500', 'mb-2');
      textDiv.appendChild(status);

      const lastUpdated = document.createElement('p');
      lastUpdated.textContent = `Last Updated: ${new Date(manga.lastUpdated).toLocaleDateString()}`;
      lastUpdated.classList.add('text-sm', 'text-gray-500', 'mb-2');
      textDiv.appendChild(lastUpdated);

      mangaDiv.appendChild(textDiv);
      mainElement.appendChild(mangaDiv);
    })
    .catch(error => {
      window.location.href = '/404';
    });
});