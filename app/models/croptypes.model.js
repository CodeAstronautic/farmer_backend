const mongoose = require('mongoose');

const Croptypesschema = mongoose.Schema({
    name: String,
    subcategory: Array
}, {
    timestamps: true
});

module.exports = mongoose.model('Croptypes', Croptypesschema);