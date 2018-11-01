var redis = require('redis-stream'),
    client = new redis(6379, '127.0.0.1');

// Open stream
var stream = client.stream();

// Example of setting 10000 records
for(var record = 0; record < 10; record++) {

    // Command is an array of arguments:
    var command = ['set', 'key' + record, 'value'];

    // Send command to stream, but parse it before
    stream.redis.write( redis.parse(command) );
}

// Create event when stream is closed
stream.on('close', function () {
    console.log('Completed!');

    // Here you can create stream for reading results or similar
});

// Close the stream after batch insert
stream.end();
