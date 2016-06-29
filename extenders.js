if (!String.format)
  Object.defineProperty(String, "format", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      var args = Array.prototype.slice.call(arguments);
      var input = args.shift();
      var reg = /(?:\{([0-9]+)\})/gi;
      if (reg.test(input)) input = input.replace(reg, function(a, b) {
        var indx = parseInt(b);
        if (indx >= args.length) return '<out-of-range>';
        else if (args[b] === null) return "<null>";
        else if (args[b] === undefined) return "<undefined>";
        else return args[b].toString();
      });
      return input;
    }
  });

if (!Object.prototype.isArray)
  Object.defineProperty(Object.prototype, "isArray", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      return Array.prototype.isPrototypeOf(this);
    }
  });
if (!Object.prototype.isNumber)
  Object.defineProperty(Object.prototype, "isNumber", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      return Number.prototype.isPrototypeOf(this);
    }
  });
if (!Object.prototype.isString)
  Object.defineProperty(Object.prototype, "isString", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      return String.prototype.isPrototypeOf(this);
    }
  });
if (!Object.prototype.isDate)
  Object.defineProperty(Object.prototype, "isDate", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      return Date.prototype.isPrototypeOf(this);
    }
  });
if (!Object.prototype.isFunction)
  Object.defineProperty(Object.prototype, "isFunction", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      return Function.prototype.isPrototypeOf(this)
    }
  });
if (!Object.prototype.isObject)
  Object.defineProperty(Object.prototype, "isObject", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      return typeof this === "object";
    }
  });
if (!Object.prototype.isBoolean)
  Object.defineProperty(Object.prototype, "isBoolean", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      return Boolean.prototype.isPrototypeOf(this) || (this.isString() && (this === "true" || this === "false") || (this.isNumber() && (this === 0 || this === 1)));
    }
  });

if (!Object.prototype.toBoolean)
  Object.defineProperty(Object.prototype, "toBoolean", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      if (this.isBoolean()) return this;
      else if (this.isString()) {
        if (this.toLowerCase() === "true") return true;
        else if (this.toLowerCase() === "false") return false;
        else throw "the value must be \"true\" or \"false\".";
      } else if (this.isNumber()) {
        if (this === 1) return true;
        else if (this === 0) return false;
        else throw "the value must be 1 or 0.";
      } else throw String.format("{0} value is not convertible to boolean value.", JSON.stringify(this));
    }
  });
if (!Object.prototype.toNumber)
  Object.defineProperty(Object.prototype, "toNumber", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      if (isNaN(this)) throw String.format("{0} value is not convertible to a number.", JSON.stringify(this));
      return Number(this);
    }
  });


if (!Array.prototype.forEach)
  Object.defineProperty(Array.prototype, "forEach", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(callback) {
      if (!callback) throw "The callback is required";
      if (!callback.isFunction) throw "The callback is not a function";
      for (var i = 0, len = this.length; i < len; i++) {
        callback(this[i], i);
      }
      return this;
    }
  });
if (!Array.prototype.filter)
  Object.defineProperty(Array.prototype, "filter", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(callback) {
      if (!callback) throw "The callback is required";
      if (!callback.isFunction) throw "The callback is not a function";
      var newArray = [];
      for (var i = 0, len = this.length; i < len; i++) {
        if (callback(this[i], i)) {
          newArray.push(this[i]);
        }
      }
      return newArray;
    }
  });
if (!Array.prototype.find)
  Object.defineProperty(Array.prototype, "find", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(callback) {
      if (!callback) throw "The callback is required";
      if (!callback.isFunction()) throw "The callback is not a function";
      var result;
      for (var i = 0, len = this.length; i < len; i++) {
        if (callback(this[i], i)) {
          result = this[i];
          break;
        }
      }
      return result;
    }
  });
if (!Array.prototype.findIndex)
  Object.defineProperty(Array.prototype, "findIndex", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(callback) {
      if (!callback) throw "The callback is required";
      if (!callback.isFunction()) throw "The callback is not a function";
      var result;
      for (var i = 0, len = this.length; i < len; i++) {
        if (callback(this[i], i)) {
          result = i;
          break;
        }
      }
      return result || -1;
    }
  });
if (!Array.prototype.mergeAsProperties)
  Object.defineProperty(Array.prototype, "mergeAsProperties", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      var newObj = {};
      var _objects = this.filter(function(elem) {
        return typeof elem === "object"
      });
      _objects.forEach(function(obj) {
        var keys = Object.getOwnPropertyNames(obj);
        keys.forEach(function(key) {
          newObj[key] = newObj[key] || obj[key];
        });
      });
      return newObj;
    }
  });
