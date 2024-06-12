const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcement');

router.get('/', async (req, res, next) => {
    const now = new Date();
    await Announcement.find({
        created: { $lte: now },
        until: { $gte: now }
    }).then(announcements => {
        res.status(200).json(announcements);
    }).catch(err => {
        next(err);
    });
});

module.exports = router;