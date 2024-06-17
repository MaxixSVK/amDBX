const express = require('express');
const router = express.Router();

const Anime = require('../models/anime');
const Manga = require('../models/manga');

const authenticateToken = require('../auth/account');
const checkModPermissions = require('../auth/mod');
router.use(authenticateToken);
router.use(checkModPermissions);

router.get('/', (req, res) => {
    res.status(200).send({ msg: 'OK' });
});

router.post('/anime/upload', (req, res, next) => {
    const anime = new Anime(req.body);
    anime.save()
        .then(() => {
            res.send({ msg: 'Nahrané' });
        })
        .catch(err => {
            next(err);
        });
});

router.put('/anime/update', async (req, res, next) => {
    const id = req.body.id;
    if (!id) {
        return res.status(400).send({ msg: 'Nebolo poskytnuté ID' });
    }

    if (!req.body) {
        return res.status(400).send({ msg: 'Neboli poskytnuté údaje' });
    }

    req.body.lastUpdated = Date.now();

    try {
        const updatedAnime = await Anime.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedAnime) {
            return res.status(404).send({ msg: 'Anime nebolo nájdené' });
        }
        res.send(updatedAnime);
    } catch (err) {
        next(err);
    }
});

router.delete('/anime/delete', async (req, res, next) => {
    const id = req.body.id;
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

router.post('/manga/upload', (req, res, next) => {
    const manga = new Manga(req.body);
    manga.save()
        .then(() => {
            res.send({ msg: 'Nahrané' });
        })
        .catch(err => {
            next(err);
        });
});

router.put('/manga/update', async (req, res, next) => {
    const id = req.body.id;
    if (!id) {
        return res.status(400).send({ msg: 'Nebolo poskytnuté ID' });
    }

    if (!req.body) {
        return res.status(400).send({ msg: 'Neboli poskytnuté údaje' });
    }

    req.body.lastUpdated = Date.now();

    try {
        const updatedManga = await Manga.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedManga) {
            return res.status(404).send({ msg: 'Manga nebola nájdená' });
        }
        res.send(updatedManga);
    } catch (err) {
        next(err);
    }
});

router.delete('/manga/delete', async (req, res, next) => {
    const id = req.body.id;
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