const express = require('express');
const router = express.Router();
const Manga = require('../models/manga');

router.get('/name/:name', (req, res) => {
    Manga.findById(req.params.name)
        .then(manga => {
            res.send(manga);
        })
        .catch(err => {
            res.status(404).send('Manga not found');
        });
});

router.get('/lastUpdated', (req, res) => {
    Manga.find().sort({ lastUpdated: -1 }).limit(5)
        .then(manga => {
            res.send(manga);
        })
        .catch(err => {
            res.status(404).send('Failed to get updated manga');
        });
});

router.get('/search/:name', (req, res) => {
    const regex = new RegExp(req.params.name, 'i');
    Manga.find({ name: regex })
        .then(anime => {
            res.send(anime);
        })
        .catch(err => {
            res.status(404).send('Failed to find anime');
        });
});

module.exports = router;