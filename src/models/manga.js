const mongoose = require('mongoose');
const slugify = require('slugify');

const mangaSchema = new mongoose.Schema({
    name: String,
    slug: {
        type: String,
        required: true,
        unique: true
    },
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

mangaSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true, replacement: '_', remove: /[*+~.()'"!:@]/g });
    next();
});

module.exports = mongoose.model('Manga', mangaSchema);