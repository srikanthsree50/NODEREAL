var express = require('express');
var pdfDisplayRouter = express.Router()
var fs = require("fs");
var filename = "file_1.pdf";
var logger = require('../utils/logging');

pdfDisplayRouter.get('/getPDF/',function (req, res){
  try{
      var stream = fs.createReadStream('././src/routers/files/'+filename);
      // filename = encodeURIComponent(filename);
      res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
      res.setHeader('Content-type', 'application/pdf');
      stream.pipe(res);
    }catch(ex){
        logger.logError('Exception occurred in pdf display router: '+ex.message);
    }
});

module.exports = pdfDisplayRouter;
