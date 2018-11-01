// refer: https://www.sitepoint.com/how-to-create-a-node-js-cluster-for-speeding-up-your-apps/

var cluster = require('cluster');

   var numCPUs = require('os').cpus().length;

       if (cluster.isMaster) {
         // In real life, you'd probably use more than just 2 workers,
         // and perhaps not put the master and worker in the same file.
         //
         // You can also of course get a bit fancier about logging, and
         // implement whatever custom logic you need to prevent DoS
         // attacks and other bad behavior.
         //
         // See the options in the cluster documentation.
         //
         // The important thing is that the master does very little,
         // increasing our resilience to unexpected errors.
           console.log('your server is working on ' + numCPUs + ' cores');

            for (var i = 0; i < numCPUs; i++) {
                   cluster.fork();
                 }

         cluster.on('disconnect', function(worker) {
           console.error('disconnect!');
           //clearTimeout(timeout);
           cluster.fork();
         });


       } else {
           require('../src/app.js');

       }
