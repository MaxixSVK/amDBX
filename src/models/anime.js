const mongoose = require('mongoose');
const slugify = require('slugify');

const animeSchema = new mongoose.Schema({
    name: String,
    slug: {
        type: String,
        unique: true
    },
    description: String,
    genre: String,
    releaseDate: Date,
    episodes: Number,
    banner: String,
    img: String,
    trailer: String,
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'upcoming']
    },
    studio: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

animeSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true, replacement: '_', remove: /[*+~.()'"!:@]/g });
    next();
});

module.exports = mongoose.model('Anime', animeSchema);