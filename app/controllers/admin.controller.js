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
  if(!req.body.phone || !req.body.password) {
      return res.status(400).send({
          message: "Phone number or password can not be empty"
      });
            }
  Admin.findOne({ phone: req.body.phone,userType:"admin" }, function (err, admin) {
     if (err) return res.status(500).send({message:'Error on the server.'});
     if (!admin) return res.status(404).send({message:'No admin found.'});
     
     //console.log('req.body.password, admin.password',req.body.password, admin.password);
     //var passwordIsValid = bcrypt.compareSync(req.body.password, admin.password);
     var passwordIsValid = false;
     if(md5(req.body.password)==admin.password){
        passwordIsValid = true;
        }

     if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
     
     var token = jwt.sign({ id: admin._id,phone:admin.phone,name:admin.name,userType:admin.userType,center:admin.center }, config.secret, {
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

exports.createFarmer = async(req, res) => {
    let findphone = await User.findOne({ phone: req.body.phone});
    if(findphone && findphone._id){
      return res.status(400).send({
              message: "Farmer already exit with this phone number"
          });
    }
    let findemail = await User.findOne({ email: req.body.email});
    if(findemail && findemail._id){
      return res.status(400).send({
              message: "Farmer already exit with this email"
          });
    }

    //genereate useridnumber
    let farmerid = await generateUseridnumber("farmer",req.body.state,req.body.city);

    // Create a Farmer
    req.body.userType = "farmer";
    req.body.useridnumber = farmerid;
    req.body.password = md5(req.body.password);
    const farmerObj = new User(req.body);

    // Save Farmer in the database
    farmerObj.save()
    .then(async (data) => {
        //increase the farmer id number
        await UserSetting.findOneAndUpdate({settingtype:"useridnumber"},{$inc:{"settingdata.farmeridnumber":1}});
        res.status(200).send({ status: true,message:"Farmer has been created successfully" });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Farmer."
        });
    });    
};

exports.getfarmers = (req, res) => {
    let page = req.query && req.query.page && Number(req.query.page) || 1;
    let limit = 15;
    let skip = limit * (page - 1);
    User.find({userType:{$eq:"farmer"}},{crops:0,farmerdetail:0,bankingdetail:0,password:0,__v:0,updatedAt:0})
     .sort({createdAt:-1})
     .limit(limit)
     .skip(skip)
     .then(userdata=>{
        res.status(200).send({ status: true, result:userdata });
     })
     .catch(err=>{
        return res.status(500).send({ message: "something went wrong" });
     })
};

exports.getfarmerprofile = async(req,res)=>{
    id=req.params.id;
    const result= await User.findById(id);
    if(!result) return res.status(500).send({Message:"Can't Find Farmer Data With Given Id"})
    res.status(400).send({Message:"Farmer Data Find Successfully Done",result})
}

exports.updatefarmerbyid = async(req,res)=>{
    const result=await User.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        phone:req.body.phone,
        email:req.body.email,
        password:req.body.password,
        locality:req.body.locality,
        city:req.body.city,
        state:req.body.state,
        taluk:req.body.taluk,
        country:req.body.country,
        pin:req.body.pin
    },{
        new:true
    })
    if(!result) return res.status(500).send({Message:"Can't find Farmer Data with given id"})
    res.send({Message:"Your Data Successfully Updated",data:result})
}

exports.logoutfarmer=async(req,res)=>{
    const result=await User.findByIdAndDelete(req.params.id);
    if(!result) return res.status(500).send({Message:"Can't Logout Farmer please Check Your Data"})
    res.status(400).send({Message:"Farmer Logout Successfully Done..."})
}

