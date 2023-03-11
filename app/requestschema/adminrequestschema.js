const Joi = require('joi') 
const adminrequestschemas = { 
  createFarmer: Joi.object().keys({ 
              name: Joi.string().min(3).max(100).required(), 
              phone: Joi.string().min(10).max(20).required(), 
              email: Joi.string().email().required(), 
              password: Joi.string().min(4).max(50).required(),
              locality: Joi.string().min(2).max(200),
              city: Joi.string().min(2).max(50),
              state: Joi.string().min(2).max(50),
              taluk: Joi.string().min(2).max(50),
              country: Joi.string().min(2).max(50),
              pin: Joi.string().min(2).max(20),
              farmerdetail: Joi.object(),
              bankingdetail: Joi.object(),
              crops: Joi.array()
            }),  
  createDealer: Joi.object().keys({ 
              name: Joi.string().min(3).max(100).required(), 
              phone: Joi.string().min(10).max(20).required(), 
              email: Joi.string().email().required(), 
              password: Joi.string().min(4).max(50).required(),
              locality: Joi.string().min(2).max(200),
              city: Joi.string().min(2).max(50),
              state: Joi.string().min(2).max(50),
              taluk: Joi.string().min(2).max(50),
              country: Joi.string().min(2).max(50),
              pin: Joi.string().min(2).max(20),
              bankingdetail: Joi.object(),
              crops: Joi.array(),
              userdetail: Joi.object()
            }) ,
   createBuyer: Joi.object().keys({ 
              name: Joi.string().min(3).max(100).required(), 
              phone: Joi.string().min(10).max(20).required(), 
              email: Joi.string().email().required(), 
              password: Joi.string().min(4).max(50).required(),
              locality: Joi.string().min(2).max(200),
              city: Joi.string().min(2).max(50),
              state: Joi.string().min(2).max(50),
              taluk: Joi.string().min(2).max(50),
              country: Joi.string().min(2).max(50),
              pin: Joi.string().min(2).max(20),
              bankingdetail: Joi.object(),
              crops: Joi.array(),
              userdetail: Joi.object()
            }), 
   createRetailer: Joi.object().keys({ 
              name: Joi.string().min(3).max(100).required(), 
              phone: Joi.string().min(10).max(20).required(), 
              email: Joi.string().email().required(), 
              password: Joi.string().min(4).max(50).required(),
              locality: Joi.string().min(2).max(200),
              city: Joi.string().min(2).max(50),
              state: Joi.string().min(2).max(50),
              taluk: Joi.string().min(2).max(50),
              country: Joi.string().min(2).max(50),
              pin: Joi.string().min(2).max(20),
              bankingdetail: Joi.object(),
              crops: Joi.array(),
              userdetail: Joi.object()
            }), 
   addCropcategory: Joi.object().keys({ 
              name: Joi.string().min(2).max(150).required()
            }), 
   addCropSubcategory: Joi.object().keys({ 
              categoryname: Joi.string().min(2).max(150).required(),
              subcategoryname: Joi.string().min(2).max(150).required(),
              subcategorytype: Joi.string().min(2).max(150).required()
            }),
  /* addCropSubcategoryType: Joi.object().keys({ 
              categoryname: Joi.string().min(2).max(150).required(),
              subcategoryname: Joi.string().min(2).max(150).required(),
              subcategorytype: Joi.string().min(2).max(150).required()
            }), */
   addCrop: Joi.object().keys({ 
              cropname: Joi.string().min(2).max(150).required(),
              categoryname: Joi.string().min(2).max(150).required(),
              subcategoryname: Joi.string().min(2).max(150),
              subcategorytype: Joi.string().min(2).max(150)
            }) , 
   addCropPrice: Joi.object().keys({ 
              cropid: Joi.string().min(24).max(24).required(),
              baseprice: Joi.array(),
              saleprice: Joi.array(),
              quoteprice: Joi.array()
            }) 
  // define all the other schemas below 
}; 
module.exports = adminrequestschemas;