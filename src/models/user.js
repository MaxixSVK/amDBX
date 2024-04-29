const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    role: {
        type: String,
        default: 'user', 
        enum: ['user', 'mod', 'admin']
    },
    profileImg: String,
    email: { type: String, unique: true },
    password: String,
    changedPassword: Date,
    register: {
        type: Date,
        default: Date.now
    },
    anime : [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Anime'
        },
        episodes: Number,
        status: String,
        rating: Number
    }],
    manga : [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Manga'
        },
        chapters: Number,
        volumes: Number,
        status: String,
        rating: Number
    }]
});

userSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);