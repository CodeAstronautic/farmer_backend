const mongoose = require('mongoose');

const Citystatesschema = mongoose.Schema({
    name: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Citystates', Citystatesschema);