const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Announcement = require('../models/announcement');

const authenticateToken = require('../auth/account');
const checkAdminPermissions = require('../auth/admin');
router.use(authenticateToken);
router.use(checkAdminPermissions);

router.get('/', (req, res) => {
    res.status(200).send({ msg: 'OK' });
});

router.post('/role', async (req, res, next) => {
    try {
        const { username, newRole } = req.body;

        const userToPromote = await User.findOne({ name: username });
        if (!userToPromote) {
            return res.status(404).send({ msg: 'Používateľ s týmto menom neexistuje' });
        }

        userToPromote.role = newRole;
        await userToPromote.save();

        res.send({ msg: username + ' bola zmenená rola na ' + newRole });
    } catch (err) {
        next(err);
    }
});

router.post('/announcement', async (req, res) => {
    try {
        const announcement = new Announcement({
            name: req.body.name,
            description: req.body.description,
            until: req.body.until
        });

        await announcement.save();
        res.send({ msg: 'Oznámenie bolo úspešne vytvorené' });
    } catch (err) {
        next(err);
    }
});

router.delete('/announcement/:id', async (req, res) => {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ msg: 'Nesprávnz formát ID' });
    }

    try {
        const result = await Announcement.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send({ msg: 'Oznámenie s týmto ID neexistuje' });
        } else {
            res.send({ msg: 'Oznámenie bolo úspešne zmazané' });
        }
    } catch (error) {
        next(err);
    }
});

module.exports = router;