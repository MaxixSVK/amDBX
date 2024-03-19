const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  req.user = null;
  
  const token = req.headers['authorization'];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.get('/account', authenticateToken, (req, res) => {
  if (!req.user.id) {
    return res.sendStatus(403);
  }

  User.findById(req.user.id)
    .select('-_id -password')
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500);
    });
});

router.post('/account/anime/add', authenticateToken, (req, res) => {
  User.findByIdAndUpdate(req.user.id, { $push: { anime: req.body } })
    .then(() => {
      res.send('Anime added to account');
    })
    .catch(err => {
      res.status(400).send('Failed to add anime');
    });
});



module.exports = router;