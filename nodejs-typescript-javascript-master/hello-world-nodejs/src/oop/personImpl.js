var Person = require('./person');

var bob = new Person("Bob", 47);

// bob.greet();
bob.slowGreet();
console.log(bob.message);
console.log('Ended execution!');
