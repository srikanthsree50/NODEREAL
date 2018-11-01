var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
  //  console.log('connected');
});


function getter(){
var res = '';

return new Promise(function(resolve, reject) {

      client.get('name',function(err, reply) {
        console.log('Promise result: '+reply);
        res = reply;
      });


      /**if(res!=''){
        resolve(res);
      }else{
        reject('Not Done!');
      }**/

  }).then(token => {return res}).catch('Error!');
}

function resultPrint(result){
  console.log('Result outside block: '+result);
}

var r = getter();
r.then(function(result) {
   console.log(result) //will log results.
})

// getter.then(function(result){console.log('Result outside block: ')}).catch('Error occured');
console.log('Completed execution');
