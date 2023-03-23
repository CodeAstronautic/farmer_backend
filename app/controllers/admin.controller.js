const User = require('../models/user.model.js');
const Admin = require("../models/admin.model");
const UserType = require('../models/usertype.model.js');
const CityState = require('../models/citystate.model.js');
const Crop = require('../models/crop.model.js');
const CropType = require('../models/croptypes.model.js');
const UserSetting = require('../models/usersetting.model.js');

var md5 = require('md5');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/keys.config.js');
const { Router } = require('express');
const multer=require("multer")
var ObjectId = require('mongodb').ObjectID;


exports.createAdmin = async (req, res) => {
    if(!req.body.phone || !req.body.password) {
        return res.status(400).send({
            message: "Phone number or password can not be empty"
        });
    }

    let findres = await Admin.findOne({ phone: req.body.phone});
    console.log('sds',findres);
    if(findres && findres._id){
      return res.status(400).send({
              message: "Admin already exit"
          });
    }

    // Create a Admin
    const note = new Admin({
        name: req.body.name || "", 
        phone: req.body.phone,
        email:req.body.email,
        password: md5(req.body.password),
    });

    // Save Note in the database
    note.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};



exports.adminotpsend = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        res.status(400).json({ error: "Please Enter Your phone" })
    }

    try {
        const presuer = await Admin.findOne({ phone: phone });

        if (presuer) {
            const OTP = Math.floor(1000 + Math.random() * 9000);

            const existEmail = await Admin.findOne({ phone: phone });

            if (existEmail) {
                const updateData = await Admin.findByIdAndUpdate({ _id: existEmail._id }, {
                    otp: OTP
                }, { new: true }
                );

                await updateData.save();
                //console And Res OTP
                console.log("updateData",OTP)
                res.send({"otp":OTP})

            } else {

                const saveOtpData = new userotp({
                    phone, otp: OTP
                });

                await saveOtpData.save();
                console.log("saveOtpData",saveOtpData.OTP)

            }
        } 
        else {
            res.status(400).json({ error: "This User Not Exist In our Db" })
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
};


exports.adminlogin = (req, res) => {
    if(!req.body.phone || !req.body.otp) {
      return res.status(400).send({
          message: "Phone number or otp can not be empty"
      });
    }
    Admin.findOne({ phone: req.body.phone,userType:"admin" }, function (err, admin) {
        if (err) return res.status(500).send({message:'Error on the server.'});
        if (!admin) return res.status(404).send({message:'No admin found.'});
        if(admin.otp!==req.body.otp) return res.status(500).send({Message:"Otp can't Match"})
        var token = jwt.sign({ id: admin._id,phone:admin.phone,name:admin.name,userType:admin.userType,otp:admin.otp}, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token,name:admin.name,userType:admin.userType,center:admin.center });
    });
};

exports.getUsertypes = (req, res) => {
    UserType.find({}, function (err, usertypes) {
        if (err) return res.status(500).send({message:'Error on the server.'});
        if (!usertypes) return res.status(404).send({message:'No usertype found.'});
     
        res.status(200).send({ status: true, result:usertypes });
    });
};

exports.getcitystate = (req, res) => {
    CityState.find({}, function (err, citystatesres) {
        if (err) return res.status(500).send({message:'Error on the server.'});
        if (!citystatesres) return res.status(404).send({message:'No city state found.'});
     
        res.status(200).send({ status: true, result:citystatesres });
    });
};

exports.landmeasurementunits = (req, res) => {
    const measurementunits = ["Square Feet","Acre","Hectare","Gaj","Bigha"];
    res.status(200).send({ status: true, result:measurementunits });
};

exports.landtypes = (req, res) => {
    const landtype = ["Irrigated","Nonirrigated"];
    res.status(200).send({ status: true, result:landtype });
};

exports.croplist = (req, res) => {
    let findobj = {};
    if(req.query && req.query.categoryname){
         findobj.categoryname = req.query.categoryname;
    }
    Crop.find(findobj, function (err, crops) {
        if (err) return res.status(500).send({message:'Error on the server.'});
        if (!crops) return res.status(404).send({message:'No crop found.'});     
        res.status(200).send({ status: true, result:crops });
    });
};

exports.userdetail = (req, res) => {
    if(req.params && req.params.userid){
        User.findOne({_id:req.params.userid,userType:{$ne:"admin"}},{password:0,__v:0,updatedAt:0}, function (err, userdata) {
           if (err) return res.status(500).send({message:'Error on the server.'});
           if (!userdata) return res.status(404).send({message:'No User found.'});
        
           res.status(200).send({ status: true, result:userdata });
        });
    }else{
     return res.status(422).send({ message: "missing required parameter" });
    }
};

exports.addCropcategory = async (req, res) => {
    let findres = await CropType.findOne({ name: req.body.name});
    if(findres && findres._id){
        return res.status(400).send({
            message: "Crop Category already exit"
        });
    }

    // Create a category
    const category = new CropType({
        name: req.body.name, 
    });

    category.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Crop Category."
        });
    });
};

