var a = new Object();
var b = new Object();


var val1 = Object.prototype.isPrototypeOf(b); //true
var val2 = a.isPrototypeOf(b); //false
console.log(val1+" : "+val2);

var c = Object.create(a);
c = b;
var val3 = b.isPrototypeOf(b);
console.log(val3); // false
