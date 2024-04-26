const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_CONNECTION)
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...' + err));

const app = express();
app.use(cors());
app.use(express.json());

app.use('/anime', require('./routes/anime'));
app.use('/manga', require('./routes/manga'));
app.use('/announcements', require('./routes/announcements'));
app.use('/auth', require('./routes/auth'));
app.use('/account', require('./routes/account'));
app.use('/profile', require('./routes/profile'));
app.use('/admin', require('./routes/admin'));
app.use('/mod', require('./routes/mod'));


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
    console.log(`API is running on http://localhost:${process.env.PORT}`);
});