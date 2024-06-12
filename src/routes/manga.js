const express = require('express');
const router = express.Router();
const Manga = require('../models/manga');

router.get('/search/:name', (req, res, next) => {
    const regex = new RegExp(req.params.name, 'i');
    Manga.find({ name: regex })
        .then(manga => {
            res.send(manga);
        })
        .catch(err => {
            next(err);
        });
});

router.get('/slug/:slug', (req, res, next) => {
    let slug = req.params.slug;
    Manga.findOne({ slug: slug })
        .then(manga => {
            if (!manga) return res.status(404).send({ msg: 'Manga nenájdená' });
            res.send(manga);
        })
        .catch(err => {
            next(err);
        });
});

router.get('/lastUpdated', (req, res, next) => {
    Manga.find().sort({ lastUpdated: -1 }).limit(5)
        .then(manga => {
            if (manga.length === 0) return res.status(204).send({ msg: 'Žiadne informácie' });
            res.send(manga);
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;