exports.createdealer = async(req, res) => {
    let findphone = await User.findOne({ phone: req.body.phone});
    if(findphone && findphone._id){
      return res.status(400).send({
              message: "Dealer already exit with this phone number"
          });
    }
    let findemail = await User.findOne({ email: req.body.email});
    if(findemail && findemail._id){
      return res.status(400).send({
              message: "Dealer already exit with this email"
          });
    }

    //genereate useridnumber
    let dealerid = await generateUseridnumber("dealer",req.body.state,req.body.city);

    // Create a Farmer
    req.body.userType = "dealer";
    req.body.password = md5(req.body.password);
    req.body.useridnumber = dealerid;
    const dealerObj = new User(req.body);

    // Save Farmer in the database
    dealerObj.save()
    .then(async(data) => {
        //increase the farmer id number
        await UserSetting.findOneAndUpdate({settingtype:"useridnumber"},{$inc:{"settingdata.dealeridnumber":1}});
        res.status(200).send({ status: true,message:"Dealer has been created successfully" });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Dealer."
        });
    });    
};

exports.getdealers = (req, res) => {
    let page = req.query && req.query.page && Number(req.query.page) || 1;
    let limit = 5;
    let skip = limit * (page - 1);
    User.find({userType:{$eq:"dealer"}},{crops:0,farmerdetail:0,bankingdetail:0,password:0,__v:0,updatedAt:0})
     .sort({createdAt:-1})
     .limit(limit)
     .skip(skip)
     .then(userdata=>{
        res.status(200).send({ status: true, result:userdata });
     })
     .catch(err=>{
        return res.status(500).send({ message: "something went wrong" });
     })
};

exports.getdealerprofile = async(req,res)=>{
    id=req.params.id;
    const result= await User.findById(id);
        if(!result) return res.status(500).send({Message:"Can't Find Dealer Data With Given Id"})
        res.status(400).send({Message:"Dealer Data Find Successfully Done",result});
}

exports.updatedealerbyid = async(req,res)=>{
    const result=await User.findByIdAndUpdate(req.params.id,{
            name:req.body.name,
            phone:req.body.phone, 
            email:req.body.email, 
            password:req.body.password,
            locality:req.body.locality,
            city:req.body.city,
            state:req.body.state,
            taluk:req.body.taluk,
            country:req.body.country,
            pin:req.body.pin
    },{
        new:true
    })
    if(!result) return res.status(500).send({Message:"Can't find Dealer Data with given id"})
    res.send({Message:"Your Data Successfully Updated",data:result})
}

exports.logoutdealer=async(req,res)=>{
    const result=await User.findByIdAndDelete(req.params.id);
    if(!result) return res.status(500).send({Message:"Can't Logout Dealer please Check Your Data"})
    res.status(400).send({Message:"Dealer Logout Successfully Done..."})
}

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

exports.createBuyer = async(req, res) => {
    let findphone = await User.findOne({ phone: req.body.phone});
    if(findphone && findphone._id){
      return res.status(400).send({
              message: "Buyer already exit with this phone number"
          });
    }
    let findemail = await User.findOne({ email: req.body.email});
    if(findemail && findemail._id){
      return res.status(400).send({
              message: "Buyer already exit with this email"
          });
    }

    //genereate useridnumber
    let buyerid = await generateUseridnumber("buyer",req.body.state,req.body.city);

    // Create a Farmer
    req.body.userType = "buyer";
    req.body.password = md5(req.body.password);
    req.body.useridnumber = buyerid;
    const dealerObj = new User(req.body);

    // Save Farmer in the database
    dealerObj.save()
    .then(async(data) => {
        //increase the farmer id number
        await UserSetting.findOneAndUpdate({settingtype:"useridnumber"},{$inc:{"settingdata.buyeridnumber":1}});
        res.status(200).send({ status: true,message:"Buyer has been created successfully" });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Buyer."
        });
    });    
};

exports.getbuyer = (req, res) => {
    let page = req.query && req.query.page && Number(req.query.page) || 1;
    let limit = 5;
    let skip = limit * (page - 1);
    User.find({userType:{$eq:"buyer"}},{crops:0,farmerdetail:0,bankingdetail:0,password:0,__v:0,updatedAt:0})
     .sort({createdAt:-1})
     .limit(limit)
     .skip(skip)
     .then(userdata=>{
        res.status(200).send({ status: true, result:userdata });
     })
     .catch(err=>{
        return res.status(500).send({ message: "something went wrong" });
     })
};

