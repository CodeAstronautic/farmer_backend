const mongoose = require('mongoose');

const addfarmSchema = mongoose.Schema({
    soil_type:{require:true,type:String,enum:["Alluvial Soal","Black Soil","Forest Soil","Other"]},
    land_type:{require:true,type:String,enum:["Irrigated Land","Non Irrigated Land"]},
    farmer_id:{require:true,type:mongoose.Schema.Types.ObjectId,ref:"users"}
}, {
    timestamps: true
});

module.exports = mongoose.model('addfarm', addfarmSchema);