var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
   //  console.log('connected');
});

function getReport(){
  return new Promise((resolve, reject) => {
    var res = '';
      client.get('name',function(err, reply) {
        res = 'report details{}'
        if(res!=''){
          resolve(res);
        }else{
          reject('Failed to generate report');
        }
      });
  });
}

function getPrimaryKey(){
  return new Promise((resolve, reject) => {
    var res = '';
      client.get('name',function(err, reply) {
      res = 'keyAbcd'+'1';
      if(res!=''){
          resolve(res);
      }else{
          reject('Failed to generate key');
        }
      });
  });
}

function persistInCache(){
  return new Promise((resolve, reject) => {
    var res = '';
      client.get('name',function(err, reply) {
        res = 'Cached!';
      if(res!=''){
          resolve(res);
      }else{
          reject('Failed to persist in cache');
        }
      });
  });
}

function persistInMongoDB(){
  return new Promise((resolve, reject) => {
    var res = '';
      client.get('name',function(err, reply) {
        res = 'Saved in MongoDB!';
      if(res!=''){
          resolve(res);
      }else{
          reject('Failed to persist in MongoDB');
        }
      });
  });
}

function persistInMySQLDB(){
  return new Promise((resolve, reject) => {
    var res = '';
      client.get('name',function(err, reply) {
        res = 'Saved in MySQLDB!';
      if(res!=''){
          resolve(res);
      }else{
          reject('Failed to persist in MySQLDB');
        }
      });
  });
}

function logFinalResults(results){
  var i =1;
  results.forEach(function(element) {
    console.log('Final result for promise '+i+' : '+element);
    i++;
  });
}

function executeChildPromises(arr){
  console.log('Promise step 1 results: '+arr[0]+' :: '+ arr[1]);
  Promise.all([persistInCache(), persistInMongoDB(), persistInMySQLDB()]).then(values => {
    logFinalResults(values);
  }).catch(reason => {
    console.log(reason)
  });
}

function performExecution(){
  Promise.all([getReport(), getPrimaryKey()]).then(values => {
    executeChildPromises(values);
  }).catch(reason => {
    console.log(reason)
  });
}

console.log('Completed execution');
performExecution();
