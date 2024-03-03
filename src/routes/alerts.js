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

router.get('/alerts', async (req, res) => {
    const now = new Date();
    const alerts = await Alert.find({ 
        created: { $lte: now },
        until: { $gte: now }
    });
    res.send(alerts);
});

router.post('/alerts', adminAuth, async (req, res) => {
    const alert = new Alert({
        name: req.body.name,
        description: req.body.description,
        until: req.body.until
    });

    const result = await alert.save();
    res.send(result);
});

router.put('/alerts/:id', adminAuth, async (req, res) => {
    const result = await Alert.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        until: req.body.until
    }, { new: true });

    if (!result) {
        res.status(404).send('The alert with the given ID was not found');
    } else {
        res.send(result);
    }
});

router.delete('/alerts/:id', adminAuth, async (req, res) => {
    const result = await Alert.findByIdAndDelete(req.params.id);
    if (!result) {
        res.status(404).send('The alert with the given ID was not found');
    } else {
        res.send(result);
    }
});

module.exports = router;