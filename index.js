const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

mongoose.connect(process.env.DB_CONNECTION)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

const animeSchema = new mongoose.Schema({
    name: String,
    description: String,
    genre: String,
    releaseDate: Date,
    episodes: Number,
    banner: String,
    img: String,
    trailer: String,
    status: String,
    studio: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the amDB API!');
});

function adminAuth(req, res, next) {
    if (req.headers.authorization === process.env.ADMIN_AUTH) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

app.post('/api/admins/anime/upload', adminAuth, (req, res) => {
    const Anime = mongoose.model('Anime', animeSchema);
    const anime = new Anime(req.body);
    anime.save()
        .then(() => {
            res.send('Anime uploaded!');
        })
        .catch(err => {
            res.status(400).send('Failed to upload anime');
        });
});

app.put('/api/admins/anime/update/:id', adminAuth, (req, res) => {
    const Anime = mongoose.model('Anime', animeSchema);
    req.body.lastUpdated = Date.now();
    Anime.findByIdAndUpdate(req.params.id, req.body)
        .then(() => {
            res.send('Anime updated!');
        })
        .catch(err => {
            res.status(400).send('Failed to update anime');
        });
});

app.delete('/api/admins/anime/delete/:id', adminAuth, (req, res) => {
    const Anime = mongoose.model('Anime', animeSchema);
    Anime.findByIdAndDelete(req.params.id)
        .then(() => {
            res.send('Anime deleted!');
        })
        .catch(err => {
            res.status(400).send('Failed to delete anime');
        });
});

app.get('/api/anime/specific/:id', (req, res) => {
    const Anime = mongoose.model('Anime', animeSchema);
    Anime.findById(req.params.id)
        .then(anime => {
            res.send(anime);
        })
        .catch(err => {
            res.status(404).send('Anime not found');
        });
});


app.get('/api/anime/lastUpdated', (req, res) => {
    const Anime = mongoose.model('Anime', animeSchema);
    Anime.find().sort({lastUpdated: -1}).limit(5)
        .then(anime => {
            res.send(anime);
        })
        .catch(err => {
            res.status(404).send('Failed to get updated anime');
        });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
