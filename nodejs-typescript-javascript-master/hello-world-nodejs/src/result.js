function result(key,value) {
  this.key = key;
  this.value = value;
};

result.prototype.setResult = function setResult(value) {
  this.value = value;
};

result.prototype.getResult = function getResult() {
return   this.value;
};

module.exports = result;
