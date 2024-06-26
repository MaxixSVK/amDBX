const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const appRoutes = require('./appRoutes');

mongoose.connect(process.env.DB_CONNECTION)
    .then(() => console.log('Api-chan: Pripojená k MongoDB'))
    .catch(err => console.error('Api-chan sa nemohla pripojiť k MongoDB:\n ' + err));

const app = express();
app.use(cors());
app.use(express.json());

appRoutes(app);

app.get('/', (req, res) => {
    res.status(200).send({ msg: 'Api-chan: Ahoj, som tu pre teba! <3' });
});

app.use((req, res, next) => {
    res.status(404).send({ msg: '404-chan: Nenašla som to!' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ msg: '500-chan: Niečo sa pokazilo!' });
});

app.listen(process.env.API_PORT, () => {
    console.log(`Api-chan: Api beží na porte ${process.env.API_PORT}`);
});