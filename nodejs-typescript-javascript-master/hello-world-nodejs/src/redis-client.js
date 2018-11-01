var redis = require('redis');
var client = redis.createClient();

// var client = redis.createClient(6739, '127.0.0.1');

client.on('connect', function() {
    console.log('connected');
});

var json = "{'data':[{'stuff':[{'onetype':[{'id':1,'name':'John Doe'},{'id':2,'name':'Don Joeh'}]},{'othertype':[{'id':2,'company':'ACME'}]}]},{'otherstuff':[{'thing':[[1,42],[2,2]]}]}]}";

client.set('json', json, function(err, reply) {
  console.log(reply);
});

client.get('json', function(err, reply) {
  console.log(reply);
});
