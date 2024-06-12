const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');

router.get('/search/:name', (req, res, next) => {
    const regex = new RegExp(req.params.name, 'i');
    Anime.find({ name: regex })
        .then(anime => {
            res.send(anime);
        })
        .catch(err => {
            next(err);
        });
});

router.get('/slug/:slug', (req, res, next) => {
    let slug = req.params.slug;
    Anime.findOne({ slug: slug })
        .then(anime => {
            if (!anime) return res.status(404).send({ msg: 'Anime nenájdené' });
            res.send(anime);
        })
        .catch(err => {
            next(err);
        });
});

router.get('/lastUpdated', (req, res, next) => {
    Anime.find().sort({ lastUpdated: -1 }).limit(5)
        .then(anime => {
            if (anime.length === 0) return res.status(204).send({ msg: 'Žiadne informácie' });
            res.send(anime);
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;