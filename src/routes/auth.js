const express = require('express');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

require('dotenv').config();

const User = require('../models/user');
const validateRegister = require('../dataValidation/register');
const validateLogin = require('../dataValidation/login');
const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { msg: 'Príliš veľa požiadaviek z tohto zdroja, skúste to znova o chvíľu' }
});

router.use(limiter);

router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async function (email, password, done) {
    try {
      const user = await User.findOne({ email: email });
      if (!user) { return done(null, false); }
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) { return done(err); }
        if (!isMatch) { return done(null, false); }
        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

router.post('/register', async function (req, res, next) {
  try {
    const { name, email, password } = await validateRegister(req.body);

    const userWithEmail = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (userWithEmail) return res.status(422).json({ msg: 'Tento email už bol použitý na inom účte' });

    const userWithName = await User.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (userWithName) return res.status(422).json({ msg: 'Prihlasovacie meno už bolo zabrané' });

    const salt = await bcrypt.genSalt(14);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      changedPassword: new Date()
    });

    const user = await newUser.save();
    const token = jwt.sign({ id: user._id, changedPassword: newUser.changedPassword }, process.env.JWT_SECRET, { expiresIn: '365d' });
    res.json({ token });
  } catch (err) {
    if (err instanceof Joi.ValidationError) {
      res.status(400).json({ msg: err.details[0].message });
    } else {
      next(err);
    }
  }
});

router.post('/', async function (req, res, next) {
  try {
    await validateLogin(req.body);

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
  } catch (err) {
    if (err instanceof Joi.ValidationError) {
      res.status(400).json({ msg: err.details[0].message });
    } else {
      next(err);
    }
  }
});

module.exports = router;