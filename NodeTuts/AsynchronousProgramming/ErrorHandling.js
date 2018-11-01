// Example for Generalizing  Error Handling
var fs = require('fs');
var path = require('path');

var dir = path.join(__dirname,'temp');
var source = __filename;
var target = path.join(dir,'target');

fs.mkdir(dir,HandlingError(mkdirCB));

function mkdirCB() {
        fs.readFile(source,HandlingError(HaveFile));
}

function HaveFile(content) {
        fs.writeFile(target, content ,HandlingError(WroteFile));
}

function WroteFile() {
        console.log('All done');
}

function HandlingError (cb,result) {
    return function(err) {
        if(err) {
            handleError(err);
        }
        else {
            cb(result);
        }
    }
}