if (!Array.prototype.last)
  Object.defineProperty(Array.prototype, "last", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      var len = this.length;
      if (len) return this[len - 1];
      else throw "This array is empty";
    }
  });
if (!Array.prototype.contains)
  Object.defineProperty(Array.prototype, "contains", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(item) {
      return this.indexOf(item) !== -1;
    }
  });
if (!Array.prototype.remove)
  Object.defineProperty(Array.prototype, "remove", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      var that = this;
      var objToRemove = Array.prototype.slice.call(arguments);
      objToRemove.forEach(function(obj) {
        while (that.contains(obj)) {
          that.splice(that.indexOf(obj), 1);
        }
      });
      return that;
    }
  });

if (!Object.prototype.clone)
  Object.defineProperty(Object.prototype, "clone", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      var that = this;
      var newObj = new that.constructor();
      var keys = Object.getOwnPropertyNames(that);
      keys.forEach(function(key) {
        newObj[key] = typeof that[key] !== "object" ? that[key] : that[key].clone();
      });
      return newObj;
    }
  });
if (!Date.prototype.clone)
  Object.defineProperty(Date.prototype, "clone", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      return new Date(this.toString());
    }
  });
if (!Object.prototype.defaults)
  Object.defineProperty(Object.prototype, "defaults", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      var defaultValues = Array.prototype.slice.call(arguments);
      var that = this;
      var _defaultValues = (defaultValues.length == 1 && defaultValues[0].isArray() ? defaultValues[0] : defaultValues).mergeAsProperties();
      var keys = Object.getOwnPropertyNames(_defaultValues);
      keys.forEach(function(key) {
        that[key] = that[key] || _defaultValues[key];
      });
      return that;
    }
  });
if (!Object.prototype.pick)
  Object.defineProperty(Object.prototype, "pick", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      var keyToKeep = (arguments[0].isArray() ? arguments[0] : Array.prototype.slice.call(arguments));
      var that = this;
      var newObj = new that.constructor();
      keyToKeep.filter(function(key) {
        return that.hasOwnProperty(key);
      }).forEach(function(key) {
        newObj[key] = that[key];
      });
      return newObj;
    }
  });
if (!Object.prototype.omit)
  Object.defineProperty(Object.prototype, "omit", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function() {
      var keys = Array.prototype.slice.call(arguments);
      var that = this;
      var newObj = that.clone();
      keys.forEach(function(key) {
        delete newObj[key];
      });
      return newObj;
    }
  });
if (!Object.prototype.hasValues)
  Object.defineProperty(Object.prototype, "hasValues", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(values) {
      var that = this;
      var keys = Object.getOwnPropertyNames(values);
      var result = true;
      keys.forEach(function(key) {
        if (that[key] !== values[key]) result = false;
      });
      return result;
    }
  });

if (!Object.prototype.extend)
  Object.defineProperty(Object.prototype, "extend", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(self, extendWith) {
      var that = this;
      var source = self ? that : that.clone();
      var extentions = Array.prototype.slice.call(arguments, 1).mergeAsProperties();
      var keys = Object.getOwnPropertyNames(extentions);
      keys.forEach(function(key) {
        source[key] = extentions[key];
      });
      return source;
    }
  });

if (!Object.prototype.trimAll)
  Object.defineProperty(Object.prototype, "trimAll", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(deep) {
      var that = this;
      var keys = Object.getOwnPropertyNames(that);
      keys.forEach(function(key) {
        if (that[key].isString()) that[key] = that[key].trim();
        else if (typeof that[key] === "object" && deep === true) that[key].trimAll(true);
      });
      return that;
    }
  });

if (!Array.prototype.filterByValues)
  Object.defineProperty(Array.prototype, "filterByValues", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(values) {
      if (!values) throw "An object is required";
      if (!values.isObject()) throw "The param must be an object";
      var newArray = [];
      for (var i = 0, len = this.length; i < len; i++) {
        if (this[i].hasValues(values)) {
          newArray.push(this[i]);
        }
      }
      return newArray;
    }
  });
if (!Array.prototype.findByValues)
  Object.defineProperty(Array.prototype, "findByValues", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(values) {
      if (!values) throw "An object is required";
      if (!values.isObject()) throw "The param must be an object";
      var result;
      for (var i = 0, len = this.length; i < len; i++) {
        if (this[i].hasValues(values)) {
          result = this[i];
          break;
        }
      }
      return result;
    }
  });