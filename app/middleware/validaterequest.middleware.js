//const Joi = require('joi'); 
const validaterequestmiddleware = (schema, property) => { 
  return (req, res, next) => { 
  const options = {
          errors: {
            wrap: {
              label: ''
            }
          }
        };
  const { error } = schema.validate(req.body,options); 
  const valid = error == null; 
  
  if (valid) { 
    next(); 
  } else { 
    const { details } = error; 
    const message = details.map(i => i.message).join(',');
 
    //console.log("error", message); 
   res.status(422).json({ message: message }) } 
  } 
} 
module.exports = validaterequestmiddleware;