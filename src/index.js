const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

mongoose.connect(process.env.DB_CONNECTION)
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...' + err));

const app = express();
app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

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

app.use('/cdn', require('./routes/cdn'));
app.use('/api/anime', require('./routes/anime'));
app.use('/api', require('./routes/manga'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/account', require('./routes/account'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/mod', require('./routes/mod'));
app.use('/api/modannouncements', require('./routes/modAnnouncements'));
app.use('/api/modanime', require('./routes/modAnime'));
app.use('/api/modmanga', require('./routes/modManga'));


app.get('/', (req, res) => {
    res.send('API is running');
});

app.use((req, res, next) => {
    res.status(404).send("404-chan: Page not found");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});