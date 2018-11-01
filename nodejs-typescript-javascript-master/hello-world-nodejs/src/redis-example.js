var redis = require('./redis-client-2');
var result = require('./result');

var obj = new result('1220','');

var printRes = function(){
    setTimeout(function () {
        console.log('Final result: '+obj.getResult());
      }, 1000);
}
console.log('Final result: '+obj.key);

redis.setter('1220','10 million');
redis.getter('1220',obj);
printRes();
