var Person = {
  greet: function () {
    var message = "Hello world, my name is " + this.name;
    console.log(message);
    return message;
  }
};
// var frank = Object.create(Person);
var frank = Object.create(Person, {name: {value: "Frank Dijon", enumerable: true}});
// frank.name = "Frank Dijon";
frank.greet();
