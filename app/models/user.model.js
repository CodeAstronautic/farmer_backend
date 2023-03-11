const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {type:String, index:true},
    phone: {type:String, unique: true,index:true},
    email:{type:String, unique: true,index:true},
    useridnumber:{type:String},
    locality:{type:String},
    city:{type:String},
    state:{type:String},
    country:{type:String},
    pin:{type:String},
    taluk:{type:String},
    userType: {
                  type: String,
                  enum : ['admin','farmer','dealer','buyer','retailer'],
                  default: 'farmer',
                  index:true
            },
    password: {type:String, index:true},
    farmerdetail:{
        landsize:{type:Number},
        landmeasurmentunit:{type:String},
        landtype:{type:String}
    },
    userdetail:{
        gstNumber:{type:String},
        firmName:{type:String},
    },
    bankingdetail:{
       name:String,
       bankname:String,
       ifsccode:String,
       accountnumber:String,
       bankaddress:String 
    },
    crops:[{
        name: String,
        category: String,
        subcategoryname: String,
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Users', UserSchema);