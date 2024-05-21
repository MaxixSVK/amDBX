async function fetchData() {
  const mainElement = document.querySelector('main');

  const alertDiv = document.createElement('div');
  alertDiv.id = 'alerts';
  mainElement.appendChild(alertDiv);

  try {
    const response = await fetch(api + '/announcements');
    const data = await response.json();
    const alertsDiv = document.querySelector('#alerts');
    data.forEach(alert => {
      const alertDiv = document.createElement('div');
      alertDiv.classList.add('alert', 'p-4', 'bg-blue-100', 'rounded', 'mb-4', 'text-center');
      alertDiv.innerHTML = `
        <h3 class="text-2xl font-bold">${alert.name}</h3>
        <p>${alert.description}</p>
      `;
      alertsDiv.appendChild(alertDiv);
    });
  } catch (error) {
    const alertsDiv = document.querySelector('#alerts');
    alertDiv.classList.add('alert', 'p-4', 'bg-blue-100', 'rounded', 'mb-4');
    alertsDiv.innerHTML = `<h3 class="text-red-500">Nastala chyba pri načítavaní dát</h3>`;
  }

  try {
    const response = await fetch(api + '/anime/lastUpdated');
    const data = await response.json();
    const { lastUpdatedDiv, itemsDiv } = createLastUpdatedDiv('lastUpdated_anime_row', 'last-updated-anime');
    mainElement.appendChild(lastUpdatedDiv);
    data.forEach(anime => appendLastUpdatedItem(itemsDiv, anime, 'anime'));
  } catch (error) {
    console.error(error);
  }

  try {
    const response = await fetch(api + '/manga/lastUpdated');
    const data = await response.json();
    const { lastUpdatedDiv, itemsDiv } = createLastUpdatedDiv('lastUpdated_manga_row', 'last-updated-manga');
    mainElement.appendChild(lastUpdatedDiv);
    data.forEach(manga => appendLastUpdatedItem(itemsDiv, manga, 'manga'));
  } catch (error) {
    console.error(error);
  }
}

function createLastUpdatedDiv(id, titleText) {
  const lastUpdatedDiv = document.createElement('div');
  lastUpdatedDiv.id = id;
  lastUpdatedDiv.classList.add('mx-auto', 'w-full', 'flex', 'flex-col', 'justify-start');

  const title = document.createElement('p');
  title.classList.add('text-lg', 'font-bold');
  title.setAttribute('data-translate', titleText);
  lastUpdatedDiv.appendChild(title);

  const itemsDiv = document.createElement('div');
  itemsDiv.classList.add('flex', 'flex-row', 'overflow-x-auto', 'justify-between');
  lastUpdatedDiv.appendChild(itemsDiv);

  return { lastUpdatedDiv, itemsDiv };
}

function appendLastUpdatedItem(itemsDiv, item, type) {
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('p-4', 'bg-white', 'rounded', 'flex', 'flex-col', 'lg:w-1/6', 'w-full');

  const innerDiv = document.createElement('div');
  innerDiv.classList.add('w-44', 'mx-auto');

  const link = document.createElement('a');
  link.href = `${location.protocol}//${location.hostname}/${type}/${item.slug}`;

  const img = document.createElement('img');
  img.id = `${type}-img`;
  img.src = item.img;
  img.alt = item.name;
  img.classList.add('object-cover', 'rounded', 'w-full');

  link.appendChild(img);
  innerDiv.appendChild(link);

  const h3 = document.createElement('h3');
  h3.classList.add('mt-2', 'text-center', 'hidden', 'lg:block');
  h3.textContent = item.name;

  innerDiv.appendChild(h3);
  itemDiv.appendChild(innerDiv);

  itemsDiv.appendChild(itemDiv);
}

fetchData();