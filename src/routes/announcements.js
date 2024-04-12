const express = require('express');
const router = express.Router();
const Alert = require('../models/alerts');

function adminAuth(req, res, next) {
    if (req.headers.authorization === process.env.ADMIN_AUTH) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

router.get('/', async (req, res) => {
    const now = new Date();
    const alerts = await Alert.find({
        created: { $lte: now },
        until: { $gte: now }
    });
    res.send(alerts);
});

router.post('/', adminAuth, async (req, res) => {
    const alert = new Alert({
        name: req.body.name,
        description: req.body.description,
        until: req.body.until
    });

    const result = await alert.save();
    res.send(result);
});

router.put('/:id', adminAuth, async (req, res) => {
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
            return res.status(404).send({msg: 'The alert with the given ID was not found'});
        } else {
            res.send(result);
        }
    } catch (error) {
        return res.status(500).send({ msg: 'Internal server error' });
    }
});

router.delete('/:id', adminAuth, async (req, res) => {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ msg: 'Invalid ID format' });
    }

    try {
        const result = await Alert.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send({msg: 'The alert with the given ID was not found'});
        } else {
            return res.send(result);
        }
    } catch (error) {
        return res.status(500).send({ msg: 'Internal server error' });
    }
});

module.exports = router;