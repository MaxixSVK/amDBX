const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');
const Alert = require('../models/alerts');

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

router.get('/', async (req, res) => {
    const now = new Date();
    const alerts = await Alert.find({
        created: { $lte: now },
        until: { $gte: now }
    });
    res.send(alerts);
});

router.post('/upload', async (req, res) => {
    const alert = new Alert({
        name: req.body.name,
        description: req.body.description,
        until: req.body.until
    });

    const result = await alert.save();
    res.send(result);
});

router.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ msg: 'Invalid ID format' });
    }
    try {
        const result = await Alert.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            until: req.body.until
        }, { new: true });

        if (!result) {
            return res.status(404).send({ msg: 'The alert with the given ID was not found' });
        } else {
            res.send(result);
        }
    } catch (error) {
        return res.status(500).send({ msg: 'Internal server error' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ msg: 'Invalid ID format' });
    }

    try {
        const result = await Alert.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send({ msg: 'The alert with the given ID was not found' });
        } else {
            return res.send(result);
        }
    } catch (error) {
        return res.status(500).send({ msg: 'Internal server error' });
    }
});


module.exports = router;