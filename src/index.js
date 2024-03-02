const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectToDatabase();

app.use('/api/anime', require('./routes/anime'));
app.use('/api/manga', require('./routes/manga'));
app.use(require('./routes/main'));

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

function connectToDatabase() {
    mongoose.connect(process.env.DB_CONNECTION)
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...' + err));
}