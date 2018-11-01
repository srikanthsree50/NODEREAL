var redis = require('redis');
var client = redis.createClient();


client.on('connect', function() {
   //  console.log('connected');
});

function reportPromise1(){
var res = '';
return new Promise(function(resolve, reject) {
  client.get('name',function(err, reply) {
  //  console.log('Promise result: '+reply);
    res = 'reply'+'1';
      });
  }).then(token => {return res}).catch('Error!');
}

function reportPromise2(){
var res = '';
return new Promise(function(resolve, reject) {
  client.get('name',function(err, reply) {
    // console.log('Promise result: '+reply);
    res = 'reply'+'2';
      });
  }).then(token => {return res}).catch('Error!');
}

function invokePromise(promise){
  promise.then(function(result) {
     console.log(result) //will log results.
  }).catch('Error!')
}



// var allPromise = Promise.all([reportPromise1,reportPromise2]).then(console.log('Done!'), console.error('Failed'))
// invokePromise(allPromise)
Promise.all([reportPromise1, reportPromise2]).then(values => {
  console.log(values); // [3, 1337, "foo"]
});

console.log('Completed execution');
