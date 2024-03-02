const express = require('express');
const router = express.Router();

function adminAuth(req, res, next) {
    if (req.headers.authorization === process.env.ADMIN_AUTH) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

router.get('/', (req, res) => {
    res.send('Welcome to the amDBX API!');
});

router.get('/api/admin', adminAuth, (req, res) => {
    res.send('Welcome to the admin API!');
});

module.exports = router;