const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    firstname:{type:String,require:true},
    lastname:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    phone:{type:String,require:true},
    userType:{type:String,default:"admin"},
    otp:{type:Number}

}, {
    timestamps: true
});

module.exports = mongoose.model('admin', adminSchema);