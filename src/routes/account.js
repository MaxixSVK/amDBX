const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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

    req.user = user;
    next();
  });
};

router.get('/', authenticateToken, (req, res) => {
  User.findById(req.user.id)
    .select('-_id -password -changedPassword')
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).send({ msg: 'Internal server error' });
    });
});

router.post('/register', function (req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  User.findOne({ email })
    .then(user => {
      if (user) return res.status(409).json({ msg: 'Email je už použitý na inom účte' });

      User.findOne({ name })
        .then(user => {
          if (user) return res.status(409).json({ msg: 'Používatelské meno už je zabrané' });

          const hashedPassword = bcrypt.hashSync(password, 10);

          const newUser = new User({
            name,
            email,
            password: hashedPassword,
            changedPassword: new Date()
          });

          newUser.save()
            .then(user => {
              const token = jwt.sign({ id: user._id, changedPassword: newUser.changedPassword }, process.env.JWT_SECRET, { expiresIn: '365d' });
              res.json({ token });
            })
            .catch(err => res.status(500).json({ msg: 'Server error' }));
        })
        .catch(err => res.status(500).json({ msg: 'Server error' }));
    })
    .catch(err => res.status(500).json({ msg: 'Server error' }));
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ msg: 'Nesprávne prihlasovacie údaje' });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      const token = jwt.sign({ id: user._id, changedPassword: user.changedPassword }, process.env.JWT_SECRET, { expiresIn: '365d' });
      res.json({ token });
    });
  })(req, res, next);
});

router.put('/change-password', authenticateToken, (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
        return res.status(400).send({ msg: 'Incorrect password' });
      }

      const hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);
      const changedPassword = new Date(); 

      User.findByIdAndUpdate(req.user.id, { password: hashedPassword, changedPassword: changedPassword })
        .then(() => {
          const token = jwt.sign({ id: req.user.id, changedPassword: changedPassword }, process.env.JWT_SECRET);
          res.send({ msg: 'Password changed', token: token });
        })
        .catch(err => {
          res.status(400).send({ msg: 'Failed to change password' });
        });
    })
    .catch(err => {
      res.status(500).send({ msg: 'Internal server error' });
    });
});

router.put('/change-email', authenticateToken, (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).send({ msg: 'Incorrect password' });
      }

      User.findByIdAndUpdate(req.user.id, { email: req.body.email })
        .then(() => {
          res.send({ msg: 'Email changed' });
        })
        .catch(err => {
          res.status(400).send({ msg: 'Failed to change email' });
        });
    })
    .catch(err => {
      res.status(500).send({ msg: 'Internal server error' });
    });
});

router.delete('/delete', authenticateToken, (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).send({ msg: 'Incorrect password' });
      }

      User.findByIdAndDelete(req.user.id)
        .then(() => {
          res.send({ msg: 'Account deleted' });
        })
        .catch(err => {
          res.status(400).send({ msg: 'Failed to delete account' });
        });
    })
    .catch(err => {
      res.status(500).send({ msg: 'Internal server error' });
    });
});

router.post('/anime/add', authenticateToken, (req, res) => {
  User.findOne({ _id: req.user.id, 'anime.id': req.body.id })
    .then(user => {
      if (user) {
        res.status(400).send({ msg: 'Anime already added' });
      } else {
        User.findByIdAndUpdate(req.user.id, { $push: { anime: req.body } })
          .then(() => {
            res.send({ msg: 'Anime added to account' });
          })
          .catch(err => {
            res.status(400).send({ msg: 'Failed to add anime' });
          });
      }
    })
    .catch(err => {
      res.status(500).send({ msg: 'Internal server error' });
    });
});

router.post('/anime/remove', authenticateToken, (req, res) => {
  User.findByIdAndUpdate(req.user.id, { $pull: { anime: req.body } })
    .then(() => {
      res.send({ msg: 'Anime removed from account' });
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to remove anime' });
    });
});

router.post('/anime/update', authenticateToken, (req, res) => {
  User.updateOne({ _id: req.user.id, 'anime._id': req.body._id }, { $set: { 'anime.$': req.body } })
    .then(() => {
      res.send({ msg: 'Anime updated' });
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to update anime' });
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
        res.status(400).send({ msg: 'Manga already added' });
      } else {
        User.findByIdAndUpdate(req.user.id, { $push: { manga: req.body } })
          .then(() => {
            res.send({ msg: 'Manga added to account' });
          })
          .catch(err => {
            res.status(400).send({ msg: 'Failed to add manga' });
          });
      }
    })
    .catch(err => {
      res.status(500).send({ msg: 'Internal server error' });
    });
});

router.post('/manga/remove', authenticateToken, (req, res) => {
  User.findByIdAndUpdate(req.user.id, { $pull: { manga: req.body } })
    .then(() => {
      res.send({ msg: 'Manga removed from account' });
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to remove manga' });
    });
});

router.post('/manga/update', authenticateToken, (req, res) => {
  User.updateOne({ _id: req.user.id, 'manga._id': req.body._id }, { $set: { 'manga.$': req.body } })
    .then(() => {
      res.send({ msg: 'Manga updated' });
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to update manga' });
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