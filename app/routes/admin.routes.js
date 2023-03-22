var authmiddleware = require('../middleware/authentication.middleware.js');
const adminrequestschemas = require('../requestschema/adminrequestschema.js'); 
const validaterequestmiddleware = require('../middleware/validaterequest.middleware.js'); 
const multer = require("multer")
const path = require("path")

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "./upload/post_sellTrade");
    },
    filename: function (req, file, callback) {
      console.log("File:",file)
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  });
  
  var upload = multer({
    storage: Storage,
})

module.exports = (app) => {
    const admin = require('../controllers/admin.controller.js');    
    const Selltrade = require("../controllers/SellTradeController");
    const filterQuery=require("../controllers/FilterQueryController");
    const bank=require("../controllers/bank.controller");
    //admin
    app.post('/api/admin/create', admin.createAdmin);
    app.post('/api/admin/login', admin.adminlogin);
    app.post('/api/admin/sendotp',admin.adminotpsend)
    //crop
    app.post('/api/admin/addCrop',authmiddleware.authenticateAdmin,validaterequestmiddleware(adminrequestschemas.addCrop), authmiddleware.authenticateAdmin,admin.addCrop);
    app.post('/api/admin/addCropcategory',authmiddleware.authenticateAdmin,validaterequestmiddleware(adminrequestschemas.addCropcategory),admin.addCropcategory);
    app.get('/api/admin/getCropCategory',authmiddleware.authenticateAdmin,admin.getCropCategory);
    app.post('/api/admin/addCropSubcategory',authmiddleware.authenticateAdmin,validaterequestmiddleware(adminrequestschemas.addCropSubcategory),admin.addCropSubcategory);
    app.get('/api/admin/getCropCategorybyname',authmiddleware.authenticateAdmin,admin.getCropCategorybyname);
    app.post('/api/admin/addCropPrice',authmiddleware.authenticateAdmin,validaterequestmiddleware(adminrequestschemas.addCropPrice),admin.addCropPrice);
    app.get('/api/admin/croplist', authmiddleware.authenticateAdmin,admin.croplist);
    //app.post('/api/admin/addCropSubcategoryType',authmiddleware.authenticateAdmin,validaterequestmiddleware(adminrequestschemas.addCropSubcategoryType),admin.addCropSubcategoryType);
    //user
    app.get('/api/admin/getusertype', authmiddleware.authenticateAdmin,admin.getUsertypes);
    app.get('/api/admin/userdetailbyid/:userid', authmiddleware.authenticateAdmin,admin.userdetail);
    //lands
    app.get('/api/admin/landmeasurementunits', authmiddleware.authenticateAdmin,admin.landmeasurementunits);
    app.get('/api/admin/landtypes', authmiddleware.authenticateAdmin,admin.landtypes);
    //citystate
    app.get('/api/admin/getcitystate', authmiddleware.authenticateAdmin,admin.getcitystate);
    //farmer
    app.post('/api/admin/createFarmer', authmiddleware.authenticateAdmin,validaterequestmiddleware(adminrequestschemas.createFarmer),admin.createFarmer);
    app.get('/api/admin/getfarmers', authmiddleware.authenticateAdmin,admin.getfarmers);
    app.get('/api/admin/getfarmerprofile/:id', authmiddleware.authenticateAdmin,admin.getfarmerprofile);
    app.put('/api/admin/updatefarmerbyid/:id', authmiddleware.authenticateAdmin,admin.updatefarmerbyid);
    app.delete('/api/admin/logoutfarmer/:id',authmiddleware.authenticateAdmin,admin.logoutfarmer)
    //dealer
    app.post('/api/admin/createdealer',authmiddleware.authenticateAdmin,validaterequestmiddleware(adminrequestschemas.createDealer), authmiddleware.authenticateAdmin,admin.createdealer);
    app.get('/api/admin/getdealers', authmiddleware.authenticateAdmin,admin.getdealers);
    app.get('/api/admin/getdealerprofile/:id', authmiddleware.authenticateAdmin,admin.getdealerprofile);
    app.put('/api/admin/updatedealerbyid/:id', authmiddleware.authenticateAdmin,admin.updatedealerbyid);
    app.delete('/api/admin/logoutdealer/:id', authmiddleware.authenticateAdmin,admin.logoutdealer);
    //buyer 
    app.post('/api/admin/createbuyer',authmiddleware.authenticateAdmin,validaterequestmiddleware(adminrequestschemas.createBuyer), authmiddleware.authenticateAdmin,admin.createBuyer);
    app.get('/api/admin/getbuyer', authmiddleware.authenticateAdmin,admin.getbuyer);
    app.get('/api/admin/getbuyerprofile/:id', authmiddleware.authenticateAdmin,admin.getbuyerprofile);
    app.put('/api/admin/updatebuyerbyid/:id', authmiddleware.authenticateAdmin,admin.updatebuyerbyid);
    app.delete('/api/admin/logoutbuyer/:id', authmiddleware.authenticateAdmin,admin.logoutbuyer);
    //reatailer
    app.post('/api/admin/createretailer',authmiddleware.authenticateAdmin,validaterequestmiddleware(adminrequestschemas.createRetailer), authmiddleware.authenticateAdmin,admin.createretailer);
    app.get('/api/admin/getretailer', authmiddleware.authenticateAdmin,admin.getretailer);
    app.get('/api/admin/getretailerprofile/:id', authmiddleware.authenticateAdmin,admin.getretailerprofile);
    app.put('/api/admin/updateretailerbyid/:id', authmiddleware.authenticateAdmin,admin.updateretailerbyid);
    app.delete('/api/admin/logoutretailer/:id', authmiddleware.authenticateAdmin,admin.logoutretailer);
    // sellTrade 
    app.post('/api/admin/selltrade',authmiddleware.authenticateAdmin,upload.single('image'),Selltrade.sellTrade); 
    app.get('/api/admin/getselltrade',authmiddleware.authenticateAdmin,Selltrade.GetSellTrade); 
    app.get('/api/admin/getselltradebyid/:id',authmiddleware.authenticateAdmin,Selltrade.GetBySellTrade); 
    app.put('/api/admin/selltrade/update/:id',authmiddleware.authenticateAdmin,upload.single('image'),Selltrade.updatesellTrade); 
    app.delete('/api/admin/selltrade/delete/:id',authmiddleware.authenticateAdmin,Selltrade.DeleteSellTrade); 
    // filterQuery
    app.get('/api/admin/getfilterQuery',authmiddleware.authenticateAdmin,filterQuery.getFilterQueryData);
    app.get('/api/admin/getfiltercommodity',authmiddleware.authenticateAdmin,filterQuery.getFilterCommodity);
    //bank
    app.post('/api/admin/loginbankaccount',authmiddleware.authenticateAdmin,bank.loginbankaccount);
    app.get('/api/admin/getbankaccount/:id',authmiddleware.authenticateAdmin,bank.getbankaccount)
    app.delete('/api/admin/deletebankaccount/:id',authmiddleware.authenticateAdmin,bank.deletebankaccount);
    //location
    app.post('/api/admin/getlocation',authmiddleware.authenticateAdmin,admin.getlocation);
    
}