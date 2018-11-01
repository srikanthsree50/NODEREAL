var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
  //  console.log('connected');
});


var setter = function(key,value){
  client.set(key,value,function(err, reply) {
    console.log(reply);
  });
}

var getter = function(key,obj){
client.get(key,function(err, reply) {
  console.log(reply);
  obj.setResult(reply);
  });
}


module.exports={setter,getter};
