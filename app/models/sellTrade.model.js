const mongoose = require('mongoose');

const sellTradeSchema=new mongoose.Schema({
    pickuplocation:{type:String},
    category:{type:String, },
    product:{type:String,},
    variety:{type:String, },
    grade:{type:String, },
    price:{type:Number,default:0},
    quantity:{type:String,default:0},
    image:{
        type:Array
    }
})

const sellTrade=mongoose.model("sellTrade",sellTradeSchema);

module.exports = sellTrade