const express = require('express');
const router = express.Router();
const Joi = require('joi');

const Anime = require('../models/anime');
const Manga = require('../models/manga');

const animeDataValidation = require('../dataValidation/anime');
const mangaDataValidation = require('../dataValidation/manga');

const authenticateToken = require('../auth/account');
const checkModPermissions = require('../auth/mod');
router.use(authenticateToken);
router.use(checkModPermissions);

router.get('/', (req, res) => {
    res.status(200).send({ msg: 'OK' });
});

router.post('/anime/add', async (req, res, next) => {
    const anime = new Anime(req.body);

    try {
        await animeDataValidation(req.body);
        await anime.save();
        res.send({ msg: 'Nahrané' });
    } catch (err) {
        if (err instanceof Joi.ValidationError) {
            return res.status(400).json({ msg: err.details[0].message });
        } else if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({ msg: 'Anime s týmto názvom už existuje' });
        } else {
            next(err);
        }
    }
});

router.put('/anime/update/:id', async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({ msg: 'Nebolo poskytnuté ID' });
    }

    try {
        await animeDataValidation(req.body);

        req.body.lastUpdated = Date.now();
        const updatedAnime = await Anime.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedAnime) {
            return res.status(404).send({ msg: 'Anime nebolo nájdené' });
        }
        res.send(updatedAnime);
    } catch (err) {
        if (err instanceof Joi.ValidationError) {
            return res.status(400).json({ msg: err.details[0].message });
        } else {
            next(err);
        }
    }
});

router.delete('/anime/delete/:id', async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({ msg: 'Nebolo poskytnuté ID' });
    }

    try {
        const deletedAnime = await Anime.findByIdAndDelete(id);
        if (!deletedAnime) {
            return res.status(404).send({ msg: 'Anime nebolo nájdené' });
        }
        res.send({ msg: 'Anime bolo úspešne vymazané' });
    } catch (err) {
        next(err);
    }
});

router.post('/manga/add', async (req, res, next) => {
    const manga = new Manga(req.body);

    try {
        await mangaDataValidation(req.body);
        await manga.save();
        res.send({ msg: 'Nahrané' });
    } catch (err) {
        if (err instanceof Joi.ValidationError) {
            return res.status(400).json({ msg: err.details[0].message });
        } else if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({ msg: 'Manga s týmto názvom už existuje' });
        } else {
            next(err);
        }
    }
});

router.put('/manga/update/:id', async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({ msg: 'Nebolo poskytnuté ID' });
    }

    try {
        await mangaDataValidation(req.body);

        req.body.lastUpdated = Date.now();
        const updatedManga = await Manga.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedManga) {
            return res.status(404).send({ msg: 'Manga nebola nájdená' });
        }
        res.send(updatedManga);
    } catch (err) {
        if (err instanceof Joi.ValidationError) { 
            return res.status(400).send({ msg: err.details[0].message });
        } else {
            next(err);
        }
    }
});

router.delete('/manga/delete/:id', async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({ msg: 'Nebolo poskytnuté ID' });
    }

    try {
        const deletedManga = await Manga.findByIdAndDelete(id);
        if (!deletedManga) {
            return res.status(404).send({ msg: 'Manga nebola nájdená' });
        }
        res.send({ msg: 'Manga bola úspešne vymazaná' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;