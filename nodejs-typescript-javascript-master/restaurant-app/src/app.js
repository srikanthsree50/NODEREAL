// execution command: npm run dev
var statusRouter = require('./routers/statusRouter');
var bookingRouter = require('./routers/bookingRouter');
var pdfDisplayRouter = require('./routers/pdfDisplayRouter');
var express = require('express');
var app = express();
var requestInterceptor = require('./utils/requestInterceptor.js');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var session = require('cookie-session');
var expiryDate = new Date(Date.now() + 60 * 60 * 1000);
var fs = require('fs');
var rfs = require('rotating-file-stream');
var morgan = require('morgan');
var accessDirectory = './logs/access/';
// ensure log directory exists
fs.existsSync(accessDirectory) || fs.mkdirSync(accessDirectory);

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: accessDirectory
});

app.use(morgan('dev', {stream: accessLogStream}));

app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'example.com',
    path: 'foo/bar',
    expires: expiryDate
  }
}));
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestInterceptor.logRequest());
app.use('/table-booking', bookingRouter);
app.use('/booking-details', statusRouter);
app.use('/pdf-details', pdfDisplayRouter);

app.listen(3000);
