exports = module.exports;
var logger = require('./logging');

var logRequest= function(options) {
  return function(req, res, next) {
    try{
      req.requestTime = Date.now();
      var jsonBody = JSON.stringify(req.body);
      if(!jsonBody ||2 === jsonBody.length){
        logger.logInfo(null,"Request "+req.url+" recieve at: "+req.requestTime);
      }
      else{
        logger.logInfo(null,"JSON Body is: "+jsonBody+" recieved at: "+req.requestTime);
      }
      next();
    }
    catch(ex){
      logger.logError('Exception occurred in requestInterceptor: '+ex.message())
    }
  }
};

exports.logRequest = logRequest;
