var fs = require("fs");

var p = new Promise(function(resolve, reject) {
    	if(true) {
        console.log("Promise is success!")
    		resolve('Success!');
    	}
    	else {
    		reject('Failure!');
    	}
});

function performWriteModule(){
p.then(console.log("Inside Promise invocation "+res)).catch();
}

performWriteModule()
console.log("Execution completed!")
