const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');

router.get('/name/:slug', (req, res) => {
    let slug = req.params.slug;
    Anime.findOne({ slug: slug })
        .then(anime => {
            if (!anime) throw new Error();
            res.send(anime);
        })
        .catch(err => {
            res.status(404).send('Anime not found');
        });
});

router.get('/lastUpdated', (req, res) => {
    Anime.find().sort({ lastUpdated: -1 }).limit(5)
        .then(anime => {
            res.send(anime);
        })
        .catch(err => {
            res.status(404).send('Failed to get updated anime');
        });
});

router.get('/search/:name', (req, res) => {
    const regex = new RegExp(req.params.name, 'i');
    Anime.find({ name: regex })
        .then(anime => {
            res.send(anime);
        })
        .catch(err => {
            res.status(404).send('Failed to find anime');
        });
});

module.exports = router;