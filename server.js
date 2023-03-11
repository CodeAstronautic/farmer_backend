const express = require('express');
const bodyParser = require('body-parser');
const logger 	 = require('morgan');
// create express app
const app = express();
app.use(logger('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
  //let origin = ["*","http://localhost:3000"];
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Referer, Accept,x-access-token,Authorization");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


// define a simple route
app.get('/api', (req, res) => {
    res.json({"message": "Welcome to Farmer application."});
});

require('./app/routes/admin.routes.js')(app);

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// listen for requests
const PORT=3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});