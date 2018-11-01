// Example for Escaping  Callback Hell

var fs = require('fs');
var path = require('path');

var dir = path.join(__dirname,'temp');
var source = __filename;
var target = path.join(dir,'target');

fs.mkdir(dir,mkdirCB);

function mkdirCB(err) {
    if(err) {
        handleError(err);
    }else {
        fs.readFile(source,HaveFile);
            }
}

function HaveFile(err,content) {
    if(err) {
        handleError(err);
    }
    else {
        fs.writeFile(target, content ,WroteFile);
    }
}

function WroteFile(err) {
    if(err) {
        handleError(err);
    }
    else {
        console.log('All done');
    }
}