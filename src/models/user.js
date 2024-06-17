const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'mod', 'admin']
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    changedPassword: Date,
    profileImg: String,
    register: {
        type: Date,
        default: Date.now
    },
    anime: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Anime'
        },
        userEpisodes: {
            type: Number,
            default: 0
        },
        userStatus: {
            type: String,
            enum: ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'],
            default: 'Watching'
        },
        userRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 10
        },
        userLastUpdated: {
            type: Date
        }
    }],
    manga: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Manga'
        },
        userChapters: {
            type: Number,
            default: 0
        },
        userStatus: {
            type: String,
            enum: ['Reading', 'Completed', 'On Hold', 'Dropped', 'Plan to Read'],
            default: 'Reading'
        },
        userRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 10
        },
        userLastUpdated: {
            type: Date
        }
    }]
});

userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);