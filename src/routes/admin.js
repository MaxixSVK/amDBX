const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');

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

        if (dbUser.role !== 'admin') return res.status(403).send({ msg: 'You do not have the necessary permissions' });

        req.user = user;
        next();
    });
};

router.use(authenticateToken);

router.get('/', (req, res) => {
    res.status(200).send({ msg: 'OK' });
});

router.post('/role', async (req, res) => {

    const { username, newRole } = req.body;

    const userToPromote = await User.findOne({ name: username });
    if (!userToPromote) {
        return res.status(404).send({ msg: 'User not found' });
    }

    userToPromote.role = newRole;
    await userToPromote.save();

    res.send({ msg: 'User promotion successful' });
});

module.exports = router;