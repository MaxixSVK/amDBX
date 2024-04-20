const express = require('express');
const router = express.Router();
const Alert = require('../models/alerts');

router.get('/', async (req, res) => {
    const now = new Date();
    const alerts = await Alert.find({
        created: { $lte: now },
        until: { $gte: now }
    });
    res.send(alerts);
});

module.exports = router;