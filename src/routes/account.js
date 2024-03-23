const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  req.user = null;

  const token = req.headers['authorization'];
  if (!token) return res.status(401).send({ msg: 'No token provided'});

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(404).send({ msg: 'Failed to authenticate token'});

    const dbUser = await User.findById(user.id);
    if (!dbUser) return res.status(403).send({ msg: 'User not found'});

    req.user = user;
    next();
  });
};

router.get('/', authenticateToken, (req, res) => {
  User.findById(req.user.id)
    .select('-_id -password')
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).send({ msg: 'Internal server error'});
    });
});


router.post('/anime/add', authenticateToken, (req, res) => {
  User.findOne({ _id: req.user.id, 'anime.id': req.body.id })
    .then(user => {
      if (user) {
        res.status(400).send({ msg: 'Anime already added'});
      } else {
        User.findByIdAndUpdate(req.user.id, { $push: { anime: req.body } })
          .then(() => {
            res.send({ msg: 'Anime added to account'});
          })
          .catch(err => {
            res.status(400).send({ msg: 'Failed to add anime'});
          });
      }
    })
    .catch(err => {
      res.status(500).send({ msg: 'Internal server error'});
    });
});

router.post('/anime/remove', authenticateToken, (req, res) => {
  User.findByIdAndUpdate(req.user.id, { $pull: { anime: req.body } })
    .then(() => {
      res.send({ msg: 'Anime removed from account'});
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to remove anime'});
    });
});

router.post('/anime/update', authenticateToken, (req, res) => {
  User.updateOne({ _id: req.user.id, 'anime._id': req.body._id }, { $set: { 'anime.$': req.body } })
    .then(() => {
      res.send({ msg: 'Anime updated'});
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to update anime'});
    });
});

router.get('/anime/list', authenticateToken, (req, res) => {
  User.findById(req.user.id)
    .populate('anime.id')
    .select('anime')
    .then(user => {
      res.json(user.anime);
    })
    .catch(err => {
      res.status(500);
    });
});

router.post('/manga/add', authenticateToken, (req, res) => {
  User.findOne({ _id: req.user.id, 'manga.id': req.body.id })
    .then(user => {
      if (user) {
        res.status(400).send({ msg: 'Manga already added'});
      } else {
        User.findByIdAndUpdate(req.user.id, { $push: { manga: req.body } })
          .then(() => {
            res.send({ msg: 'Manga added to account'});
          })
          .catch(err => {
            res.status(400).send({ msg: 'Failed to add manga'});
          });
      }
    })
    .catch(err => {
      res.status(500).send({ msg: 'Internal server error'});
    });
});

router.post('/manga/remove', authenticateToken, (req, res) => {
  User.findByIdAndUpdate(req.user.id, { $pull: { manga: req.body } })
    .then(() => {
      res.send({ msg: 'Manga removed from account'});
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to remove manga'});
    });
});

router.post('/manga/update', authenticateToken, (req, res) => {
  User.updateOne({ _id: req.user.id, 'manga._id': req.body._id }, { $set: { 'manga.$': req.body } })
    .then(() => {
      res.send({ msg: 'Manga updated'});
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to update manga'});
    });
});

router.get('/manga/list', authenticateToken, (req, res) => {
  User.findById(req.user.id)
    .populate('manga.id')
    .select('manga')
    .then(user => {
      res.json(user.manga);
    })
    .catch(err => {
      res.status(500);
    });
});



module.exports = router;