const express = require('express');
const router = express.Router();
const Manga = require('../models/manga');

function adminAuth(req, res, next) {
    if (req.headers.authorization === process.env.ADMIN_AUTH) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

router.post('/admin/manga/upload', adminAuth, (req, res) => {
    const manga = new Manga(req.body);
    manga.save()
        .then(() => {
            res.send('Manga uploaded!');
        })
        .catch(err => {
            res.status(400).send('Failed to upload manga');
        });
});

router.put('/admin/manga/update/:id', adminAuth, (req, res) => {
    req.body.lastUpdated = Date.now();
    Manga.findByIdAndUpdate(req.params.id, req.body)
        .then(() => {
            res.send('Manga updated!');
        })
        .catch(err => {
            res.status(400).send('Failed to update manga');
        });
});

router.delete('/admin/manga/delete/:id', adminAuth, (req, res) => {
    Manga.findByIdAndDelete(req.params.id)
        .then(() => {
            res.send('Manga deleted!');
        })
        .catch(err => {
            res.status(400).send('Failed to delete manga');
        });
});

router.get('/manga/specific/:id', (req, res) => {
    Manga.findById(req.params.id)
        .then(manga => {
            res.send(manga);
        })
        .catch(err => {
            res.status(404).send('Manga not found');
        });
});

router.get('/manga/lastUpdated', (req, res) => {
    Manga.find().sort({ lastUpdated: -1 }).limit(5)
        .then(manga => {
            res.send(manga);
        })
        .catch(err => {
            res.status(404).send('Failed to get updated manga');
        });
});

module.exports = router;