const mongoose=require("mongoose");

const bankSchema=new mongoose.Schema({
    beneficiaryName:{require:true,type:String,minlength:[2,"Name must be minimum 2 Character"],maxlength:[20,"Name must be Maximum 20 Character"]},
    beneficiaryLastName:{require:true,type:String,minlength:[2,"Name must be minimum 2 Character"],maxlength:[20,"Name must be Maximum 20 Character"]},
    bankCode:{require:true,type:String,
        validate: {
            validator: function(v) {
              return /^[A-Za-z]{3}[0-9]{3}$/.test(v);
            }}
    },
    ifscCode:{require:true,type:String,
        validate:{
            validator: function(v) {
                return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
              }
        }    
    },
    bankAccountNumber:{require:true,type:String,unique:true,
        validate: {
            validator: function(v) {
              return /^([0-9]{14}$)/.test(v);
            }}
        },
    address:{require:true,type:String,minlength:[2,"Address must be minimum 2 Character"]},
    email:{require:true,type:String,
        validate: {
            validator: function(v) {
              return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
            }}
            
    },
    mobileNumber:{require:true,type:Number,unique:true,
        validate: {
            validator: function(v) {
              return /^([0-9]{10}$)/.test(v);
            }}
    },
    gstInNumber:{type:String,unique:true,
        validate: {
            validator: function(v) {
              return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
            }}
    }
})

const bank=mongoose.model("bank",bankSchema);

module.exports=bank;