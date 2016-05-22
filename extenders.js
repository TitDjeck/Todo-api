
Object.prototype.isArray = Object.prototype.isArray || function(){ return Array.prototype.isPrototypeOf(this); };
Object.prototype.isBoolean = Object.prototype.isBoolean || function(){ return Boolean.prototype.isPrototypeOf(this); };
Object.prototype.isNumber = Object.prototype.isNumber || function(){ return Number.prototype.isPrototypeOf(this); };
Object.prototype.isString = Object.prototype.isString || function(){ return String.prototype.isPrototypeOf(this); };
Object.prototype.isDate = Object.prototype.isDate || function(){ return Date.prototype.isPrototypeOf(this); };
Object.prototype.isFunction = Object.prototype.isFunction || function(){ return Function.prototype.isPrototypeOf(this) };

Array.prototype.forEach = Array.prototype.forEach || function(callback){
  if(!callback) throw "The callback is required";
  if(!callback.isFunction) throw "The callback is not a function";
  for(var i = 0, len = this.length; i < len; i++){
    callback(this[i], i);
  }
  return this;
};
Array.prototype.filter = Array.prototype.filter || function(callback){
  if(!callback) throw "The callback is required";
  if(!callback.isFunction) throw "The callback is not a function";
  var newArray = [];
  for(var i = 0, len = this.length; i < len; i++){
    if(callback(this[i], i)){
      newArray.push(this[i]);
    }
  }
  return newArray;
};
Array.prototype.find = Array.prototype.find || function(callback){
  if(!callback) throw "The callback is required";
  if(!callback.isFunction) throw "The callback is not a function";
  var result;
  for(var i = 0, len = this.length; i < len; i++){
    if(callback(this[i], i)){
      result = this[i];
      break;
    }
  }
  return result;
};
Array.prototype.findIndex = Array.prototype.findIndex || function(callback){
  if(!callback) throw "The callback is required";
  if(!callback.isFunction) throw "The callback is not a function";
  var result;
  for(var i = 0, len = this.length; i < len; i++){
    if(callback(this[i], i)){
      result = i;
      break;
    }
  }
  return result || -1;
};
Array.prototype.mergeAsProperties = Array.prototype.mergeAsProperties || function(){
  var newObj = {};
  var _objects = this.filter(function(elem){return typeof elem === "object"});
  _objects.forEach(function(obj){
    var keys = Object.getOwnPropertyNames(obj);
    keys.forEach(function(key){
      newObj[key] = newObj[key] || obj[key];
    });
  });
  return newObj;
};
Array.prototype.last = Array.prototype.last || function(){
  var len = this.length;
  if(len) return this[len-1];
  else throw "This array is empty";
};
Array.prototype.contains = Array.prototype.contains || function (item) {
  return this.indexOf(item) !== -1;
};
Array.prototype.remove = Array.prototype.remove || function(){
  var that = this;
  var objToRemove = Array.prototype.slice.call(arguments);
  objToRemove.forEach(function(obj){
    while(that.contains(obj)){
      that.splice(that.indexOf(obj), 1);
    }
  });
  return that;
};

Object.prototype.clone = Object.prototype.clone || function(){
  var that = this;
  var newObj = new that.constructor();
  var keys = Object.getOwnPropertyNames(that);
  keys.forEach(function(key){
    newObj[key] = typeof that[key] !== "object" ? that[key] : that[key].clone();
  });
  return newObj;
};
Date.prototype.clone = Date.prototype.clone ||function(){
  return new Date(this.toString());
};
Object.prototype.defaults = Object.prototype.defaults || function(){
  var defaultValues = Array.prototype.slice.call(arguments);
  var that = this;
  var _defaultValues = (defaultValues.length == 1 && defaultValues[0].isArray() ? defaultValues[0] : defaultValues).mergeAsProperties();
  var keys = Object.getOwnPropertyNames(_defaultValues);
  keys.forEach(function(key){
    that[key] = that[key] || _defaultValues[key];
  });
  return that;
};
Object.prototype.pick = Object.prototype.pick || function(){
  var keyToKeep = Array.prototype.slice.call(arguments);
  var that = this;
  var newObj = new that.constructor();
  keyToKeep.filter(function(key){
    return that.hasOwnProperty(key);
  }).forEach(function(key){
    newObj[key] = that[key];
  });
  return newObj;
};
Object.prototype.omit = Object.prototype.omit || function(){
  var keys = Array.prototype.slice.call(arguments);
  var that = this;
  var newObj = that.clone();
  keys.forEach(function(key){
    delete newObj[key];
  });
  return newObj;
};

Object.prototype.trimAll = function(deep){
  var that = this;
  var keys = Object.getOwnPropertyNames(that);
  keys.forEach(function(key){
    if(that[key].isString()) that[key] = that[key].trim();
    else if (typeof that[key] === "object" && deep === true) that[key].trimAll(true);
  });
  return that;
}

String.format = String.format || function(){
  var args = Array.prototype.slice.call(arguments);
  var input = args.shift();
  var reg = /(?:\{([0-9]+)\})/gi;
  if(reg.test(input)) input = input.replace(reg, function(a, b){
    var indx = parseInt(b);
    if(indx >= args.length) return '<out-of-range>';
    else if (args[b] === null) return "<null>";
    else if(args[b] === undefined) return "<undefined>";
    else return args[b].toString();
  });
  return input;
};
