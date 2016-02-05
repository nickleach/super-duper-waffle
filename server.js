var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var cors       = require('cors')
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var config     = require('./config');
var path       = require('path');
var moment     = require('moment');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.use(cors());
app.use(morgan('dev'));

//database connection
mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// API ROUTES ------------------------
var userRoutes = require('./app/routes/userRoutes')(app, express);
var restaurantRoutes = require('./app/routes/restaurantRoutes')(app, express);

app.use('/api', userRoutes);
app.use('/api', restaurantRoutes);

// Exception handling
app.use(function(err, req, res, next) {
  if(err.status !== 404) {
    return next(err);
  }
  res.status(404);
  res.send(err.message || 'Not found');
});


app.use(function(err, req, res, next) {
  console.log('Internal server error ' + err)
  res.status(500);
  res.send(err.message || 'oops! something broke');
});

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Running on ' + config.port + '...');
