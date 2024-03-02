const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema({
    name: String,
    description: String,
    genre: String,
    releaseDate: Date,
    volumes: Number,
    chapters: Number,
    banner: String,
    img: String,
    status: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Manga', mangaSchema);