exports.getbuyerprofile = async(req,res)=>{
    id=req.params.id;
    const result= await User.findById(id);
        if(!result) return res.status(500).send({Message:"Can't Find Buyer Data With Given Id"})
        res.status(400).send({Message:"Buyer Data Find Successfully Done",result});
}

exports.updatebuyerbyid = async(req,res)=>{
    const result=await User.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        phone:req.body.phone, 
        email:req.body.email , 
        password:req.body.password,
        locality:req.body.locality,
        city:req.body.city ,
        state:req.body.state ,
        taluk:req.body.taluk,
        country:req.body.country,
        pin:req.body.pin
    },{
        new:true
    })
    if(!result) return res.status(500).send({Message:"Can't find Buyer Data with given id"})
    res.send({Message:"Your Data Successfully Updated",data:result})
}

exports.logoutbuyer=async(req,res)=>{
    const result=await User.findByIdAndDelete(req.params.id);
    if(!result) return res.status(500).send({Message:"Can't Logout Buyer please Check Your Data"})
    res.status(400).send({Message:"Buyer Logout Successfully Done..."})
}

exports.createretailer = async(req, res) => {
    let findphone = await User.findOne({ phone: req.body.phone});
    if(findphone && findphone._id){
      return res.status(400).send({
              message: "Retailer already exit with this phone number"
          });
    }
    let findemail = await User.findOne({ email: req.body.email});
    if(findemail && findemail._id){
      return res.status(400).send({
              message: "Retailer already exit with this email"
          });
    }

    //genereate useridnumber
    let retailerid = await generateUseridnumber("retailer",req.body.state,req.body.city);

    // Create a Farmer
    req.body.userType = "retailer";
    req.body.password = md5(req.body.password);
    req.body.useridnumber = retailerid;
    const dealerObj = new User(req.body);

    // Save Farmer in the database
    dealerObj.save()
    .then(async(data) => {
        //increase the  id number
        await UserSetting.findOneAndUpdate({settingtype:"useridnumber"},{$inc:{"settingdata.retaileridnumber":1}});
        res.status(200).send({ status: true,message:"Retailer has been created successfully" });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Retailer."
        });
    });    
};

exports.getretailer = (req, res) => {
    let page = req.query && req.query.page && Number(req.query.page) || 1;
    let limit = 5;
    let skip = limit * (page - 1);
    User.find({userType:{$eq:"retailer"}},{crops:0,farmerdetail:0,bankingdetail:0,password:0,__v:0,updatedAt:0})
     .sort({createdAt:-1})
     .limit(limit)
     .skip(skip)
     .then(userdata=>{
        res.status(200).send({ status: true, result:userdata });
     })
     .catch(err=>{
        return res.status(500).send({ message: "something went wrong" });
     })
};

exports.getretailerprofile = async(req,res)=>{
    id=req.params.id;
    const result= await User.findById(id);
        if(!result) return res.status(500).send({Message:"Can't Find Retailer Data With Given Id"})
        res.status(400).send({Message:"Retailer Data Find Successfully Done",result});
}

exports.updateretailerbyid = async(req,res)=>{
    const result=await User.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        phone:req.body.phone, 
        email:req.body.email , 
        password:req.body.password,
        locality:req.body.locality,
        city:req.body.city ,
        state:req.body.state ,
        taluk:req.body.taluk,
        country:req.body.country,
        pin:req.body.pin
    },{
        new:true
    })
    if(!result) return res.status(500).send({Message:"Can't find Retailer Data with given id"})
    res.send({Message:"Your Data Successfully Updated",data:result})
}

exports.logoutretailer=async(req,res)=>{
    const result=await User.findByIdAndDelete(req.params.id);
    if(!result) return res.status(500).send({Message:"Can't Logout Retailer please Check Your Data"})
    res.status(400).send({Message:"Retailer Logout Successfully Done..."})
}

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

