const mongoose = require('mongoose');

const  announcementSchema = new mongoose.Schema({
    name: String,
    description: String,
    until: Date,
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Announcement', announcementSchema);