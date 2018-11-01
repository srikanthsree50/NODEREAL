
// Example for Call back Pattern i.e GotContent

var fs = require('fs');

fs.readFile(__filename,{encoding: 'utf8'},GotContent);

function GotContent(err,content) {
    if(err) {
        console.log(err);
    }
    else {
        console.log('this file contains content:\n\n%s',content);
    }
}