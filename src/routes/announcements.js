const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcement');

router.get('/', async (req, res) => {
    const now = new Date();
    const alerts = await Announcement.find({
        created: { $lte: now },
        until: { $gte: now }
    });
    res.send(alerts);
});

module.exports = router;