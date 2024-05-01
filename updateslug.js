const mongoose = require('mongoose');
const slugify = require('slugify');
const Manga = require('./src/models/Manga'); 

mongoose.connect('mongodb://maxix:M9e3Kp7P3iJ*kYgcFkF3@109.199.103.159:27017/amDBX', { useNewUrlParser: true, useUnifiedTopology: true }) // replace with your MongoDB connection string
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

async function updateSlugs() {
    const mangas = await Manga.find();

    mangas.forEach(async (manga) => {
        manga.slug = slugify(manga.name, { lower: true, replacement: '_', remove: /[*+~.()'"!:@]/g });
        await manga.save();
    });

    console.log('All slugs updated.');
}

updateSlugs();