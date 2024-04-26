const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');

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

        if (dbUser.role !== 'admin') return res.status(403).send({ msg: 'Nedostatočné práva' });

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

router.get('/announcements', async (req, res) => {
    const now = new Date();
    const alerts = await Alert.find({
        created: { $lte: now },
        until: { $gte: now }
    });
    res.send(alerts);
});

router.post('/announcements/upload', async (req, res) => {
    const alert = new Alert({
        name: req.body.name,
        description: req.body.description,
        until: req.body.until
    });

    const result = await alert.save();
    res.send(result);
});

router.put('/announcements/update/:id', async (req, res) => {
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

router.delete('/announcements/delete/:id', async (req, res) => {
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