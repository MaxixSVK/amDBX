const express = require('express');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
require('dotenv').config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20,
  message: { msg: 'Príliš veľa požiadaviek z tohto zdroja, skúste to znova o chvíľu' }
});

router.use(limiter);

const userSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': `Meno by malo byť typu 'text'`,
      'string.empty': `Meno nemôže byť prázdne pole`,
      'string.min': `Meno by malo mať minimálnu dĺžku {#limit}`,
      'string.max': `Meno by malo mať maximálnu dĺžku {#limit}`,
      'any.required': `Meno je povinné pole`
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': `Email by mal byť typu 'text'`,
      'string.email': `Email by mal byť platný email`,
      'string.empty': `Email nemôže byť prázdne pole`,
      'any.required': `Email je povinné pole`
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.base': `Heslo by malo byť typu 'text'`,
      'string.empty': `Heslo nemôže byť prázdne pole`,
      'string.min': `Heslo by malo mať minimálnu dĺžku {#limit}`,
      'any.required': `Heslo je povinné pole`
    })
});

router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(
  {
      usernameField: 'email',
      passwordField: 'password'
  },
  async function(email, password, done) {
      try {
          const user = await User.findOne({ email: email });
          if (!user) { return done(null, false); }
          bcrypt.compare(password, user.password, function(err, isMatch) {
              if (err) { return done(err); }
              if (!isMatch) { return done(null, false); }
              return done(null, user);
          });
      } catch (err) {
          return done(err);
      }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
      const user = await User.findById(id);
      done(null, user);
  } catch (err) {
      done(err);
  }
});

router.post('/register', async function (req, res, next) {
  try {
    const { name, email, password } = await userSchema.validateAsync(req.body);

    const userWithEmail = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (userWithEmail) return res.status(422).json({ msg: 'Tento email už bol použitý na inom účte' });
    
    const userWithName = await User.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (userWithName) return res.status(422).json({ msg: 'Prihlasovacie meno už bolo zabrané' });

    const salt = await bcrypt.genSalt(10);
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

router.post('/', function (req, res, next) {
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

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: '500-chan: Server error' });
});

module.exports = router;