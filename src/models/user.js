const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    register: {
        type: Date,
        default: Date.now
    },
    anime : [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Anime'
        },
        progress: Number,
        status: String
    }],
    manga : [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Manga'
        },
        progress: Number,
        status: String
    }]
});

userSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);