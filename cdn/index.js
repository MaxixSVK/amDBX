const express = require('express');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(cors());

const User = require('../src/models/user');

mongoose.connect(process.env.DB_CONNECTION)
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...' + err));


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

let pathToCDN = 'files';

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

app.post('/upload', authenticateToken, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send('An error occurred while uploading the file');
        } else {
            res.send({ msg: 'File uploaded successfully', file: `${req.protocol}://${req.get('host')}/${req.file.filename}` });
        }
    });
});

app.get('/:name', (req, res) => {
    const options = {
        root: pathToCDN,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    const fileName = path.basename(req.params.name);
    res.sendFile(fileName, options, function (err) {
        if (err) {
            res.status(err.status).end();
        }
    });
});

app.listen(process.env.CDN_PORT, () => {
    console.log(`CDN is running on http://localhost:${process.env.CDN_PORT}`);
});