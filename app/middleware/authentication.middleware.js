var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/keys.config.js');

exports.authenticate = (req,res,next) =>{
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, config.secret, function(err, decoded) {
     if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
     //console.log('decoded',decoded);
     req.user = decoded;
     next();
   });
}

exports.authenticateAdmin = (req,res,next) =>{
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, config.secret, function(err, decoded) {
     if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
     //console.log('decoded',decoded);
     if(decoded.userType!='admin')
     	return res.status(401).send({ auth: false, message: 'Unauthorized Access' });
     
     req.user = decoded;
     next();
   });
} 
