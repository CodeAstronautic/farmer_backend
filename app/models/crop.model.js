const mongoose = require('mongoose');

const Cropschema = mongoose.Schema({
    name: String,
    categoryname: String,
    subcategoryname: String,
    subcategorytype: String,
    baseprice:Array,
    saleprice:Array,
    quoteprice:Array
}, {
    timestamps: true
});

module.exports = mongoose.model('Crops', Cropschema);