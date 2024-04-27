const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  req.user = null;

  const token = req.headers['authorization'];
  if (!token) return res.status(401).send({ msg: 'Nebol poskytnutý token' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(404).send({ msg: 'Nebolo možné overiť token' });

    const dbUser = await User.findById(user.id);
    if (!dbUser) return res.status(403).send({ msg: 'Používateľ nenájdený' });

    const tokenChangedPassword = user.changedPassword;
    const dbChangedPassword = dbUser.changedPassword;

    if (new Date(tokenChangedPassword).getTime() !== new Date(dbChangedPassword).getTime())
      return res.status(403).send({ msg: 'Token je neplatný' });

    req.user = user;
    next();
  });
};

router.use(authenticateToken);

router.get('/', (req, res) => {
  User.findById(req.user.id)
    .select('-_id -password -changedPassword')
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).send({ msg: '500-chan: Niečo sa pokazilo!'});
    });
});

router.put('/change-password', (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
        return res.status(400).send({ msg: 'Nesprávne heslo' });
      }

      if (req.body.newPassword.length < 8) {
        return res.status(400).send({ msg: 'Heslo musí mať aspoň 8 znakov' });
      }

      if (req.body.newPassword === req.body.oldPassword) {
        return res.status(400).send({ msg: 'Nové heslo nesmie byť rovnaké ako staré heslo' });
      }

      const hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);
      const changedPassword = new Date();

      User.findByIdAndUpdate(req.user.id, { password: hashedPassword, changedPassword: changedPassword })
        .then(() => {
          const token = jwt.sign({ id: req.user.id, changedPassword: changedPassword }, process.env.JWT_SECRET);
          res.status(200).send({ msg: 'Heslo zmenené', token: token });
        })
        .catch(err => {
          res.status(400).send({ msg: 'Nepodarilo sa zmeniť heslo' });
        });
    })
    .catch(err => {
      res.status(500).send({ msg: '500-chan: Niečo sa pokazilo!'});
    });
});

router.put('/change-email', (req, res) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  if (!emailRegex.test(req.body.email)) {
    return res.status(400).send({ msg: 'Nesprávny formát emailu' });
  }

  User.findById(req.user.id)
    .then(user => {
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).send({ msg: 'Nesprávne heslo' });
      }

      if (req.body.email === user.email) {
        return res.status(400).send({ msg: 'Nový email nesmie byť rovnaký ako starý email' });
      }

      User.findOne({ email: { $regex: new RegExp(`^${req.body.email}$`, 'i') } })
        .then(existingUser => {
          if (existingUser) {
            return res.status(400).send({ msg: 'Tento email už bol použitý na inom účte' });
          }

          User.findByIdAndUpdate(req.user.id, { email: req.body.email })
            .then(() => {
              res.send({ msg: 'Email zmenený', email: req.body.email });
            })
            .catch(err => {
              res.status(400).send({ msg: 'Nepodarilo sa zmeniť email' });
            });
        })
        .catch(err => {
          res.status(500).send({ msg: '500-chan: Niečo sa pokazilo!'});
        });
    })
    .catch(err => {
      res.status(500).send({ msg: '500-chan: Niečo sa pokazilo!'});
    });
});

router.delete('/delete', (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).send({ msg: 'Nesprávne heslo' });
      }

      User.findByIdAndDelete(req.user.id)
        .then(() => {
          res.send({ msg: 'Účet zmazaný', deleted: true});
        })
        .catch(err => {
          res.status(400).send({ msg: 'Nepodarilo sa zmazať účet' });
        });
    })
    .catch(err => {
      res.status(500).send({ msg: '500-chan: Niečo sa pokazilo!'});
    });
});

router.post('/anime/add', (req, res) => {
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

router.post('/anime/remove', (req, res) => {
  User.findByIdAndUpdate(req.user.id, { $pull: { anime: req.body } })
    .then(() => {
      res.send({ msg: 'Anime removed from account' });
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to remove anime' });
    });
});

router.post('/anime/update', (req, res) => {
  User.updateOne({ _id: req.user.id, 'anime._id': req.body._id }, { $set: { 'anime.$': req.body } })
    .then(() => {
      res.send({ msg: 'Anime updated' });
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to update anime' });
    });
});

router.get('/anime/list', (req, res) => {
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

router.post('/manga/add', (req, res) => {
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
      res.status(500).send({ msg: '500-chan: server error' });
    });
});

router.post('/manga/remove', (req, res) => {
  User.findByIdAndUpdate(req.user.id, { $pull: { manga: req.body } })
    .then(() => {
      res.send({ msg: 'Manga removed from account' });
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to remove manga' });
    });
});

router.post('/manga/update', (req, res) => {
  User.updateOne({ _id: req.user.id, 'manga._id': req.body._id }, { $set: { 'manga.$': req.body } })
    .then(() => {
      res.send({ msg: 'Manga updated' });
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to update manga' });
    });
});

router.get('/manga/list', (req, res) => {
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