exports.addCropSubcategory = async (req, res) => {
    
    let findcropcategory = await CropType.findOne({ name: req.body.categoryname});
    if(findcropcategory && findcropcategory._id){
        let findcropsubcat = await CropType.findOne({ name: req.body.categoryname,"subcategory.name":req.body.subcategoryname});
        if(findcropsubcat && findcropsubcat._id){
            return res.status(400).send({
                message: "Crop SubCategory already exits in this category"
            });
        }
        
        let updtoj = {"name":req.body.subcategoryname};
        if(req.body.subcategorytype && req.body.subcategorytype!=""){
            updtoj["subcategorytype"] = req.body.subcategorytype;
        }
        let addsubcat = await CropType.findOneAndUpdate({ name: req.body.categoryname},{$push:{"subcategory":updtoj}});
        if(addsubcat){
            res.status(200).send({ status: true,message:"Subcategory has been created successfully" });
        }else{
            return res.status(500).send({
              message: "Some error occurred"
          });
        }
      
    }else{
        return res.status(400).send({
              message: "Crop Category not found"
          });
    }
};
/*exports.addCropSubcategoryType = async (req, res) => {
    
    let findcropcategory = await CropType.findOne({ name: req.body.categoryname,"subcategory.name": req.body.subcategoryname});
    if(findcropcategory && findcropcategory._id){
        let findcropsubcat = await CropType.findOne({ name: req.body.categoryname,"subcategory.name":req.body.subcategoryname,"subcategory.subcategorytype.name":req.body.subcategorytype});
        if(findcropsubcat && findcropsubcat._id){
            return res.status(400).send({
                message: "Crop SubCategory type already exits in this category"
            });
        }

        //let addsubcat = await CropType.findOneAndUpdate({ name: req.body.categoryname},{$push:{"subcategory":{"name":req.body.subcategoryname}}});
        let addsubcat = await CropType.findOneAndUpdate({ name: req.body.categoryname,"subcategory.name":req.body.subcategoryname},
                                                {$push:{"subcategory.$.subcategorytype":{"name":req.body.subcategorytype}}});
        if(addsubcat){
            res.status(200).send({ status: true,message:"Subcategory Type has been created successfully" });
        }else{
            return res.status(500).send({
              message: "Some error occurred"
          });
        }
      
    }else{
        return res.status(400).send({
              message: "Crop Category / Subcategory not found"
          });
    }
};*/

exports.addCrop = async (req, res) => {
    let findcropcategory = await CropType.findOne({ name: req.body.categoryname});
    if(findcropcategory && findcropcategory._id){
        const saveobj = {name:req.body.cropname,categoryname:req.body.categoryname};
        
        if(req.body && req.body.subcategoryname && req.body.subcategoryname!=""){
            let findcropsubcat = await CropType.findOne({ name: req.body.categoryname,"subcategory.name":req.body.subcategoryname});
            if(!findcropsubcat){
                return res.status(400).send({
                    message: "Crop SubCategory not found"
                });
            }
            saveobj.subcategoryname = req.body.subcategoryname;
        }
        if(req.body && req.body.subcategorytype && req.body.subcategorytype!=""){
            saveobj.subcategorytype  = req.body.subcategorytype;
        }

        let findcrop = await Crop.findOne({ name: req.body.cropname,categoryname:req.body.categoryname});
        if(findcrop && findcrop._id){
            return res.status(400).send({
                message: "Crop already exits"
            });
        }
        console.log("saveobj",saveobj);
        const cropobj = new Crop(saveobj);

        cropobj.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Crop."
            });
        });
      
    }else{
        return res.status(400).send({
            message: "Crop Category not found"
        });
    }
};

exports.getCropCategory = async (req,res)=>{
    let findresult = await CropType.find({});
    if (!findresult) return res.status(404).send({message:'No category found.'});
    
    res.status(200).send({ status: true, result:findresult });
}
exports.getCropCategorybyname = async (req,res)=>{
    let findresult = await CropType.find({name:req.query.categoryname},{_id:0});
    if (!findresult) return res.status(404).send({message:'No category found.'});
    
    res.status(200).send({ status: true, result:findresult });
}

exports.addCropPrice = async (req, res) => {
    let baseprice = req.body.baseprice || [];
    let quoteprice = req.body.quoteprice || [];
    let saleprice = req.body.saleprice || [];
    if(baseprice.length>0 && quoteprice.length>0 && saleprice.length>0){
        let findcrop = await Crop.findOne({ _id: ObjectId(req.body.cropid)});
        if(findcrop && findcrop._id){

            const updtobj = {baseprice:req.body.baseprice,saleprice:req.body.saleprice,quoteprice:req.body.quoteprice};
            
            Crop.findOneAndUpdate({_id:findcrop._id},{$set:updtobj},{new:true})
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Crop."
                });
            });
          
        }else{
            return res.status(400).send({
                  message: "Crop not found"
              });
        }
    }else{
        return res.status(400).send({
                  message: "Missing parameter"
              });
    }
    
};

let generateUseridnumber = async(usertype,state,city)=>{
  let settingresult = await UserSetting.findOne({settingtype:"useridnumber"});
  //console.log('settingresult',settingresult);
  let finalstr = "",usernumber;
  if(usertype=="farmer"){
    finalstr = "FR";
    usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.farmeridnumber;
  }else if(usertype=="dealer"){
    finalstr = "DE";
    usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.dealeridnumber;
  }else if(usertype=="retailer"){
    finalstr = "RE";
    usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.retaileridnumber;
  }else if(usertype=="buyer"){
    finalstr = "BU";
    usernumber = settingresult && settingresult.settingdata && settingresult.settingdata.buyeridnumber;
  }
  //console.log('finalstr',finalstr);
  if(state && state[0])
   finalstr = finalstr+(state[0]).toUpperCase();
  if(state && state[1])
   finalstr = finalstr+state[1].toUpperCase();
  if(city && city[0])
   finalstr = finalstr+city[0].toUpperCase();
  if(city && city[1])
   finalstr = finalstr+city[1].toUpperCase();
  //console.log('finalstr2',finalstr,usernumber);
  return finalstr+usernumber;
}                                                      