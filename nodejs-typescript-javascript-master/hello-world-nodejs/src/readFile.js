
// refernce: https://www.tutorialspoint.com/nodejs/nodejs_event_loop.htm
var fs = require("fs");

fs.readFile('input.txt', function (err, data) {
   if (err){
      console.log(err.stack);
      return;
   }
   console.log(data.toString());
});

console.log("Program Ended");
