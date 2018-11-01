var express = require('express');
var statusRouter = express.Router()
var logger = require('../utils/logging');

statusRouter.get('/getBookingDetails/:bookingNumber',function (req, res){
    try{
        res.send("Booking Number: "+req.params.bookingNumber+" --> Booking at 4 PM in the evening!");
      }catch(ex){
        logger.logError('Exception occurred in status Router: '+ex.message);
      }
});

module.exports = statusRouter;
