const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const authenticateToken = require('../auth/account');
router.use(authenticateToken);

router.get('/', (req, res, next) => {
  User.findById(req.user.id)
    .select('-_id -password -changedPassword -anime -manga -__v')
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/change-password', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
      return res.status(400).send({ msg: 'Nesprávne heslo' });
    }

    if (req.body.newPassword.length < 8) {
      return res.status(400).send({ msg: 'Heslo musí mať aspoň 8 znakov' });
    }

    if (req.body.newPassword === req.body.oldPassword) {
      return res.status(400).send({ msg: 'Nové heslo nesmie byť rovnaké ako staré heslo' });
    }

    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 12);
    const changedPassword = new Date();

    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword, changedPassword: changedPassword });

    const token = jwt.sign({ id: req.user.id, changedPassword: changedPassword }, process.env.JWT_SECRET);
    res.status(200).send({ msg: 'Heslo zmenené', token: token });
  } catch (err) {
    next(err);
  }
});

router.put('/change-email', async (req, res, next) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  if (!emailRegex.test(req.body.email)) {
    return res.status(400).send({ msg: 'Nesprávny formát emailu' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).send({ msg: 'Nesprávne heslo' });
    }

    if (req.body.email === user.email) {
      return res.status(400).send({ msg: 'Nový email nesmie byť rovnaký ako starý email' });
    }

    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${req.body.email}$`, 'i') } });

    if (existingUser) {
      return res.status(400).send({ msg: 'Tento email už bol použitý na inom účte' });
    }

    await User.findByIdAndUpdate(req.user.id, { email: req.body.email });

    res.send({ msg: 'Email zmenený', email: req.body.email });
  } catch (err) {
    next(err);
  }
});

router.delete('/delete', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).send({ msg: 'Nesprávne heslo' });
    }

    await User.findByIdAndDelete(req.user.id);

    res.send({ msg: 'Účet zmazaný', deleted: true });
  } catch (err) {
    next(err);
  }
});

router.get('/anime', (req, res, next) => {
  User.findById(req.user.id)
    .populate({
      path: 'anime.id',
      select: 'name'
    })
    .select('anime')
    .then(user => {
      res.json(user.anime);
    })
    .catch(err => {
      next(err);
    });
});

router.post('/anime/add', (req, res, next) => {
  User.findOne({ _id: req.user.id, 'anime.id': req.body.id })
    .then(user => {
      if (user) {
        res.status(400).send({ msg: 'Anime already added' });
      } else {
        const animeToAdd = {
          id: req.body.id,
          userEpisodes: req.body.userEpisodes,
          userStatus: req.body.userStatus,
          userRating: req.body.userRating,
          userLastUpdated: new Date()
        };

        User.findByIdAndUpdate(req.user.id, {
          $push: { anime: animeToAdd },
        })
          .then(() => {
            res.send({ msg: 'Anime added to account' });
          })
          .catch(err => {
            next(err);
          });
      }
    })
    .catch(err => {
      next(err);
    });
});

router.put('/anime/update', (req, res, next) => {
  User.updateOne(
    { _id: req.user.id, 'anime.id': req.body.id },
    {
      $set: {
        'anime.$.userEpisodes': req.body.userEpisodes,
        'anime.$.userStatus': req.body.userStatus,
        'anime.$.userRating': req.body.userRating,
        'anime.$.userLastUpdated': new Date()
      }
    }
  )
    .then(() => {
      res.send({ msg: 'Anime updated' });
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/anime/remove', (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, { $pull: { anime: req.body } })
    .then(() => {
      res.send({ msg: 'Anime removed from account' });
    })
    .catch(err => {
      next(err);
    });
});

router.get('/manga', (req, res, next) => {
  User.findById(req.user.id)
    .populate({
      path: 'manga.id',
      select: 'name'
    })
    .then(user => {
      res.json(user.manga);
    })
    .catch(err => {
      next(err);
    });
});

router.post('/manga/add', (req, res, next) => {
  User.findOne({ _id: req.user.id, 'manga.id': req.body.id })
    .then(user => {
      if (user) {
        res.status(400).send({ msg: 'Manga already added' });
      } else {
        const mangaToAdd = {
          id: req.body.id,
          userChapters: req.body.userChapters,
          userStatus: req.body.userStatus,
          userRating: req.body.userRating,
          userLastUpdated: new Date()
        };

        User.findByIdAndUpdate(req.user.id, {
          $push: { manga: mangaToAdd },
        })
          .then(() => {
            res.send({ msg: 'Manga added to account' });
          })
          .catch(err => {
            next(err);
          });
      }
    })
    .catch(err => {
      next(err);
    });
});

router.put('/manga/update', (req, res, next) => {
  User.updateOne(
    { _id: req.user.id, 'manga.id': req.body.id },
    {
      $set: {
        'manga.$.userChapters': req.body.userChapters,
        'manga.$.userStatus': req.body.userStatus,
        'manga.$.userRating': req.body.userRating,
        'manga.$.userLastUpdated': new Date()
      }
    }
  )
    .then(() => {
      res.send({ msg: 'Manga updated' });
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/manga/remove', (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, { $pull: { manga: req.body } })
    .then(() => {
      res.send({ msg: 'Manga removed from account' });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;