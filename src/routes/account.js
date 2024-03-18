const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
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


module.exports = router;