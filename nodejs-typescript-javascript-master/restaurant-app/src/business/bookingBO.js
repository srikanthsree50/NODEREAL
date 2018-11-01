var random = require('../utils/randomIdGenerator');

var bookTable = function(req){
    var bookingId = random.getRandomNumber(null,req.requestTime);
    return bookingId;
};

module.exports={bookTable};
