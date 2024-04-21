const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');

const router = express.Router();

const User = require('../models/user');
const { link } = require('fs');

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

let pathToCDN = 'cdn';


const storage = multer.diskStorage({
    destination: pathToCDN,
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50000000 }, 
}).single('file');

router.post('/upload', authenticateToken, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send('An error occurred while uploading the file');
        } else {
            res.send({ msg: 'File uploaded successfully', file: `${req.protocol}://${req.get('host')}/cdn/${req.file.filename}` });
        }
    });
});

router.get('/:name', (req, res) => {
    const options = {
        root: pathToCDN,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    const fileName = req.params.name;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
    });
});


module.exports = router;