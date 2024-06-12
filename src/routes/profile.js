const express = require('express');
const router = express.Router();
const User = require('../models/user');
require('dotenv').config();

router.get('/:name', (req, res, next) => {
    User.findOne({ name: req.params.name })
        .select('-password -changedPassword -_id -__v -email')
        .populate('anime.id manga.id')
        .then(user => {
            if (!user) return res.status(404).send({ msg: 'Používateľ nebol nájdený' });

            const animeCount = user.anime.length;
            const mangaCount = user.manga.length;

            const episodeCount = user.anime.reduce((total, anime) => total + anime.userEpisodes, 0);
            const chapterCount = user.manga.reduce((total, manga) => total + manga.userChapters, 0);

            res.status(200).json({
                user,
                stats: {
                    animeCount,
                    mangaCount,
                    episodeCount,
                    chapterCount
                }
            });
        })
        .catch(err => {
            next(err);
        });
});

router.get('/:name/anime', (req, res, next) => {
    User.findOne({ name: req.params.name })
        .select('name anime')
        .populate('anime.id')
        .then(user => {
            if (!user) return res.status(404).send({ msg: 'Používateľ nebol nájdený' });

            res.status(200).json(user);
        })
        .catch(err => {
            next(err);
        });
});

router.get('/:name/manga', (req, res, next) => {
    User.findOne({ name: req.params.name })
        .select('name manga')
        .populate('manga.id')
        .then(user => {
            if (!user) return res.status(404).send({ msg: 'Používateľ nebol nájdený' });

            res.status(200).json(user);
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;