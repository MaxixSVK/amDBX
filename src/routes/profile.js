const express = require('express');
const router = express.Router();
const User = require('../models/user');
require('dotenv').config();

router.get('/:name', (req, res) => {
    User.findOne({ name: req.params.name })
        .select('-password -changedPassword -_id -__v -email')
        .populate('anime.id manga.id') 
        .then(user => {
            if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).json(user);
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.get('/:name/anime', (req, res) => {
    User.findOne({ name: req.params.name })
        .select('name anime')
        .populate('anime.id')
        .then(user => {
            if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).json(user);
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.get('/:name/manga', (req, res) => {
    User.findOne({ name: req.params.name })
        .select('name manga')
        .populate('manga.id')
        .then(user => {
            if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).json(user);
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

module.exports = router;