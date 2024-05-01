const express = require('express');
const router = express.Router();
const Manga = require('../models/manga');

router.get('/name/:slug', (req, res) => {
    let slug = req.params.slug;
    Manga.findOne({ slug: slug })
        .then(manga => {
            if (!manga) throw new Error();
            res.send(manga);
        })
        .catch(err => {
            res.status(404).send({ msg: 'Manga nenájdená'});
        });
});

router.get('/lastUpdated', (req, res) => {
    Manga.find().sort({ lastUpdated: -1 }).limit(5)
        .then(manga => {
            res.send(manga);
        })
        .catch(err => {
            res.status(404).send({ msg: 'Žiadne informácie' });
        });
});

router.get('/search/:name', (req, res) => {
    const regex = new RegExp(req.params.name, 'i');
    Manga.find({ name: regex })
        .then(anime => {
            res.send(anime);
        })
        .catch(err => {
            res.status(404).send({ msg: 'Manga nenájdená' });
        });
});

module.exports = router;