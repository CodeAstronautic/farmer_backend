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
    console.log("File:", file)
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: Storage,
})

module.exports = (app) => {
  const admin = require('../controllers/admin.controller.js');
  const farmer = require("../controllers/farmer.controller");
  const dealer = require("../controllers/dealer.controller");
  const buyer = require("../controllers/buyer.controller");
  const reatiler = require("../controllers/retailer.controller")
  const Selltrade = require("../controllers/sellTradeController");
  const filterQuery = require("../controllers/filterQueryController");
  const bank = require("../controllers/bank.controller");
  const addfarm = require("../controllers/addfarm.controller")
  // admin
  app.post('/api/admin/create', admin.createAdmin);
  app.post('/api/admin/sendotp', admin.adminotpsend);
  app.post('/api/admin/login', admin.adminlogin);
  // crop
  app.post('/api/admin/addCrop', authmiddleware.authenticateAdmin, validaterequestmiddleware(adminrequestschemas.addCrop), authmiddleware.authenticateAdmin, admin.addCrop);
  app.post('/api/admin/addCropcategory', authmiddleware.authenticateAdmin, validaterequestmiddleware(adminrequestschemas.addCropcategory), admin.addCropcategory);
  app.get('/api/admin/getCropCategory', authmiddleware.authenticateAdmin, admin.getCropCategory);
  app.post('/api/admin/addCropSubcategory', authmiddleware.authenticateAdmin, validaterequestmiddleware(adminrequestschemas.addCropSubcategory), admin.addCropSubcategory);
  app.get('/api/admin/getCropCategorybyname', authmiddleware.authenticateAdmin, admin.getCropCategorybyname);
  app.post('/api/admin/addCropPrice', authmiddleware.authenticateAdmin, validaterequestmiddleware(adminrequestschemas.addCropPrice), admin.addCropPrice);
  app.get('/api/admin/croplist', authmiddleware.authenticateAdmin, admin.croplist);
  //app.post('/api/admin/addCropSubcategoryType',authmiddleware.authenticateAdmin,validaterequestmiddleware(adminrequestschemas.addCropSubcategoryType),admin.addCropSubcategoryType);
  // user
  app.get('/api/admin/getusertype', authmiddleware.authenticateAdmin, admin.getUsertypes);
  app.get('/api/admin/userdetailbyid/:userid', authmiddleware.authenticateAdmin, admin.userdetail);
  // lands
  app.get('/api/admin/landmeasurementunits', authmiddleware.authenticateAdmin, admin.landmeasurementunits);
  app.get('/api/admin/landtypes', authmiddleware.authenticateAdmin, admin.landtypes);
  // citystate
  app.get('/api/admin/getcitystate', authmiddleware.authenticateAdmin, admin.getcitystate);
  // farmer
  app.post('/api/admin/createFarmer', authmiddleware.authenticateAdmin, validaterequestmiddleware(adminrequestschemas.createFarmer), farmer.createFarmer);
  app.get('/api/admin/getfarmers', authmiddleware.authenticateAdmin, farmer.getfarmers);
  app.get('/api/admin/getfarmerprofile/:id', authmiddleware.authenticateAdmin, farmer.getfarmerprofile);
  app.put('/api/admin/updatefarmerbyid/:id', authmiddleware.authenticateAdmin, farmer.updatefarmerbyid);
  app.delete('/api/admin/logoutfarmer/:id', authmiddleware.authenticateAdmin, farmer.logoutfarmer)
  // dealer
  app.post('/api/admin/createdealer', authmiddleware.authenticateAdmin, validaterequestmiddleware(adminrequestschemas.createDealer), authmiddleware.authenticateAdmin, dealer.createdealer);
  app.get('/api/admin/getdealers', authmiddleware.authenticateAdmin, dealer.getdealers);
  app.get('/api/admin/getdealerprofile/:id', authmiddleware.authenticateAdmin, dealer.getdealerprofile);
  app.put('/api/admin/updatedealerbyid/:id', authmiddleware.authenticateAdmin, dealer.updatedealerbyid);
  app.delete('/api/admin/logoutdealer/:id', authmiddleware.authenticateAdmin, dealer.logoutdealer);
  // buyer 
  app.post('/api/admin/createbuyer', authmiddleware.authenticateAdmin, validaterequestmiddleware(adminrequestschemas.createBuyer), authmiddleware.authenticateAdmin, buyer.createBuyer);
  app.get('/api/admin/getbuyer', authmiddleware.authenticateAdmin, buyer.getbuyer);
  app.get('/api/admin/getbuyerprofile/:id', authmiddleware.authenticateAdmin, buyer.getbuyerprofile);
  app.put('/api/admin/updatebuyerbyid/:id', authmiddleware.authenticateAdmin, buyer.updatebuyerbyid);
  app.delete('/api/admin/logoutbuyer/:id', authmiddleware.authenticateAdmin, buyer.logoutbuyer);
  //reatailer
  app.post('/api/admin/createretailer', authmiddleware.authenticateAdmin, validaterequestmiddleware(adminrequestschemas.createRetailer), authmiddleware.authenticateAdmin, reatiler.createretailer);
  app.get('/api/admin/getretailer', authmiddleware.authenticateAdmin, reatiler.getretailer);
  app.get('/api/admin/getretailerprofile/:id', authmiddleware.authenticateAdmin, reatiler.getretailerprofile);
  app.put('/api/admin/updateretailerbyid/:id', authmiddleware.authenticateAdmin, reatiler.updateretailerbyid);
  app.delete('/api/admin/logoutretailer/:id', authmiddleware.authenticateAdmin, reatiler.logoutretailer);
  // sellTrade 
  app.post('/api/admin/selltrade', authmiddleware.authenticateAdmin, upload.single('image'), Selltrade.sellTrade);
  app.get('/api/admin/getselltrade', authmiddleware.authenticateAdmin, Selltrade.GetSellTrade);
  app.get('/api/admin/getselltradebyid/:id', authmiddleware.authenticateAdmin, Selltrade.GetBySellTrade);
  app.put('/api/admin/selltrade/update/:id', authmiddleware.authenticateAdmin, upload.single('image'), Selltrade.updatesellTrade);
  app.delete('/api/admin/selltrade/delete/:id', authmiddleware.authenticateAdmin, Selltrade.DeleteSellTrade);
  // filterQuery
  app.get('/api/admin/getfilterQuery', authmiddleware.authenticateAdmin, filterQuery.getFilterQueryData);
  app.get('/api/admin/getfiltercommodity', authmiddleware.authenticateAdmin, filterQuery.getFilterCommodity);
  // bank
  app.post('/api/admin/loginbankaccount', authmiddleware.authenticateAdmin, bank.loginbankaccount);
  app.get('/api/admin/getbankaccount/:id', authmiddleware.authenticateAdmin, bank.getbankaccount)
  app.delete('/api/admin/deletebankaccount/:id', authmiddleware.authenticateAdmin, bank.deletebankaccount);
  // addfarm
  app.post('/api/farmer/addfarm',addfarm.addfarm);
  app.get('/api/farmer/getfarm',addfarm.getfarm);
}