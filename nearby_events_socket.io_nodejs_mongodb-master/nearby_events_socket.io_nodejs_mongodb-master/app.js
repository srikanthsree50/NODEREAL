const express = require('express');
const path = require('path');
const logger = require('morgan');
var passport = require('passport');
var fs = require('fs');
global.appRoot = path.resolve(__dirname);
var favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
var session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});

//router files

var routes = require('./routes/index');


//app
var app = express();

const options = {
  index: "index.html"
};

//env
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];

if (env !== 'production') {

  options.index = "index.dev.html";

  // expose node_modules to client app
  app.use(express.static(__dirname + "/node_modules"));
}



//logger
app.use(logger('dev'));
app.use(compression());

app.use(express.static(path.join(__dirname, 'public'), options));
app.use(express.static(path.join(__dirname, 'app')));
// app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());






// Routes registration
// ---

app.use('/api/', routes);





// Use shared session middleware for socket.io
// setting autoSave:true



// view engine setup
var engines = require('consolidate');

app.engine('jade', engines.jade);
app.engine('html', engines.ejs);

app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(cookieParser());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
