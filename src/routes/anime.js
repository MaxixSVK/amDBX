const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');

function adminAuth(req, res, next) {
    if (req.headers.authorization === process.env.ADMIN_AUTH) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

router.post('/admin/anime/upload', adminAuth, (req, res) => {
    const anime = new Anime(req.body);
    anime.save()
        .then(() => {
            res.send('Anime uploaded!');
        })
        .catch(err => {
            res.status(400).send('Failed to upload anime');
        });
});

router.put('/admin/anime/update/:id', adminAuth, (req, res) => {
    req.body.lastUpdated = Date.now();
    Anime.findByIdAndUpdate(req.params.id, req.body)
        .then(() => {
            res.send('Anime updated!');
        })
        .catch(err => {
            res.status(400).send('Failed to update anime');
        });
});

router.delete('/admin/anime/delete/:id', adminAuth, (req, res) => {
    Anime.findByIdAndDelete(req.params.id)
        .then(() => {
            res.send('Anime deleted!');
        })
        .catch(err => {
            res.status(400).send('Failed to delete anime');
        });
});

router.get('/anime/specific/:id', (req, res) => {
    Anime.findById(req.params.id)
        .then(anime => {
            res.send(anime);
        })
        .catch(err => {
            res.status(404).send('Anime not found');
        });
});

router.get('/anime/lastUpdated', (req, res) => {
    Anime.find().sort({ lastUpdated: -1 }).limit(5)
        .then(anime => {
            res.send(anime);
        })
        .catch(err => {
            res.status(404).send('Failed to get updated anime');
        });
});

module.exports = router;