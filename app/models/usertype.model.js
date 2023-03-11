const mongoose = require('mongoose');

const Usertypesschema = mongoose.Schema({
    name: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Usertypes', Usertypesschema);