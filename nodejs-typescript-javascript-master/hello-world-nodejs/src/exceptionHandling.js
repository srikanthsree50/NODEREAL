function myApiFunc(callback) {
    try {
      doSomeAsynchronousOperation((err) => {
          console.log(x); // error occurs here
              if (err)
                  throw (err);
          console.log("continue as normal");
        });
    }
    catch (ex) {
      callback(ex);
    }
}

function doSomeAsynchronousOperation(callback){
  console.log("Inside async method!! ");
  callback();
}

var callback= function (ex){
  console.log("Error found! "+ex);
};

myApiFunc(callback); // execution starts here
