const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.static('frontend', { extensions: ['html'] }));

app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));

app.get('/profile/:username', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/profile.html'));
});

app.get('/animelist/:username', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/animelist.html'));
});

app.get('/mangalist/:username', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/mangalist.html'));
});
  
app.use((req, res, next) => {
    res.status(404).redirect('/404');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(process.env.WEB_PORT, () => {
    console.log(`Web server is running on http://localhost:${process.env.WEB_PORT}`);
});