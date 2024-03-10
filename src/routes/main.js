const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/register', function(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findOne({ email })
        .then(user => {
            if(user) return res.status(409).json({ msg: 'Email je už použitý na inom účte' });

            User.findOne({ name })
                .then(user => {
                    if(user) return res.status(409).json({ msg: 'Používatelské meno už je zabrané' });

                    const hashedPassword = bcrypt.hashSync(password, 10);

                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword
                    });

                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => res.status(500).json({ msg: 'Server error' }));
                })
                .catch(err => res.status(500).json({ msg: 'Server error' }));
        })
        .catch(err => res.status(500).json({ msg: 'Server error' }));
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.status(401).json({ msg: 'Nesprávne prihlasovacie údaje' }); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            return res.json(req.user);
        });
    })(req, res, next);
});


module.exports = router;