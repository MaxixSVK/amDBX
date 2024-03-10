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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Anime'
    }],
    manga : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manga'
    }]
});

userSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);