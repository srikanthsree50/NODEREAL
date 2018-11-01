var express = require('express');
var bookingRouter = express.Router()
var bookingBO = require('../business/bookingBO');
var logger = require('../utils/logging');
var responseInterceptor = require('../utils/responseInterceptor');

bookingRouter.post('/makeBooking',function (req, res) {
try{
    id = bookingBO.bookTable(req);
    res.setHeader('Content-Type', 'application/json');
    // res.send({'Message':'Booking successfully completed! Track booking using '+id})
     res.send(JSON.stringify({ a: 1 }, null, 3));
    responseInterceptor.logResponse(req,res);
  }catch(ex){
    logger.logError(null,'Exception occurred in booking router: '+ex.message);
  }
});

module.exports = bookingRouter;
