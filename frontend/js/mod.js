if (!token) {
    window.location.href = 'login.html';
}

fetch(api + '/mod', {
    headers: {
        'Authorization': token
    }
}).then(response => {
    if (!response.ok) {
        window.location.href = 'index.html';
    }
}).catch(error => {
    console.error('Error:', error);
});

function uploadFile() {
    const input = document.getElementById('myFile');
    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch(cdn + '/upload', {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        body: formData
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    }).then(data => {
        const cdnStatus = document.getElementById('cdnStatus');
        console.log(data);
        cdnStatus.innerHTML = `Message: ${data.msg} <br> Link: <a href="${data.file}">${data.file}</a>`;
    }).catch(error => {
        console.error('Error:', error);
    });
}