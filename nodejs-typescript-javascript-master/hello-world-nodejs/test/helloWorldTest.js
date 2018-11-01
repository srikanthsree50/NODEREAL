  require('./../bin/dev');

  /**
  JavaScript to test the helloWorld Service
  **/
  var rootDirectory = process.env.FILE_ROOT_DIR;
  var expect = require("chai").expect;
  var hwObject = require(rootDirectory+'/server/helloWorld.js');

  /**
  Method to test the sayHello function
  **/
  describe("test demo", function() {

    describe("test-case 1", function() {
      it("test expected value", function () {
        expect("Welcome to hello world!").to.equals(hwObject.sayHi());
      });
    });

    describe("test-case 2", function() {
      it("test expected value", function () {
        expect("Thanks and Vist Again!").to.equals(hwObject.sayBye());
      });
    });

  });
