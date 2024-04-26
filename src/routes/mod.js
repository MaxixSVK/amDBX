const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');
const Anime = require('../models/anime');
const Manga = require('../models/manga');

const authenticateToken = (req, res, next) => {
    req.user = null;

    const token = req.headers['authorization'];
    if (!token) return res.status(401).send({ msg: 'Nebol poskytnutý token' });
  
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) return res.status(404).send({ msg: 'Nebolo možné overiť token' });
  
      const dbUser = await User.findById(user.id);
      if (!dbUser) return res.status(403).send({ msg: 'Používateľ nenájdený' });
  
      const tokenChangedPassword = user.changedPassword;
      const dbChangedPassword = dbUser.changedPassword;
  
      if (new Date(tokenChangedPassword).getTime() !== new Date(dbChangedPassword).getTime())
        return res.status(403).send({ msg: 'Token je neplatný' });

        if (dbUser.role !== 'mod' && dbUser.role !== 'admin') return res.status(403).send({ msg: 'Nedostatočné práva' });

        req.user = user;
        next();
    });
};

router.use(authenticateToken);

router.get('/', (req, res) => {
    res.status(200).send({ msg: 'OK' });
});

router.post('/anime/upload', (req, res) => {
    const anime = new Anime(req.body);
    anime.save()
        .then(() => {
            res.send({ msg: 'Nahrané'});
        })
        .catch(err => {
            res.status(400).send({ msg: 'Nepodarilo sa nahrať'});
        });
});

router.put('/anime/update/:id', async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({ msg: 'Nebolo poskytnuté ID'});
    }

    if (!req.body) {
        return res.status(400).send({ msg: 'Neboli poskytnuté údaje'});
    }

    req.body.lastUpdated = Date.now();

    try {
        const updatedAnime = await Anime.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAnime) {
            return res.status(404).send({ msg: 'Anime nebolo nájdené'});
        }
        res.send(updatedAnime);
    } catch (err) {
        res.status(500).send({ msg: '500-chan: Server error' });
    }
});

router.delete('/anime/delete/:id', async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({ msg: 'Nebolo poskytnuté ID'});
    }

    try {
        const deletedAnime = await Anime.findByIdAndDelete(req.params.id);
        if (!deletedAnime) {
            return res.status(404).send({ msg: 'Anime nebolo nájdené'});
        }
        res.send({ msg: 'Anime bolo úspešne vymazané' });
    } catch (err) {
        res.status(500).send({ msg: '500-chan: Server error' });
    }
});

router.post('/manga/upload', (req, res) => {
    const manga = new Manga(req.body);
    manga.save()
        .then(() => {
            res.send({ msg: 'Nahrané' });
        })
        .catch(err => {
            res.status(400).send({ msg: 'Nepodarilo sa nahrať' });
        });
});

router.put('/manga/update/:id', async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({ msg: 'Nebolo poskytnuté ID'});
    }

    if (!req.body) {
        return res.status(400).send({ msg: 'Neboli poskytnuté údaje'});
    }

    req.body.lastUpdated = Date.now();

    try {
        const updatedManga = await Manga.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedManga) {
            return res.status(404).send({ msg: 'Manga nebola nájdená'});
        }
        res.send(updatedManga);
    } catch (err) {
        res.status(500).send({ msg: '500-chan: Server error' });
    }
});

router.delete('/manga/delete/:id', async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({ msg: 'Nebolo poskytnuté ID'});
    }

    try {
        const deletedManga = await Manga.findByIdAndDelete(req.params.id);
        if (!deletedManga) {
            return res.status(404).send({ msg: 'Manga nebola nájdená'});
        }
        res.send({ msg: 'Manga bola úspešne vymazaná' });
    } catch (err) {
        res.status(500).send({ msg: '500-chan: Server error' });
    }
});

module.exports = router;