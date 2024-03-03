const mongoose = require('mongoose');

const  alertSchema = new mongoose.Schema({
    name: String,
    description: String,
    until: Date,
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Alert', alertSchema);