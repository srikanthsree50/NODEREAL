exports = module.exports;
var logger = require('./logging');

var logResponse= function(req,res) {
    try{
      res.responseTime = Date.now();
      var jsonBody = JSON.stringify(res.body);
      logger.logInfo(null,"JSON Body is: "+res.body+" recieved at: "+res.responseTime);
      }
    catch(ex){
      logger.logError('Exception occurred in responseInterceptor: '+ex.message())
    }
};

exports.logResponse = logResponse;
