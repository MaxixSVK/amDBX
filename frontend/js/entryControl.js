function addUserEntry(item, type) {
    return fetch(api + `/account/${type.toLowerCase()}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            id: item._id,
        })
    });
}

async function editUserEntry(item, type) {
    searchModal.classList.add('hidden');
    document.body.classList.add('overflow-hidden')

    let anime, manga;

    if (type == 'Anime') {
        await fetch(api + `/account/anime`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(response => response.json()).then(data => {
            anime = data.find(a => a.id._id === item._id);
        });
    } else {
        await fetch(api + `/account/manga`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(response => response.json()).then(data => {
            manga = data.find(m => m.id._id === item._id);
        });
    }

    const editEntryModal = document.createElement('div');
    editEntryModal.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'flex', 'items-center', 'justify-center');
    editEntryModal.id = 'edit-entry-modal';

    const editEntryBackground = document.createElement('div');
    editEntryBackground.classList.add('fixed', 'inset-0', 'bg-black', 'opacity-50', 'blur', 'z-10');
    editEntryModal.appendChild(editEntryBackground);

    const editEntryForm = document.createElement('form');
    editEntryForm.classList.add('bg-white', 'p-6', 'rounded', 'shadow-lg', 'flex', 'flex-col', 'items-start', 'space-y-4', 'w-full', 'h-full', 'md:w-3/4', 'md:h-3/4', 'z-20', 'm-4', 'text-gray-700');
    editEntryForm.id = 'edit-entry-form';

    const closeButton = document.createElement('button');
    closeButton.id = 'close-modal-edit-entry';
    closeButton.classList.add('absolute', 'top-2', 'right-2', 'w-10', 'h-10', 'bg-red-500', 'text-white', 'rounded-full', 'p-2', 'focus:outline-none', 'lg:hidden');
    closeButton.textContent = 'X';

    const editEntryTitle = document.createElement('h2');
    editEntryTitle.textContent = item.name;
    editEntryTitle.classList.add('text-2xl', 'font-bold', 'mb-4');

    const editEntryScoreLabel = document.createElement('label');
    editEntryScoreLabel.textContent = 'Hodnotenie';
    editEntryScoreLabel.classList.add('block', 'text-sm', 'font-medium', 'text-gray-700');

    const editEntryScoreInput = document.createElement('input');
    editEntryScoreInput.type = 'number';
    editEntryScoreInput.min = 0;
    editEntryScoreInput.max = 10;
    editEntryScoreInput.name = 'userRating';
    editEntryScoreInput.value = type == 'Anime' ? anime.userRating : manga.userRating;

    let editEpisodesInput, editStatusInput;

    if (type == 'Anime') {
        const editEpisodesLabel = document.createElement('label');
        editEpisodesLabel.textContent = 'Epizódy';
        editEpisodesInput = document.createElement('input');
        editEpisodesInput.type = 'number';
        editEpisodesInput.min = 0;
        editEpisodesInput.name = 'userEpisodes';
        editEpisodesInput.value = anime.userEpisodes;

        const editStatusLabel = document.createElement('label');
        editStatusLabel.textContent = 'Status';
        editStatusInput = document.createElement('select');
        editStatusInput.name = 'userStatus';

        const statusOptions = ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'];
        const displayTexts = ['Práve sledujem', 'Dokončené', 'Odložené', 'Dropnuté', 'Plánujem'];

        statusOptions.forEach((option, index) => {
            const statusOption = document.createElement('option');
            statusOption.value = option;
            statusOption.textContent = displayTexts[index];
            statusOption.selected = anime.userStatus === option;
            editStatusInput.appendChild(statusOption);
        });

        editEntryForm.append(editEntryTitle, editEntryScoreLabel, editEntryScoreInput, editEpisodesLabel, editEpisodesInput, editStatusLabel, editStatusInput);
    } else {
        const editChaptersLabel = document.createElement('label');
        editChaptersLabel.textContent = 'Kapitoly';
        editChaptersInput = document.createElement('input');
        editChaptersInput.type = 'number';
        editChaptersInput.min = 0;
        editChaptersInput.name = 'userChapters';
        editChaptersInput.value = manga.userChapters;

        const editStatusLabel = document.createElement('label');
        editStatusLabel.textContent = 'Status';
        editStatusInput = document.createElement('select');
        editStatusInput.name = 'userStatus';

        const statusOptions = ['Reading', 'Completed', 'On Hold', 'Dropped', 'Plan to Read'];

        statusOptions.forEach(option => {
            const statusOption = document.createElement('option');
            statusOption.value = option;
            statusOption.textContent = option;
            statusOption.selected = manga.userStatus === option;
            editStatusInput.appendChild(statusOption);
        });

        editEntryForm.append(editEntryTitle, editEntryScoreLabel, editEntryScoreInput, editChaptersLabel, editChaptersInput, editStatusLabel, editStatusInput);
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('flex');

    const editEntrySubmit = document.createElement('button');
    editEntrySubmit.classList.add('border', 'border-blue-500', 'hover:border-blue-700', 'text-blue-500', 'hover:text-blue-700', 'py-1', 'px-4', 'rounded', 'mr-1');
    editEntrySubmit.type = 'submit';
    editEntrySubmit.textContent = 'Uložiť';

    const deleteEntryButton = document.createElement('button');
    deleteEntryButton.classList.add('border', 'border-red-500', 'hover:border-red-700', 'text-red-500', 'hover:text-red-700', 'py-1', 'px-4', 'rounded');
    deleteEntryButton.textContent = 'Odstrániť';

    buttonContainer.append(editEntrySubmit, deleteEntryButton, closeButton);
    editEntryForm.append(editEntryScoreLabel, editEntryScoreInput, buttonContainer);
    editEntryModal.appendChild(editEntryForm);

    document.body.appendChild(editEntryModal)

    editEntrySubmit.focus();

    editEntryModalElement = document.getElementById('edit-entry-modal');

    editEntryForm.addEventListener('submit', async function (event) {
        event.preventDefault(); 
        let entryData;

        if (type == 'Anime') {
            entryData = {
                userRating: editEntryScoreInput.value,
                userEpisodes: editEpisodesInput.value,
                userStatus: editStatusInput.value
            };
        } else {
            entryData = {
                userRating: editEntryScoreInput.value,
                userChapters: editChaptersInput.value,
                userStatus: editStatusInput.value
            };
        }

        fetch(api + `/account/${type.toLowerCase()}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                id: item._id,
                ...entryData
            })
        });
        document.body.classList.remove('overflow-hidden')
        editEntryModal.remove();
    });

    deleteEntryButton.addEventListener('click', async function () {
        fetch(api + `/account/${type.toLowerCase()}/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                id: item._id
            })
        });
        document.body.classList.remove('overflow-hidden')
        editEntryModal.remove();
    });

    document.getElementById('close-modal-edit-entry').addEventListener('click', function () {
        document.body.classList.remove('overflow-hidden')
        editEntryModal.remove();
    });
}