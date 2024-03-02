const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
    name: String,
    description: String,
    genre: String,
    releaseDate: Date,
    episodes: Number,
    banner: String,
    img: String,
    trailer: String,
    status: String,
    studio: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Anime', animeSchema);