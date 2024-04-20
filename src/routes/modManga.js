const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');
const Manga = require('../models/manga');

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
    const manga = new Manga(req.body);
    manga.save()
        .then(() => {
            res.send('Manga uploaded!');
        })
        .catch(err => {
            res.status(400).send('Failed to upload manga');
        });
});

router.put('/update/:id', (req, res) => {
    req.body.lastUpdated = Date.now();
    Manga.findByIdAndUpdate(req.params.id, req.body)
        .then(() => {
            res.send('Manga updated!');
        })
        .catch(err => {
            res.status(400).send('Failed to update manga');
        });
});

router.delete('/delete/:id', (req, res) => {
    Manga.findByIdAndDelete(req.params.id)
        .then(() => {
            res.send('Manga deleted!');
        })
        .catch(err => {
            res.status(400).send('Failed to delete manga');
        });
});

module.exports = router;