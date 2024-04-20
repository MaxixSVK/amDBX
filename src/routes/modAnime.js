const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');
const Anime = require('../models/anime');

const authenticateToken = (req, res, next) => {
    req.user = null;

    const token = req.headers['authorization'];
    if (!token) return res.status(401).send({ msg: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.status(404).send({ msg: 'Failed to authenticate token' });

        const dbUser = await User.findById(user.id);
        if (!dbUser) return res.status(403).send({ msg: 'User not found' });

        const tokenChangedPassword = user.changedPassword;
        const dbChangedPassword = dbUser.changedPassword;

        if (new Date(tokenChangedPassword).getTime() !== new Date(dbChangedPassword).getTime())
            return res.status(403).send({ msg: 'Token is invalid' });

        if (dbUser.role !== 'mod' && dbUser.role !== 'admin') return res.status(403).send({ msg: 'You do not have the necessary permissions' });

        req.user = user;
        next();
    });
};

router.use(authenticateToken);

router.get('/', (req, res) => {
    res.status(200);
});

router.post('/upload', (req, res) => {
    const anime = new Anime(req.body);
    anime.save()
        .then(() => {
            res.send('Anime uploaded!');
        })
        .catch(err => {
            res.status(400).send('Failed to upload anime');
        });
});

router.put('/update/:id', (req, res) => {
    req.body.lastUpdated = Date.now();
    Anime.findByIdAndUpdate(req.params.id, req.body)
        .then(() => {
            res.send('Anime updated!');
        })
        .catch(err => {
            res.status(400).send('Failed to update anime');
        });
});

router.delete('/delete/:id', (req, res) => {
    Anime.findByIdAndDelete(req.params.id)
        .then(() => {
            res.send('Anime deleted!');
        })
        .catch(err => {
            res.status(400).send('Failed to delete anime');
        });
});

module.exports = router;