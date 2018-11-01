  var numbers = [2,4,1,5,4]

  var cbParent = function(arr,callback){
        var func = function isBiggerThanTwo (num) {
                    return num > 2}
        callback(arr.filter(func));
  }

  cbParent(numbers,function(arr){
        arr.forEach(function (x) {console.log(x)})
  });
  console.log("Printing numbers!!");
