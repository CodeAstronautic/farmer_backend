const User = require('../models/user.model.js');
const {RecieptNumber} = require('../models/recieptNumber.model.js');
const {Trollyarrival} = require('../models/trollyarrival.model.js');
const {Paymentvoucher} = require('../models/paymentvoucher.model.js');
const {Paymentlog} = require('../models/paymentlog.model.js');
const {Farmers} = require('../models/farmer.model.js');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/keys.config.js');
var ObjectId = require('mongodb').ObjectID;

// Create and Save a new Note
exports.create = (req, res) => {
    // Validate request
    if(!req.body.phone || !req.body.password) {
        return res.status(400).send({
            message: "Phone number or password can not be empty"
        });
    }

    // Create a User
    const note = new User({
        name: req.body.name || "", 
        phone: req.body.phone,
        userType: "user",
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




exports.login = (req, res) => {
  if(!req.body.phone || !req.body.password) {
      return res.status(400).send({
          message: "Phone number or password can not be empty"
      });
  }
  User.findOne({ phone: req.body.phone }, function (err, user) {
     if (err) return res.status(500).send({message:'Error on the server.'});
     if (!user) return res.status(404).send({message:'No user found.'});
     
     //console.log('req.body.password, user.password',req.body.password, user.password);
     //var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
     var passwordIsValid = false;
     if(md5(req.body.password)==user.password){
        passwordIsValid = true;
     }

     if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
     
     var token = jwt.sign({ id: user._id,phone:user.phone,name:user.name,userType:user.userType,center:user.center }, config.secret, {
       expiresIn: 86400 // expires in 24 hours 
     });
     
     res.status(200).send({ auth: true, token: token,name:user.name,userType:user.userType,center:user.center });
   });
};


// Find a single note with a noteId
exports.user = (req, res) => {
    res.send(req.user);
    /*User.findById(req.params.noteId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });            
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.noteId
        });
    });*/
};

