var Collections = require('typescript-collections');

var mySet = new Collections.Set();
mySet.add("1");
mySet.add("12");
mySet.add("123");

mySet.forEach(function(element) {
  if(element>1){
      console.log('Set element '+element);
  }
});

var myQueue = new Collections.Queue();
myQueue.enqueue(1);
myQueue.enqueue(2);

console.log(myQueue.dequeue()); // prints 1
console.log(myQueue.dequeue()); // prints 2
