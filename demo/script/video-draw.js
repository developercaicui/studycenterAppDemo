(function() {
	var root = this;
	var previousUnderscore = root._;
	var breaker = {};
	var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
	var push = ArrayProto.push, slice = ArrayProto.slice, concat = ArrayProto.concat, unshift = ArrayProto.unshift, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
	var nativeForEach = ArrayProto.forEach, nativeMap = ArrayProto.map, nativeReduce = ArrayProto.reduce, nativeReduceRight = ArrayProto.reduceRight, nativeFilter = ArrayProto.filter, nativeEvery = ArrayProto.every, nativeSome = ArrayProto.some, nativeIndexOf = ArrayProto.indexOf, nativeLastIndexOf = ArrayProto.lastIndexOf, nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind;
	var _ = function(obj) {
		if ( obj instanceof _)
			return obj;
		if (!(this instanceof _))
			return new _(obj);
		this._wrapped = obj;
	};
	if ( typeof exports !== "undefined") {
		if ( typeof module !== "undefined" && module.exports) {
			exports = module.exports = _;
		}
		exports._ = _;
	} else {
		root["_"] = _;
	}
	_.VERSION = "1.4.2";
	var each = _.each = _.forEach = function(obj, iterator, context) {
		if (obj == null)
			return;
		if (nativeForEach && obj.forEach === nativeForEach) {
			obj.forEach(iterator, context);
		} else if (obj.length === +obj.length) {
			for (var i = 0, l = obj.length; i < l; i++) {
				if (iterator.call(context, obj[i], i, obj) === breaker)
					return;
			}
		} else {
			for (var key in obj) {
				if (_.has(obj, key)) {
					if (iterator.call(context, obj[key], key, obj) === breaker)
						return;
				}
			}
		}
	};
	_.map = _.collect = function(obj, iterator, context) {
		var results = [];
		if (obj == null)
			return results;
		if (nativeMap && obj.map === nativeMap)
			return obj.map(iterator, context);
		each(obj, function(value, index, list) {
			results[results.length] = iterator.call(context, value, index, list);
		});
		return results;
	};
	_.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
		var initial = arguments.length > 2;
		if (obj == null)
			obj = [];
		if (nativeReduce && obj.reduce === nativeReduce) {
			if (context)
				iterator = _.bind(iterator, context);
			return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
		}
		each(obj, function(value, index, list) {
			if (!initial) {
				memo = value;
				initial = true;
			} else {
				memo = iterator.call(context, memo, value, index, list);
			}
		});
		if (!initial)
			throw new TypeError("Reduce of empty array with no initial value");
		return memo;
	};
	_.reduceRight = _.foldr = function(obj, iterator, memo, context) {
		var initial = arguments.length > 2;
		if (obj == null)
			obj = [];
		if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
			if (context)
				iterator = _.bind(iterator, context);
			return arguments.length > 2 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
		}
		var length = obj.length;
		if (length !== +length) {
			var keys = _.keys(obj);
			length = keys.length;
		}
		each(obj, function(value, index, list) {
			index = keys ? keys[--length] : --length;
			if (!initial) {
				memo = obj[index];
				initial = true;
			} else {
				memo = iterator.call(context, memo, obj[index], index, list);
			}
		});
		if (!initial)
			throw new TypeError("Reduce of empty array with no initial value");
		return memo;
	};
	_.find = _.detect = function(obj, iterator, context) {
		var result;
		any(obj, function(value, index, list) {
			if (iterator.call(context, value, index, list)) {
				result = value;
				return true;
			}
		});
		return result;
	};
	_.filter = _.select = function(obj, iterator, context) {
		var results = [];
		if (obj == null)
			return results;
		if (nativeFilter && obj.filter === nativeFilter)
			return obj.filter(iterator, context);
		each(obj, function(value, index, list) {
			if (iterator.call(context, value, index, list))
				results[results.length] = value;
		});
		return results;
	};
	_.reject = function(obj, iterator, context) {
		var results = [];
		if (obj == null)
			return results;
		each(obj, function(value, index, list) {
			if (!iterator.call(context, value, index, list))
				results[results.length] = value;
		});
		return results;
	};
	_.every = _.all = function(obj, iterator, context) {
		iterator || ( iterator = _.identity);
		var result = true;
		if (obj == null)
			return result;
		if (nativeEvery && obj.every === nativeEvery)
			return obj.every(iterator, context);
		each(obj, function(value, index, list) {
			if (!( result = result && iterator.call(context, value, index, list)))
				return breaker;
		});
		return !!result;
	};
	var any = _.some = _.any = function(obj, iterator, context) {
		iterator || ( iterator = _.identity);
		var result = false;
		if (obj == null)
			return result;
		if (nativeSome && obj.some === nativeSome)
			return obj.some(iterator, context);
		each(obj, function(value, index, list) {
			if (result || ( result = iterator.call(context, value, index, list)))
				return breaker;
		});
		return !!result;
	};
	_.contains = _.include = function(obj, target) {
		var found = false;
		if (obj == null)
			return found;
		if (nativeIndexOf && obj.indexOf === nativeIndexOf)
			return obj.indexOf(target) != -1;
		found = any(obj, function(value) {
			return value === target;
		});
		return found;
	};
	_.invoke = function(obj, method) {
		var args = slice.call(arguments, 2);
		return _.map(obj, function(value) {
			return (_.isFunction(method) ? method : value[method]).apply(value, args);
		});
	};
	_.pluck = function(obj, key) {
		return _.map(obj, function(value) {
			return value[key];
		});
	};
	_.where = function(obj, attrs) {
		if (_.isEmpty(attrs))
			return [];
		return _.filter(obj, function(value) {
			for (var key in attrs) {
				if (attrs[key] !== value[key])
					return false;
			}
			return true;
		});
	};
	_.max = function(obj, iterator, context) {
		if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
			return Math.max.apply(Math, obj);
		}
		if (!iterator && _.isEmpty(obj))
			return -Infinity;
		var result = {
			computed : -Infinity
		};
		each(obj, function(value, index, list) {
			var computed = iterator ? iterator.call(context, value, index, list) : value;
			computed >= result.computed && ( result = {
				value : value,
				computed : computed
			});
		});
		return result.value;
	};
	_.min = function(obj, iterator, context) {
		if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
			return Math.min.apply(Math, obj);
		}
		if (!iterator && _.isEmpty(obj))
			return Infinity;
		var result = {
			computed : Infinity
		};
		each(obj, function(value, index, list) {
			var computed = iterator ? iterator.call(context, value, index, list) : value;
			computed < result.computed && ( result = {
				value : value,
				computed : computed
			});
		});
		return result.value;
	};
	_.shuffle = function(obj) {
		var rand;
		var index = 0;
		var shuffled = [];
		each(obj, function(value) {
			rand = _.random(index++);
			shuffled[index - 1] = shuffled[rand];
			shuffled[rand] = value;
		});
		return shuffled;
	};
	var lookupIterator = function(value) {
		return _.isFunction(value) ? value : function(obj) {
			return obj[value];
		};
	};
	_.sortBy = function(obj, value, context) {
		var iterator = lookupIterator(value);
		return _.pluck(_.map(obj, function(value, index, list) {
			return {
				value : value,
				index : index,
				criteria : iterator.call(context, value, index, list)
			};
		}).sort(function(left, right) {
			var a = left.criteria;
			var b = right.criteria;
			if (a !== b) {
				if (a > b || a ===
					void 0)
					return 1;
				if (a < b || b ===
					void 0)
					return -1;
			}
			return left.index < right.index ? -1 : 1;
		}), "value");
	};
	var group = function(obj, value, context, behavior) {
		var result = {};
		var iterator = lookupIterator(value);
		each(obj, function(value, index) {
			var key = iterator.call(context, value, index, obj);
			behavior(result, key, value);
		});
		return result;
	};
	_.groupBy = function(obj, value, context) {
		return group(obj, value, context, function(result, key, value) {
			(_.has(result, key) ? result[key] : result[key] = []).push(value);
		});
	};
	_.countBy = function(obj, value, context) {
		return group(obj, value, context, function(result, key, value) {
			if (!_.has(result, key))
				result[key] = 0;
			result[key]++;
		});
	};
	_.sortedIndex = function(array, obj, iterator, context) {
		iterator = iterator == null ? _.identity : lookupIterator(iterator);
		var value = iterator.call(context, obj);
		var low = 0, high = array.length;
		while (low < high) {
			var mid = low + high >>> 1;
			iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
		}
		return low;
	};
	_.toArray = function(obj) {
		if (!obj)
			return [];
		if (obj.length === +obj.length)
			return slice.call(obj);
		return _.values(obj);
	};
	_.size = function(obj) {
		return obj.length === +obj.length ? obj.length : _.keys(obj).length;
	};
	_.first = _.head = _.take = function(array, n, guard) {
		return n != null && !guard ? slice.call(array, 0, n) : array[0];
	};
	_.initial = function(array, n, guard) {
		return slice.call(array, 0, array.length - (n == null || guard ? 1 : n));
	};
	_.last = function(array, n, guard) {
		if (n != null && !guard) {
			return slice.call(array, Math.max(array.length - n, 0));
		} else {
			return array[array.length - 1];
		}
	};
	_.rest = _.tail = _.drop = function(array, n, guard) {
		return slice.call(array, n == null || guard ? 1 : n);
	};
	_.compact = function(array) {
		return _.filter(array, function(value) {
			return !!value;
		});
	};
	var flatten = function(input, shallow, output) {
		each(input, function(value) {
			if (_.isArray(value)) {
				shallow ? push.apply(output, value) : flatten(value, shallow, output);
			} else {
				output.push(value);
			}
		});
		return output;
	};
	_.flatten = function(array, shallow) {
		return flatten(array, shallow, []);
	};
	_.without = function(array) {
		return _.difference(array, slice.call(arguments, 1));
	};
	_.uniq = _.unique = function(array, isSorted, iterator, context) {
		var initial = iterator ? _.map(array, iterator, context) : array;
		var results = [];
		var seen = [];
		each(initial, function(value, index) {
			if ( isSorted ? !index || seen[seen.length - 1] !== value : !_.contains(seen, value)) {
				seen.push(value);
				results.push(array[index]);
			}
		});
		return results;
	};
	_.union = function() {
		return _.uniq(concat.apply(ArrayProto, arguments));
	};
	_.intersection = function(array) {
		var rest = slice.call(arguments, 1);
		return _.filter(_.uniq(array), function(item) {
			return _.every(rest, function(other) {
				return _.indexOf(other, item) >= 0;
			});
		});
	};
	_.difference = function(array) {
		var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
		return _.filter(array, function(value) {
			return !_.contains(rest, value);
		});
	};
	_.zip = function() {
		var args = slice.call(arguments);
		var length = _.max(_.pluck(args, "length"));
		var results = new Array(length);
		for (var i = 0; i < length; i++) {
			results[i] = _.pluck(args, "" + i);
		}
		return results;
	};
	_.object = function(list, values) {
		var result = {};
		for (var i = 0, l = list.length; i < l; i++) {
			if (values) {
				result[list[i]] = values[i];
			} else {
				result[list[i][0]] = list[i][1];
			}
		}
		return result;
	};
	_.indexOf = function(array, item, isSorted) {
		if (array == null)
			return -1;
		var i = 0, l = array.length;
		if (isSorted) {
			if ( typeof isSorted == "number") {
				i = isSorted < 0 ? Math.max(0, l + isSorted) : isSorted;
			} else {
				i = _.sortedIndex(array, item);
				return array[i] === item ? i : -1;
			}
		}
		if (nativeIndexOf && array.indexOf === nativeIndexOf)
			return array.indexOf(item, isSorted);
		for (; i < l; i++)
			if (array[i] === item)
				return i;
		return -1;
	};
	_.lastIndexOf = function(array, item, from) {
		if (array == null)
			return -1;
		var hasIndex = from != null;
		if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
			return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
		}
		var i = hasIndex ? from : array.length;
		while (i--)
		if (array[i] === item)
			return i;
		return -1;
	};
	_.range = function(start, stop, step) {
		if (arguments.length <= 1) {
			stop = start || 0;
			start = 0;
		}
		step = arguments[2] || 1;
		var len = Math.max(Math.ceil((stop - start) / step), 0);
		var idx = 0;
		var range = new Array(len);
		while (idx < len) {
			range[idx++] = start;
			start += step;
		}
		return range;
	};
	var ctor = function() {
	};
	_.bind = function bind(func, context) {
		var bound, args;
		if (func.bind === nativeBind && nativeBind)
			return nativeBind.apply(func, slice.call(arguments, 1));
		if (!_.isFunction(func))
			throw new TypeError();
		args = slice.call(arguments, 2);
		return bound = function() {
			if (!(this instanceof bound))
				return func.apply(context, args.concat(slice.call(arguments)));
			ctor.prototype = func.prototype;
			var self = new ctor();
			var result = func.apply(self, args.concat(slice.call(arguments)));
			if (Object(result) === result)
				return result;
			return self;
		};
	};
	_.bindAll = function(obj) {
		var funcs = slice.call(arguments, 1);
		if (funcs.length == 0)
			funcs = _.functions(obj);
		each(funcs, function(f) {
			obj[f] = _.bind(obj[f], obj);
		});
		return obj;
	};
	_.memoize = function(func, hasher) {
		var memo = {};
		hasher || ( hasher = _.identity);
		return function() {
			var key = hasher.apply(this, arguments);
			return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments);
		};
	};
	_.delay = function(func, wait) {
		var args = slice.call(arguments, 2);
		return setTimeout(function() {
			return func.apply(null, args);
		}, wait);
	};
	_.defer = function(func) {
		return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
	};
	_.throttle = function(func, wait) {
		var context, args, timeout, throttling, more, result;
		var whenDone = _.debounce(function() {
			more = throttling = false;
		}, wait);
		return function() {
			context = this;
			args = arguments;
			var later = function() {
				timeout = null;
				if (more) {
					result = func.apply(context, args);
				}
				whenDone();
			};
			if (!timeout)
				timeout = setTimeout(later, wait);
			if (throttling) {
				more = true;
			} else {
				throttling = true;
				result = func.apply(context, args);
			}
			whenDone();
			return result;
		};
	};
	_.debounce = function(func, wait, immediate) {
		var timeout, result;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate)
					result = func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow)
				result = func.apply(context, args);
			return result;
		};
	};
	_.once = function(func) {
		var ran = false, memo;
		return function() {
			if (ran)
				return memo;
			ran = true;
			memo = func.apply(this, arguments);
			func = null;
			return memo;
		};
	};
	_.wrap = function(func, wrapper) {
		return function() {
			var args = [func];
			push.apply(args, arguments);
			return wrapper.apply(this, args);
		};
	};
	_.compose = function() {
		var funcs = arguments;
		return function() {
			var args = arguments;
			for (var i = funcs.length - 1; i >= 0; i--) {
				args = [funcs[i].apply(this, args)];
			}
			return args[0];
		};
	};
	_.after = function(times, func) {
		if (times <= 0)
			return func();
		return function() {
			if (--times < 1) {
				return func.apply(this, arguments);
			}
		};
	};
	_.keys = nativeKeys ||
	function(obj) {
		if (obj !== Object(obj))
			throw new TypeError("Invalid object");
		var keys = [];
		for (var key in obj)
		if (_.has(obj, key))
			keys[keys.length] = key;
		return keys;
	};
	_.values = function(obj) {
		var values = [];
		for (var key in obj)
		if (_.has(obj, key))
			values.push(obj[key]);
		return values;
	};
	_.pairs = function(obj) {
		var pairs = [];
		for (var key in obj)
		if (_.has(obj, key))
			pairs.push([key, obj[key]]);
		return pairs;
	};
	_.invert = function(obj) {
		var result = {};
		for (var key in obj)
		if (_.has(obj, key))
			result[obj[key]] = key;
		return result;
	};
	_.functions = _.methods = function(obj) {
		var names = [];
		for (var key in obj) {
			if (_.isFunction(obj[key]))
				names.push(key);
		}
		return names.sort();
	};
	_.extend = function(obj) {
		each(slice.call(arguments, 1), function(source) {
			for (var prop in source) {
				obj[prop] = source[prop];
			}
		});
		return obj;
	};
	_.pick = function(obj) {
		var copy = {};
		var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
		each(keys, function(key) {
			if ( key in obj)
				copy[key] = obj[key];
		});
		return copy;
	};
	_.omit = function(obj) {
		var copy = {};
		var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
		for (var key in obj) {
			if (!_.contains(keys, key))
				copy[key] = obj[key];
		}
		return copy;
	};
	_.defaults = function(obj) {
		each(slice.call(arguments, 1), function(source) {
			for (var prop in source) {
				if (obj[prop] == null)
					obj[prop] = source[prop];
			}
		});
		return obj;
	};
	_.clone = function(obj) {
		if (!_.isObject(obj))
			return obj;
		return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	};
	_.tap = function(obj, interceptor) {
		interceptor(obj);
		return obj;
	};
	var eq = function(a, b, aStack, bStack) {
		if (a === b)
			return a !== 0 || 1 / a == 1 / b;
		if (a == null || b == null)
			return a === b;
		if ( a instanceof _)
			a = a._wrapped;
		if ( b instanceof _)
			b = b._wrapped;
		var className = toString.call(a);
		if (className != toString.call(b))
			return false;
		switch (className) {
			case "[object String]":
				return a == String(b);

			case "[object Number]":
				return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;

			case "[object Date]":
			case "[object Boolean]":
				return +a == +b;

			case "[object RegExp]":
				return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
		}
		if ( typeof a != "object" || typeof b != "object")
			return false;
		var length = aStack.length;
		while (length--) {
			if (aStack[length] == a)
				return bStack[length] == b;
		}
		aStack.push(a);
		bStack.push(b);
		var size = 0, result = true;
		if (className == "[object Array]") {
			size = a.length;
			result = size == b.length;
			if (result) {
				while (size--) {
					if (!( result = eq(a[size], b[size], aStack, bStack)))
						break;
				}
			}
		} else {
			var aCtor = a.constructor, bCtor = b.constructor;
			if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) {
				return false;
			}
			for (var key in a) {
				if (_.has(a, key)) {
					size++;
					if (!( result = _.has(b, key) && eq(a[key], b[key], aStack, bStack)))
						break;
				}
			}
			if (result) {
				for (key in b) {
					if (_.has(b, key) && !size--)
						break;
				}
				result = !size;
			}
		}
		aStack.pop();
		bStack.pop();
		return result;
	};
	_.isEqual = function(a, b) {
		return eq(a, b, [], []);
	};
	_.isEmpty = function(obj) {
		if (obj == null)
			return true;
		if (_.isArray(obj) || _.isString(obj))
			return obj.length === 0;
		for (var key in obj)
		if (_.has(obj, key))
			return false;
		return true;
	};
	_.isElement = function(obj) {
		return !!(obj && obj.nodeType === 1);
	};
	_.isArray = nativeIsArray ||
	function(obj) {
		return toString.call(obj) == "[object Array]";
	};
	_.isObject = function(obj) {
		return obj === Object(obj);
	};
	each(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(name) {
		_["is" + name] = function(obj) {
			return toString.call(obj) == "[object " + name + "]";
		};
	});
	if (!_.isArguments(arguments)) {
		_.isArguments = function(obj) {
			return !!(obj && _.has(obj, "callee"));
		};
	}
	if ( typeof /./ !== "function") {
		_.isFunction = function(obj) {
			return typeof obj === "function";
		};
	}
	_.isFinite = function(obj) {
		return _.isNumber(obj) && isFinite(obj);
	};
	_.isNaN = function(obj) {
		return _.isNumber(obj) && obj != +obj;
	};
	_.isBoolean = function(obj) {
		return obj === true || obj === false || toString.call(obj) == "[object Boolean]";
	};
	_.isNull = function(obj) {
		return obj === null;
	};
	_.isUndefined = function(obj) {
		return obj ===
		void 0;
	};
	_.has = function(obj, key) {
		return hasOwnProperty.call(obj, key);
	};
	_.noConflict = function() {
		root._ = previousUnderscore;
		return this;
	};
	_.identity = function(value) {
		return value;
	};
	_.times = function(n, iterator, context) {
		for (var i = 0; i < n; i++)
			iterator.call(context, i);
	};
	_.random = function(min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}
		return min + (0 | Math.random() * (max - min + 1));
	};
	var entityMap = {
		escape : {
			"&" : "&amp;",
			"<" : "&lt;",
			">" : "&gt;",
			'"' : "&quot;",
			"'" : "&#x27;",
			"/" : "&#x2F;"
		}
	};
	entityMap.unescape = _.invert(entityMap.escape);
	var entityRegexes = {
		escape : new RegExp("[" + _.keys(entityMap.escape).join("") + "]", "g"),
		unescape : new RegExp("(" + _.keys(entityMap.unescape).join("|") + ")", "g")
	};
	_.each(["escape", "unescape"], function(method) {
		_[method] = function(string) {
			if (string == null)
				return "";
			return ("" + string).replace(entityRegexes[method], function(match) {
				return entityMap[method][match];
			});
		};
	});
	_.result = function(object, property) {
		if (object == null)
			return null;
		var value = object[property];
		return _.isFunction(value) ? value.call(object) : value;
	};
	_.mixin = function(obj) {
		each(_.functions(obj), function(name) {
			var func = _[name] = obj[name];
			_.prototype[name] = function() {
				var args = [this._wrapped];
				push.apply(args, arguments);
				return result.call(this, func.apply(_, args));
			};
		});
	};
	var idCounter = 0;
	_.uniqueId = function(prefix) {
		var id = idCounter++;
		return prefix ? prefix + id : id;
	};
	_.templateSettings = {
		evaluate : /<%([\s\S]+?)%>/g,
		interpolate : /<%=([\s\S]+?)%>/g,
		escape : /<%-([\s\S]+?)%>/g
	};
	var noMatch = /(.)^/;
	var escapes = {
		"'" : "'",
		"\\" : "\\",
		"\r" : "r",
		"\n" : "n",
		"	" : "t",
		"\u2028" : "u2028",
		"\u2029" : "u2029"
	};
	var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
	_.template = function(text, data, settings) {
		settings = _.defaults({}, settings, _.templateSettings);
		var matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join("|") + "|$", "g");
		var index = 0;
		var source = "__p+='";
		text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
			source += text.slice(index, offset).replace(escaper, function(match) {
				return "\\" + escapes[match];
			});
			source += escape ? "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'" : interpolate ? "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'" : evaluate ? "';\n" + evaluate + "\n__p+='" : "";
			index = offset + match.length;
		});
		source += "';\n";
		if (!settings.variable)
			source = "with(obj||{}){\n" + source + "}\n";
		source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
		try {
			var render = new Function(settings.variable || "obj", "_", source);
		} catch (e) {
			e.source = source;
			throw e;
		}
		if (data)
			return render(data, _);
		var template = function(data) {
			return render.call(this, data, _);
		};
		template.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}";
		return template;
	};
	_.chain = function(obj) {
		return _(obj).chain();
	};
	var result = function(obj) {
		return this._chain ? _(obj).chain() : obj;
	};
	_.mixin(_);
	each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(name) {
		var method = ArrayProto[name];
		_.prototype[name] = function() {
			var obj = this._wrapped;
			method.apply(obj, arguments);
			if ((name == "shift" || name == "splice") && obj.length === 0)
				delete obj[0];
			return result.call(this, obj);
		};
	});
	each(["concat", "join", "slice"], function(name) {
		var method = ArrayProto[name];
		_.prototype[name] = function() {
			return result.call(this, method.apply(this._wrapped, arguments));
		};
	});
	_.extend(_.prototype, {
		chain : function() {
			this._chain = true;
			return this;
		},
		value : function() {
			return this._wrapped;
		}
	});
}).call(this);

(function() {
	var CPGlobal, Color, Colorpicker, positionForEvent, size;
	size = 200;
	positionForEvent = function(e) {
		if ( typeof e.pageX === "undefined") {
			if ( typeof e.originalEvent === "undefined") {
				return null;
			}
			return e.originalEvent.changedTouches[0];
		} else {
			return e;
		}
	};
	Color = function() {
		function Color(val) {
			this.value = {
				h : 1,
				s : 1,
				b : 1,
				a : 1
			};
			this.setColor(val);
		}


		Color.prototype.setColor = function(val) {
			var that;
			val = val.toLowerCase();
			that = this;
			return $.each(CPGlobal.stringParsers, function(i, parser) {
				var match, space, values;
				match = parser.re.exec(val);
				values = match && parser.parse(match);
				space = parser.space || "rgba";
				if (values) {
					if (space === "hsla") {
						that.value = CPGlobal.RGBtoHSB.apply(null, CPGlobal.HSLtoRGB.apply(null, values));
					} else {
						that.value = CPGlobal.RGBtoHSB.apply(null, values);
					}
					return false;
				}
			});
		};
		Color.prototype.setHue = function(h) {
			return this.value.h = 1 - h;
		};
		Color.prototype.setSaturation = function(s) {
			return this.value.s = s;
		};
		Color.prototype.setLightness = function(b) {
			return this.value.b = 1 - b;
		};
		Color.prototype.setAlpha = function(a) {
			return this.value.a = parseInt((1 - a) * 100, 10) / 100;
		};
		Color.prototype.toRGB = function(h, s, b, a) {
			var B, C, G, R, X;
			if (!h) {
				h = this.value.h;
				s = this.value.s;
				b = this.value.b;
			}
			h *= 360;
			R =
			void 0;
			G =
			void 0;
			B =
			void 0;
			X =
			void 0;
			C =
			void 0;
			h = h % 360 / 60;
			C = b * s;
			X = C * (1 - Math.abs(h % 2 - 1));
			R = G = B = b - C;
			h = ~~h;
			R += [ C, X, 0, 0, X, C ][h];
			G += [ X, C, C, X, 0, 0 ][h];
			B += [ 0, 0, X, C, C, X ][h];
			return {
				r : Math.round(R * 255),
				g : Math.round(G * 255),
				b : Math.round(B * 255),
				a : a || this.value.a
			};
		};
		Color.prototype.toHex = function(h, s, b, a) {
			var g, r, rgb;
			rgb = this.toRGB(h, s, b, a);
			r = parseInt(rgb.r, 10) << 16;
			g = parseInt(rgb.g, 10) << 8;
			b = parseInt(rgb.b, 10);
			return "#" + (1 << 24 | r | g | b).toString(16).substr(1);
		};
		Color.prototype.toHSL = function(h, s, b, a) {
			var H, L, S;
			if (!h) {
				h = this.value.h;
				s = this.value.s;
				b = this.value.b;
			}
			H = h;
			L = (2 - s) * b;
			S = s * b;
			if (L > 0 && L <= 1) {
				S /= L;
			} else {
				S /= 2 - L;
			}
			L /= 2;
			if (S > 1) {
				S = 1;
			}
			return {
				h : H,
				s : S,
				l : L,
				a : a || this.value.a
			};
		};
		return Color;
	}();
	Colorpicker = function() {
		function Colorpicker(element, options) {
			var format;
			this.element = $(element);
			format = options.format || this.element.data("color-format") || "hex";
			this.format = CPGlobal.translateFormats[format];
			this.isInput = this.element.is("input");
			this.component = this.element.is(".color") ? this.element.find(".add-on") : false;
			this.picker = $(CPGlobal.template).appendTo("body");
			this.picker.on("mousedown", $.proxy(this.mousedown, this));
			this.picker.on("touchstart", $.proxy(this.mousedown, this));
			if (this.isInput) {
				this.element.on({
					focus : $.proxy(this.show, this),
					keyup : $.proxy(this.update, this)
				});
			}
			if (format === "rgba" || format === "hsla") {
				this.picker.addClass("alpha");
				this.alpha = this.picker.find(".colorpicker-alpha")[0].style;
			}
			if (this.component) {
				this.picker.find(".colorpicker-color").hide();
				this.preview = this.element.find("i")[0].style;
			} else {
				this.preview = this.picker.find("div:last")[0].style;
			}
			this.base = this.picker.find("div:first")[0].style;
			this.update();
		}


		Colorpicker.prototype.show = function(e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			this.place();
			$(window).on("resize", $.proxy(this.place, this));
			if (!this.isInput) {
				if (e) {
					e.stopPropagation();
					e.preventDefault();
				}
			}
			return this.element.trigger({
				type : "show",
				color : this.color
			});
		};
		Colorpicker.prototype.update = function() {
			this.color = new Color(this.isInput ? this.element.prop("value") : this.element.data("color"));
			this.picker.find("i").eq(0).css({
				left : this.color.value.s * size,
				top : size - this.color.value.b * size
			}).end().eq(1).css("top", size * (1 - this.color.value.h)).end().eq(2).css("top", size * (1 - this.color.value.a));
			return this.previewColor();
		};
		Colorpicker.prototype.setValue = function(newColor) {
			this.color = new Color(newColor);
			this.picker.find("i").eq(0).css({
				left : this.color.value.s * size,
				top : size - this.color.value.b * size
			}).end().eq(1).css("top", size * (1 - this.color.value.h)).end().eq(2).css("top", size * (1 - this.color.value.a));
			this.previewColor();
			return this.element.trigger({
				type : "changeColor",
				color : this.color
			});
		};
		Colorpicker.prototype.hide = function() {
			this.picker.hide();
			$(window).off("resize", this.place);
			if (!this.isInput) {
				if (this.component) {
					this.element.find("input").prop("value", this.format.call(this));
				}
				this.element.data("color", this.format.call(this));
			} else {
				this.element.prop("value", this.format.call(this));
			}
			return this.element.trigger({
				type : "hide",
				color : this.color
			});
		};
		Colorpicker.prototype.place = function() {
			var offset, thing;
			thing = this.component ? this.component : this.element;
			offset = thing.offset();
			return this.picker.css({
				top : offset.top - (thing.height() + this.picker.height()),
				left : offset.left
			});
		};
		Colorpicker.prototype.previewColor = function() {
			try {
				//this.preview.backgroundColor = this.format.call(this);
			} catch (e) {
				//this.preview.backgroundColor = this.color.toHex();
			}
			//this.base.backgroundColor = this.color.toHex(this.color.value.h, 1, 1, 1);
			if (this.alpha) {
				//return this.alpha.backgroundColor = this.color.toHex();
			}
		};
		Colorpicker.prototype.pointer = null;
		Colorpicker.prototype.slider = null;
		Colorpicker.prototype.mousedown = function(e) {
			var offset, p, target, zone;
			e.stopPropagation();
			e.preventDefault();
			target = $(e.target);
			zone = target.closest("div");
			if (!zone.is(".colorpicker")) {
				if (zone.is(".colorpicker-saturation")) {
					this.slider = $.extend({}, CPGlobal.sliders.saturation);
				} else if (zone.is(".colorpicker-hue")) {
					this.slider = $.extend({}, CPGlobal.sliders.hue);
				} else if (zone.is(".colorpicker-alpha")) {
					this.slider = $.extend({}, CPGlobal.sliders.alpha);
				} else {
					return false;
				}
				offset = zone.offset();
				p = positionForEvent(e);
				this.slider.knob = zone.find("i")[0].style;
				this.slider.left = p.pageX - offset.left;
				this.slider.top = p.pageY - offset.top;
				this.pointer = {
					left : p.pageX,
					top : p.pageY
				};
				$(this.picker).on({
					mousemove : $.proxy(this.mousemove, this),
					mouseup : $.proxy(this.mouseup, this),
					touchmove : $.proxy(this.mousemove, this),
					touchend : $.proxy(this.mouseup, this),
					touchcancel : $.proxy(this.mouseup, this)
				}).trigger("mousemove");
			}
			return false;
		};
		Colorpicker.prototype.mousemove = function(e) {
			var left, p, top, x, y;
			e.stopPropagation();
			e.preventDefault();
			p = positionForEvent(e);
			x = p ? p.pageX : this.pointer.left;
			y = p ? p.pageY : this.pointer.top;
			left = Math.max(0, Math.min(this.slider.maxLeft, this.slider.left + (x - this.pointer.left)));
			top = Math.max(0, Math.min(this.slider.maxTop, this.slider.top + (y - this.pointer.top)));
			this.slider.knob.left = left + "px";
			this.slider.knob.top = top + "px";
			if (this.slider.callLeft) {
				this.color[this.slider.callLeft].call(this.color, left / size);
			}
			if (this.slider.callTop) {
				this.color[this.slider.callTop].call(this.color, top / size);
			}
			this.previewColor();
			this.element.trigger({
				type : "changeColor",
				color : this.color
			});
			return false;
		};
		Colorpicker.prototype.mouseup = function(e) {
			e.stopPropagation();
			e.preventDefault();
			$(this.picker).off({
				mousemove : this.mousemove,
				mouseup : this.mouseup
			});
			return false;
		};
		return Colorpicker;
	}();
	$.fn.colorpicker = function(option) {
		return this.each(function() {
			var $this, data, options;
			$this = $(this);
			data = $this.data("colorpicker");
			options = typeof option === "object" && option;
			if (!data) {
				$this.data("colorpicker", data = new Colorpicker(this, $.extend({}, $.fn.colorpicker.defaults, options)));
			}
			if ( typeof option === "string") {
				return data[option]();
			}
		});
	};
	$.fn.colorpicker.defaults = {};
	$.fn.colorpicker.Constructor = Colorpicker;
	CPGlobal = {
		translateFormats : {
			rgb : function() {
				var rgb;
				rgb = this.color.toRGB();
				return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
			},
			rgba : function() {
				var rgb;
				rgb = this.color.toRGB();
				return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ")";
			},
			hsl : function() {
				var hsl;
				hsl = this.color.toHSL();
				return "hsl(" + Math.round(hsl.h * 360) + "," + Math.round(hsl.s * 100) + "%," + Math.round(hsl.l * 100) + "%)";
			},
			hsla : function() {
				var hsl;
				hsl = this.color.toHSL();
				return "hsla(" + Math.round(hsl.h * 360) + "," + Math.round(hsl.s * 100) + "%," + Math.round(hsl.l * 100) + "%," + hsl.a + ")";
			},
			hex : function() {
				return this.color.toHex();
			}
		},
		sliders : {
			saturation : {
				maxLeft : size,
				maxTop : size,
				callLeft : "setSaturation",
				callTop : "setLightness"
			},
			hue : {
				maxLeft : 0,
				maxTop : size,
				callLeft : false,
				callTop : "setHue"
			},
			alpha : {
				maxLeft : 0,
				maxTop : size,
				callLeft : false,
				callTop : "setAlpha"
			}
		},
		RGBtoHSB : function(r, g, b, a) {
			var C, H, S, V;
			r /= 255;
			g /= 255;
			b /= 255;
			H =
			void 0;
			S =
			void 0;
			V =
			void 0;
			C =
			void 0;
			V = Math.max(r, g, b);
			C = V - Math.min(r, g, b);
			H = C === 0 ? null : V === r ? (g - b) / C : V === g ? (b - r) / C + 2 : (r - g) / C + 4;
			H = (H + 360) % 6 * 60 / 360;
			S = C === 0 ? 0 : C / V;
			return {
				h : H || 1,
				s : S,
				b : V,
				a : a || 1
			};
		},
		HueToRGB : function(p, q, h) {
			if (h < 0) {
				h += 1;
			} else {
				if (h > 1) {
					h -= 1;
				}
			}
			if (h * 6 < 1) {
				return p + (q - p) * h * 6;
			} else if (h * 2 < 1) {
				return q;
			} else if (h * 3 < 2) {
				return p + (q - p) * (2 / 3 - h) * 6;
			} else {
				return p;
			}
		},
		HSLtoRGB : function(h, s, l, a) {
			var b, g, p, q, r, tb, tg, tr;
			if (s < 0) {
				s = 0;
			}
			q =
			void 0;
			if (l <= .5) {
				q = l * (1 + s);
			} else {
				q = l + s - l * s;
			}
			p = 2 * l - q;
			tr = h + 1 / 3;
			tg = h;
			tb = h - 1 / 3;
			r = Math.round(CPGlobal.HueToRGB(p, q, tr) * 255);
			g = Math.round(CPGlobal.HueToRGB(p, q, tg) * 255);
			b = Math.round(CPGlobal.HueToRGB(p, q, tb) * 255);
			return [r, g, b, a || 1];
		},
		stringParsers : [{
			re : /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			parse : function(execResult) {
				return [execResult[1], execResult[2], execResult[3], execResult[4]];
			}
		}, {
			re : /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			parse : function(execResult) {
				return [2.55 * execResult[1], 2.55 * execResult[2], 2.55 * execResult[3], execResult[4]];
			}
		}, {
			re : /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
			parse : function(execResult) {
				return [parseInt(execResult[1], 16), parseInt(execResult[2], 16), parseInt(execResult[3], 16)];
			}
		}, {
			re : /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
			parse : function(execResult) {
				return [parseInt(execResult[1] + execResult[1], 16), parseInt(execResult[2] + execResult[2], 16), parseInt(execResult[3] + execResult[3], 16)];
			}
		}, {
			re : /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			space : "hsla",
			parse : function(execResult) {
				return [execResult[1] / 360, execResult[2] / 100, execResult[3] / 100, execResult[4]];
			}
		}],
		template : '<div class="colorpicker">' + '<div class="colorpicker-saturation"><i><b></b></i></div>' + '<div class="colorpicker-hue"><i></i></div>' + '<div class="colorpicker-alpha"><i></i></div>' + '<div class="colorpicker-color"><div /></div>' + "</div>"
	};
}).call(this);

(function() {
	var _ref;
	window.LC = ( _ref = window.LC) != null ? _ref : {};
	LC.LiterallyCanvas = function() {
		function LiterallyCanvas(canvas, opts) {
			this.canvas = canvas;
			this.opts = opts;
			this.$canvas = $(this.canvas);
			//console.log($(this.canvas))
			//this.backgroundColor = this.opts.backgroundColor || "rgb(230, 230, 230)";
			this.buffer = $("<canvas>").get(0);
			this.ctx = this.canvas.getContext("2d");
			this.bufferCtx = this.buffer.getContext("2d");
			//$(this.canvas).css("background-color", this.backgroundColor);
			this.shapes = [];
			this.undoStack = [];
			this.redoStack = [];
			this.isDragging = false;
			this.position = {
				x : 0,
				y : 0
			};
			this.scale = 1;
			this.tool =
			void 0;
			this.primaryColor = "#000";
			this.secondaryColor = "#fff";
			this.repaint();
		}


		LiterallyCanvas.prototype.trigger = function(name, data) {
			return this.canvas.dispatchEvent(new CustomEvent(name, {
				detail : data
			}));
		};
		LiterallyCanvas.prototype.on = function(name, fn) {
			return this.canvas.addEventListener(name, function(e) {
				return fn(e.detail);
			});
		};
		LiterallyCanvas.prototype.clientCoordsToDrawingCoords = function(x, y) {
			return {
				x : (x - this.position.x) / this.scale,
				y : (y - this.position.y) / this.scale
			};
		};
		LiterallyCanvas.prototype.drawingCoordsToClientCoords = function(x, y) {
			return {
				x : x * this.scale + this.position.x,
				y : y * this.scale + this.position.y
			};
		};
		LiterallyCanvas.prototype.begin = function(x, y) {
			var newPos;
			newPos = this.clientCoordsToDrawingCoords(x, y);
			this.tool.begin(newPos.x, newPos.y, this);
			return this.isDragging = true;
		};
		LiterallyCanvas.prototype["continue"] = function(x, y) {
			var newPos;
			newPos = this.clientCoordsToDrawingCoords(x, y);
			if (this.isDragging) {
				return this.tool["continue"](newPos.x, newPos.y, this);
			}
		};
		LiterallyCanvas.prototype.end = function(x, y) {
			var newPos;
			newPos = this.clientCoordsToDrawingCoords(x, y);
			if (this.isDragging) {
				this.tool.end(newPos.x, newPos.y, this);
			}
			return this.isDragging = false;
		};
		LiterallyCanvas.prototype.saveShape = function(shape) {
			return this.execute(new LC.AddShapeAction(this, shape));
		};
		LiterallyCanvas.prototype.pan = function(x, y) {
			this.position.x = this.position.x - x;
			return this.position.y = this.position.y - y;
		};
		LiterallyCanvas.prototype.zoom = function(factor) {
			var oldScale;
			oldScale = this.scale;
			this.scale = this.scale + factor;
			this.scale = Math.max(this.scale, .2);
			this.scale = Math.min(this.scale, 4);
			this.scale = Math.round(this.scale * 100) / 100;
			this.position.x = LC.scalePositionScalar(this.position.x, this.canvas.width, oldScale, this.scale);
			this.position.y = LC.scalePositionScalar(this.position.y, this.canvas.height, oldScale, this.scale);
			return this.repaint();
		};
		LiterallyCanvas.prototype.repaint = function(dirty, drawBackground) {
			if (dirty == null) {
				dirty = true;
			}
			if (drawBackground == null) {
				drawBackground = false;
			}
			if (dirty) {
				this.buffer.width = this.canvas.width;
				this.buffer.height = this.canvas.height;
				this.bufferCtx.clearRect(0, 0, this.buffer.width, this.buffer.height);
				if (drawBackground) {
					this.bufferCtx.fillStyle = this.backgroundColor;
					this.bufferCtx.fillRect(0, 0, this.buffer.width, this.buffer.height);
				}
				this.draw(this.shapes, this.bufferCtx);
			}
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			if (this.canvas.width > 0 && this.canvas.height > 0) {
				return this.ctx.drawImage(this.buffer, 0, 0);
			}
		};
		LiterallyCanvas.prototype.update = function(shape) {
			var _this = this;
			this.repaint(false);
			return this.transformed(function() {
				return shape.update(_this.ctx);
			}, this.ctx);
		};
		LiterallyCanvas.prototype.draw = function(shapes, ctx) {
			return this.transformed(function() {
				var _this = this;
				return _.each(shapes, function(s) {
					return s.draw(ctx);
				});
			}, ctx);
		};
		LiterallyCanvas.prototype.transformed = function(fn, ctx) {
			ctx.save();
			ctx.translate(this.position.x, this.position.y);
			ctx.scale(this.scale, this.scale);
			fn();
			return ctx.restore();
		};
		LiterallyCanvas.prototype.clear = function() {
			this.execute(new LC.ClearAction(this));
			this.shapes = [];
			return this.repaint();
		};
		LiterallyCanvas.prototype.execute = function(action) {
			this.undoStack.push(action);
			action["do"]();
			return this.redoStack = [];
		};
		LiterallyCanvas.prototype.undo = function() {
			var action;
			if (!this.undoStack.length) {
				return;
			}
			action = this.undoStack.pop();
			action.undo();
			return this.redoStack.push(action);
		};
		LiterallyCanvas.prototype.redo = function() {
			var action;
			if (!this.redoStack.length) {
				return;
			}
			action = this.redoStack.pop();
			this.undoStack.push(action);
			return action["do"]();
		};
		LiterallyCanvas.prototype.getPixel = function(x, y) {
			var p, pixel;
			p = this.drawingCoordsToClientCoords(x, y);
			pixel = this.ctx.getImageData(p.x, p.y, 1, 1).data;
			if (pixel[3]) {
				return "rgb(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + ")";
			} else {
				return null;
			}
		};
		LiterallyCanvas.prototype.canvasForExport = function() {
			this.repaint(true, true);
			return this.canvas;
		};
		return LiterallyCanvas;
	}();
	LC.ClearAction = function() {
		function ClearAction(lc) {
			this.lc = lc;
			this.oldShapes = this.lc.shapes;
		}

		ClearAction.prototype["do"] = function() {
			this.lc.shapes = [];
			return this.lc.repaint();
		};
		ClearAction.prototype.undo = function() {
			this.lc.shapes = this.oldShapes;
			return this.lc.repaint();
		};
		return ClearAction;
	}();
	LC.AddShapeAction = function() {
		function AddShapeAction(lc, shape) {
			this.lc = lc;
			this.shape = shape;
		}

		AddShapeAction.prototype["do"] = function() {
			this.ix = this.lc.shapes.length;
			this.lc.shapes.push(this.shape);
			return this.lc.repaint();
		};
		AddShapeAction.prototype.undo = function() {
			this.lc.shapes.pop(this.ix);
			return this.lc.repaint();
		};
		return AddShapeAction;
	}();
}).call(this);

(function() {
	var buttonIsDown, coordsForTouchEvent, initLiterallyCanvas, position, _ref;
	window.LC = ( _ref = window.LC) != null ? _ref : {};
	coordsForTouchEvent = function($el, e) {
		var p, t;
		t = e.originalEvent.changedTouches[0];
		p = $el.offset();
		return [t.clientX - p.left, t.clientY - p.top];
	};
	position = function(e) {
		var p;
		if (e.offsetX != null) {
			return {
				left : e.offsetX,
				top : e.offsetY
			};
		} else {
			p = $(e.target).offset();
			return {
				left : e.pageX - p.left,
				top : e.pageY - p.top
			};
		}
	};
	buttonIsDown = function(e) {
		if (e.buttons != null) {
			return e.buttons === 1;
		} else {
			return e.which > 0;
		}
	};
	initLiterallyCanvas = function(el, opts) {
		var $c, $el, $tbEl, lc, resize, tb, _this = this;
		if (opts == null) {
			opts = {};
		}
		opts = _.extend({
			//backgroundColor: "rgb(230, 230, 230)",
			//imageURLPrefix: "lib/img",
			keyboardShortcuts : true,
			sizeToContainer : true,
			toolClasses : [LC.Pencil, LC.RectangleTool, LC.Eraser, LC.Pan, LC.EyeDropper]
		}, opts);
		$el = $(el);
		$el.addClass("literally");
		$tbEl = $('<div class="toolbar">');
		$el.append($tbEl);
		$c = $el.find("canvas").eq(0);
		lc = new LC.LiterallyCanvas($c.get(0), opts);
		tb = new LC.Toolbar(lc, $tbEl, opts);
		tb.selectTool(tb.tools[0]);
		resize = function() {
			if (opts.sizeToContainer) {
				$c.css("height", "" + ($el.height() - $tbEl.height()) + "px");
			}
			$c.attr("width", $c.width());
			$c.attr("height", $c.height());
			return lc.repaint();
		};
		$el.resize(resize);
		$(window).resize(resize);
		resize();
		$c.mousedown(function(e) {
			var down, p;
			down = true;
			e.originalEvent.preventDefault();
			document.onselectstart = function() {
				return false;
			};
			p = position(e);
			return lc.begin(p.left, p.top);
		});
		$c.mousemove(function(e) {
			var p;
			e.originalEvent.preventDefault();
			p = position(e);
			return lc["continue"](p.left, p.top);
		});
		$c.mouseup(function(e) {
			var p;
			e.originalEvent.preventDefault();
			document.onselectstart = function() {
				return true;
			};
			p = position(e);
			return lc.end(p.left, p.top);
		});
		$c.mouseenter(function(e) {
			var p;
			p = position(e);
			if (buttonIsDown(e)) {
				return lc.begin(p.left, p.top);
			}
		});
		$c.mouseout(function(e) {
			var p;
			p = position(e);
			return lc.end(p.left, p.top);
		});
		$c.bind("touchstart", function(e) {
			e.preventDefault();
			if (e.originalEvent.touches.length === 1) {
				return lc.begin.apply(lc, coordsForTouchEvent($c, e));
			} else {
				return lc["continue"].apply(lc, coordsForTouchEvent($c, e));
			}
		});
		$c.bind("touchmove", function(e) {
			e.preventDefault();
			return lc["continue"].apply(lc, coordsForTouchEvent($c, e));
		});
		$c.bind("touchend", function(e) {
			e.preventDefault();
			if (e.originalEvent.touches.length !== 0) {
				return;
			}
			return lc.end.apply(lc, coordsForTouchEvent($c, e));
		});
		$c.bind("touchcancel", function(e) {
			e.preventDefault();
			if (e.originalEvent.touches.length !== 0) {
				return;
			}
			return lc.end.apply(lc, coordsForTouchEvent($c, e));
		});
		if (opts.keyboardShortcuts) {
			$(document).keydown(function(e) {
				switch (e.which) {
					case 37:
						lc.pan(-10, 0);
						break;

					case 38:
						lc.pan(0, -10);
						break;

					case 39:
						lc.pan(10, 0);
						break;

					case 40:
						lc.pan(0, 10);
				}
				return lc.repaint();
			});
		}
		return [lc, tb];
	};
	$.fn.literallycanvas = function(opts) {
		var _this = this;
		if (opts == null) {
			opts = {};
		}
		this.each(function(ix, el) {
			var val;
			val = initLiterallyCanvas(el, opts);
			el.literallycanvas = val[0];
			return el.literallycanvasToolbar = val[1];
		});
		return this;
	};
	$.fn.canvasForExport = function() {
		return this.get(0).literallycanvas.canvasForExport();
	};
}).call(this);

(function() {
	var dual, mid, normals, refine, slope, unit, _ref;
	window.LC = ( _ref = window.LC) != null ? _ref : {};
	LC.bspline = function(points, order) {
		if (!order) {
			return points;
		}
		return LC.bspline(dual(dual(refine(points))), order - 1);
	};
	refine = function(points) {
		var refined;
		points = [_.first(points)].concat(points).concat(_.last(points));
		refined = [];
		_.each(points, function(point, index, points) {
			refined[index * 2] = point;
			if (points[index + 1]) {
				return refined[index * 2 + 1] = mid(point, points[index + 1]);
			}
		});
		return refined;
	};
	dual = function(points) {
		var dualed;
		dualed = [];
		_.each(points, function(point, index, points) {
			if (points[index + 1]) {
				return dualed[index] = mid(point, points[index + 1]);
			}
		});
		return dualed;
	};
	mid = function(a, b) {
		return new LC.Point(a.x + (b.x - a.x) / 2, a.y + (b.y - a.y) / 2, a.size + (b.size - a.size) / 2, a.color);
	};
	LC.toPoly = function(line) {
		var polyLeft, polyRight, _this = this;
		polyLeft = [];
		polyRight = [];
		_.each(line, function(point, index) {
			var n;
			n = normals(point, slope(line, index));
			polyLeft = polyLeft.concat([n[0]]);
			return polyRight = [n[1]].concat(polyRight);
		});
		return polyLeft.concat(polyRight);
	};
	slope = function(line, index) {
		var point;
		if (line.length < 3) {
			point = {
				x : 0,
				y : 0
			};
		}
		if (index === 0) {
			point = slope(line, index + 1);
		} else if (index === line.length - 1) {
			point = slope(line, index - 1);
		} else {
			point = LC.diff(line[index - 1], line[index + 1]);
		}
		return point;
	};
	LC.diff = function(a, b) {
		return {
			x : b.x - a.x,
			y : b.y - a.y
		};
	};
	unit = function(vector) {
		var length;
		length = LC.len(vector);
		return {
			x : vector.x / length,
			y : vector.y / length
		};
	};
	normals = function(p, slope) {
		slope = unit(slope);
		slope.x = slope.x * p.size / 2;
		slope.y = slope.y * p.size / 2;
		return [{
			x : p.x - slope.y,
			y : p.y + slope.x,
			color : p.color
		}, {
			x : p.x + slope.y,
			y : p.y - slope.x,
			color : p.color
		}];
	};
	LC.len = function(vector) {
		return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
	};
	LC.scalePositionScalar = function(val, viewportSize, oldScale, newScale) {
		var newSize, oldSize;
		oldSize = viewportSize * oldScale;
		newSize = viewportSize * newScale;
		return val + (oldSize - newSize) / 2;
	};
}).call(this);

(function() {
	var __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) {
			if (__hasProp.call(parent, key))
				child[key] = parent[key];
		}
		function ctor() {
			this.constructor = child;
		}


		ctor.prototype = parent.prototype;
		child.prototype = new ctor();
		child.__super__ = parent.prototype;
		return child;
	};
	LC.Shape = function() {
		function Shape() {
		}


		Shape.prototype.draw = function(ctx) {
		};
		Shape.prototype.update = function(ctx) {
			return this.draw(ctx);
		};
		return Shape;
	}();
	LC.Rectangle = function(_super) {
		__extends(Rectangle, _super);
		function Rectangle(x, y, strokeWidth, color) {
			this.x = x;
			this.y = y;
			this.strokeWidth = strokeWidth;
			this.color = color;
			this.width = 0;
			this.height = 0;
		}


		Rectangle.prototype.draw = function(ctx) {
			ctx.lineWidth = this.strokeWidth;
			ctx.strokeStyle = this.color;
			return ctx.strokeRect(this.x, this.y, this.width, this.height);
		};
		return Rectangle;
	}(LC.Shape);

	LC.LinePathShape = function(_super) {
		__extends(LinePathShape, _super);
		function LinePathShape() {
			this.points = [];
			this.order = 3;
			this.segmentSize = Math.pow(2, this.order);
			this.tailSize = 3;
			this.sampleSize = this.tailSize + 1;
		}


		LinePathShape.prototype.addPoint = function(point) {
			this.points.push(point);
			if (!this.smoothedPoints || this.points.length < this.sampleSize) {
				return this.smoothedPoints = LC.bspline(this.points, this.order);
			} else {
				this.tail = _.last(LC.bspline(_.last(this.points, this.sampleSize), this.order), this.segmentSize * this.tailSize);
				return this.smoothedPoints = _.initial(this.smoothedPoints, this.segmentSize * (this.tailSize - 1)).concat(this.tail);
			}
		};
		LinePathShape.prototype.draw = function(ctx, points) {
			if (points == null) {
				points = this.smoothedPoints;
			}
			if (!points.length) {
				return;
			}
			ctx.strokeStyle = points[0].color;
			//ctx.strokeStyle = strokeColor;
			ctx.lineWidth = points[0].size
			//ctx.lineWidth = strWidth;
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(points[0].x, points[0].y);
			_.each(_.rest(points), function(point) {
				return ctx.lineTo(point.x, point.y);
			});
			return ctx.stroke();
		};
		return LinePathShape;
	}(LC.Shape);
	LC.EraseLinePathShape = function(_super) {
		__extends(EraseLinePathShape, _super);
		function EraseLinePathShape() {
			return EraseLinePathShape.__super__.constructor.apply(this, arguments);
		}


		EraseLinePathShape.prototype.draw = function(ctx) {
			ctx.save();
			ctx.globalCompositeOperation = "destination-out";
			EraseLinePathShape.__super__.draw.call(this, ctx);
			return ctx.restore();
		};
		EraseLinePathShape.prototype.update = function(ctx) {
			ctx.save();
			ctx.globalCompositeOperation = "destination-out";
			EraseLinePathShape.__super__.update.call(this, ctx);
			return ctx.restore();
		};
		return EraseLinePathShape;
	}(LC.LinePathShape);
	LC.Point = function() {
		function Point(x, y, size, color) {
			this.x = x;
			this.y = y;
			this.size = size;
			this.color = color;
		}


		Point.prototype.lastPoint = function() {
			return this;
		};
		Point.prototype.draw = function(ctx) {
			return console.log("draw point", this.x, this.y, this.size, this.color);
		};
		return Point;
	}();
}).call(this);

(function() {
	var _ref;
	window.LC = ( _ref = window.LC) != null ? _ref : {};
	LC.defaultColors = ["rgba(255, 0, 0, 0.9)", "rgba(255, 128, 0, 0.9)", "rgba(255, 255, 0, 0.9)", "rgba(128, 255, 0, 0.9)", "rgba(0, 255, 0, 0.9)", "rgba(0, 255, 128, 0.9)", "rgba(0, 128, 255, 0.9)", "rgba(0, 0, 255, 0.9)", "rgba(128, 0, 255, 0.9)", "rgba(255, 0, 128, 0.9)", "rgba(0, 0, 0, 0.9)", "rgba(255, 255, 255, 0.9)"];
	LC.defaultStrokeColor = "rgb(116, 117, 121)";
	LC.defaultFillColor = "rgba(255, 255, 255, 0.9)";
	LC.toolbarHTML = '  <div class="toolbar-row">    <div class="toolbar-row-left">      <div class="button color-square stroke-picker">&nbsp;</div>      <div class="tools button-group"></div>      <div class="tool-options-container"></div>    </div>    <div class="toolbar-row-right">      <div class="action-buttons">        <div class="button clear-button danger">Clear</div>        <div class="button-group">          <div class="button btn-warning undo-button">&larr;</div><div class="button btn-warning redo-button">&rarr;</div>        </div>        <div class="button-group">          <div class="button btn-inverse zoom-out-button">&ndash;</div><div class="button btn-inverse zoom-in-button">+</div>        </div>        <div class="zoom-display">1</div>      </div>    </div>    <div class="clearfix"></div>  </div>';
	LC.makeColorPicker = function($el, title, callback) {
		var cp;
		$el.data("color", "rgb(0, 0, 0)");
		cp = $el.colorpicker({
			format : "rgb"
		}).data("colorpicker");
		cp.hide();
		$el.on("changeColor", function(e) {
			callback(e.color.toRGB());
			return $(document).one("click", function() {
				return cp.hide();
			});
		});
		$el.click(function(e) {
			if (cp.picker.is(":visible")) {
				return cp.hide();
			} else {
				$(document).one("click", function() {
					return $(document).one("click", function() {
						return cp.hide();
					});
				});
				cp.show();
				return cp.place();
			}
		});
		return cp;
	};
	LC.Toolbar = function() {
		function Toolbar(lc, $el, opts) {
			this.lc = lc;
			this.$el = $el;
			this.opts = opts;
			this.$el.append(LC.toolbarHTML);
			this.initColors();
			this.initButtons();
			this.initTools();
			this.initZoom();
		}


		Toolbar.prototype.initColors = function() {
			var $stroke, cp, _this = this;
			$stroke = $('.pen-style');
			$stroke.css("background-color", LC.defaultStrokeColor);
			cp = LC.makeColorPicker($stroke, "Foreground color", function(c) {
				var val;
				val = "rgba(" + c.r + ", " + c.g + ", " + c.b + ", 1)";
				$stroke.css("background-color", val);
				return _this.lc.primaryColor = val;
			});

			var strokeColor = "rgb(116, 117, 121)";
			$('#color input').on('touchend', function() {
				//alert($(this).css('background-color'))
				strokeColor = $(this).css('background-color');
				$('.pen-style').css("background-color", $(this).css('background-color'));
				return _this.lc.primaryColor = $(this).css('background-color');
			})

			this.lc.$canvas.mousedown(function() {
				return cp.hide();
			});
			this.lc.$canvas.on("touchstart", function() {
				return cp.hide();
			});
			return this.lc.on("colorChange", function(color) {
				//return $stroke.css("background-color", color);
			});
		};
		Toolbar.prototype.initButtons = function() {
			var _this = this;
			this.$el.find(".clear-button").click(function(e) {
				return _this.lc.clear();
			});
			this.$el.find(".undo-button").click(function(e) {
				return _this.lc.undo();
			});
			//************zheng
			$('#revocation').on('touchend', function() {
				return _this.lc.undo();
			})

			return this.$el.find(".redo-button").click(function(e) {
				return _this.lc.redo();
			});
		};
		Toolbar.prototype.initTools = function() {
			var ToolClass, _this = this;
			this.tools = function() {
				var _i, _len, _ref1, _results;
				_ref1 = this.opts.toolClasses;
				_results = [];
				for ( _i = 0, _len = _ref1.length; _i < _len; _i++) {
					ToolClass = _ref1[_i];
					_results.push(new ToolClass(this.opts));
				}
				return _results;
			}.call(this);
			return _.each(this.tools, function(t) {
				var buttonEl, optsEl;
				optsEl = $("<div class='tool-options tool-options-" + t.cssSuffix + "'></div>");
				optsEl.html(t.optionsContents());
				optsEl.hide();
				t.$el = optsEl;
				_this.$el.find(".tool-options-container").append(optsEl);
				buttonEl = $("<div class='button tool-" + t.cssSuffix + "'></div>");
				buttonEl.html(t.buttonContents());
				_this.$el.find(".tools").append(buttonEl);
				//              return buttonEl.click(function(e) {
				//                  return _this.selectTool(t);
				//              });

				//				*******************zheng
				$('#rectangle').on('touchend', function(e) {
					var toolclass = t.$el[0].className;
					if (toolclass == 'tool-options tool-options-rectangle') {
						//alert(2)
						return _this.selectTool(t);
					}
					console.log(t.$el[0].className)
					return false;
				})
				$('#eraser').on('touchend', function(e) {
					var toolclass = t.$el[0].className;
					if (toolclass == 'tool-options tool-options-eraser') {
						//alert(3)
						return _this.selectTool(t);
					}
					console.log(t.$el[0].className)
					return false;
				})
				$('#pen').on('touchend', function(e) {
					var toolclass = t.$el[0].className;
					if (toolclass == 'tool-options tool-options-pencil') {
						//alert(1)
						return _this.selectTool(t);
					}
					console.log(t.$el[0].className)
					return false;
				})
			});
		};
		Toolbar.prototype.initZoom = function() {
			var _this = this;
			this.$el.find(".zoom-in-button").click(function(e) {
				_this.lc.zoom(.2);
				return _this.$el.find(".zoom-display").html(_this.lc.scale);
			});
			return this.$el.find(".zoom-out-button").click(function(e) {
				_this.lc.zoom(-.2);
				return _this.$el.find(".zoom-display").html(_this.lc.scale);
			});
		};
		Toolbar.prototype.selectTool = function(t) {
			this.$el.find(".tools .active").removeClass("active");
			this.$el.find(".tools .tool-" + t.cssSuffix).addClass("active");
			this.lc.tool = t;
			this.$el.find(".tool-options").hide();
			if (t.$el) {
				return t.$el.show();
			}
		};
		return Toolbar;
	}();
}).call(this);

(function() {
	var __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) {
			if (__hasProp.call(parent, key))
				child[key] = parent[key];
		}
		function ctor() {
			this.constructor = child;
		}


		ctor.prototype = parent.prototype;
		child.prototype = new ctor();
		child.__super__ = parent.prototype;
		return child;
	};
	LC.Tool = function() {
		function Tool(opts) {
			this.opts = opts;
		}


		Tool.prototype.title =
		void 0;
		Tool.prototype.cssSuffix =
		void 0;
		Tool.prototype.buttonContents = function() {
			return
			void 0;
		};
		Tool.prototype.optionsContents = function() {
			return
			void 0;
		};
		Tool.prototype.begin = function(x, y, lc) {
		};
		Tool.prototype["continue"] = function(x, y, lc) {
		};
		Tool.prototype.end = function(x, y, lc) {
		};
		return Tool;
	}();
	LC.RectangleTool = function(_super) {
		__extends(RectangleTool, _super);
		function RectangleTool(opts) {
			this.opts = opts;
			this.strokeWidth = 4;
		}


		RectangleTool.prototype.title = "Rectangle";
		RectangleTool.prototype.cssSuffix = "rectangle";
		RectangleTool.prototype.buttonContents = function() {
			//return "<img src='" + this.opts.imageURLPrefix + "/rectangle.png'>";
		};
		RectangleTool.prototype.begin = function(x, y, lc) {
			return this.currentShape = new LC.Rectangle(x, y, this.strokeWidth, lc.primaryColor);
		};
		RectangleTool.prototype["continue"] = function(x, y, lc) {
			this.currentShape.width = x - this.currentShape.x;
			this.currentShape.height = y - this.currentShape.y;
			return lc.update(this.currentShape);
		};
		RectangleTool.prototype.end = function(x, y, lc) {
			return lc.saveShape(this.currentShape);
		};
		return RectangleTool;
	}(LC.Tool);
	LC.Pencil = function(_super) {
		__extends(Pencil, _super);
		function Pencil(opts) {
			this.opts = opts;
			this.strokeWidth = 20;
		}


		Pencil.prototype.title = "Pencil";
		Pencil.prototype.cssSuffix = "pencil";
		Pencil.prototype.buttonContents = function() {
			//return "<img src='" + this.opts.imageURLPrefix + "/pencil.png'>";
		};
		Pencil.prototype.optionsContents = function() {
			var $brushWidthVal, $el, $input, _this = this;
			$el = $("      <span class='brush-width-min'>1 px</span>      <input type='range' min='1' max='50' step='1' value='" + this.strokeWidth + "'>      <span class='brush-width-max'>50 px</span>      <span class='brush-width-val'>(5 px)</span>    ");
			$input = $el.filter("input");
			if ($input.size() === 0) {
				$input = $el.find("input");
			}
			$brushWidthVal = $el.filter(".brush-width-val");
			if ($brushWidthVal.size() === 0) {
				$brushWidthVal = $el.find(".brush-width-val");
			}

			var strokeWidtharry = [2, 4, 8];
			var strWidth = 4;
			_this.strokeWidth = strWidth;
			$('#font input').on('touchend', function() {
				var i = $(this).index();
				$('.pen-style').attr('class', 'pen-style grea' + (i + 1))
				strWidth = strokeWidtharry[i];
				_this.strokeWidth = strWidth;
			})
			$input.change(function(e) {
				//alert(strWidth)
				_this.strokeWidth = strWidth;
				return $brushWidthVal.html("(" + _this.strokeWidth + " px)");
			});
			return $el;
		};
		Pencil.prototype.begin = function(x, y, lc) {
			this.color = lc.primaryColor;
			this.currentShape = this.makeShape();
			return this.currentShape.addPoint(this.makePoint(x, y, lc));
		};
		Pencil.prototype["continue"] = function(x, y, lc) {
			this.currentShape.addPoint(this.makePoint(x, y, lc));
			return lc.update(this.currentShape);
		};
		Pencil.prototype.end = function(x, y, lc) {
			lc.saveShape(this.currentShape);
			return this.currentShape =
			void 0;
		};
		Pencil.prototype.makePoint = function(x, y, lc) {
			return new LC.Point(x, y, this.strokeWidth, this.color);
		};
		Pencil.prototype.makeShape = function() {
			return new LC.LinePathShape(this);
		};
		return Pencil;
	}(LC.Tool);
	LC.Eraser = function(_super) {
		__extends(Eraser, _super);
		function Eraser(opts) {
			this.opts = opts;
			Eraser.__super__.constructor.apply(this, arguments);
			this.strokeWidth = 50;
		}


		Eraser.prototype.title = "Eraser";
		Eraser.prototype.cssSuffix = "eraser";

		Eraser.prototype.buttonContents = function() {
			//return "<img src='" + this.opts.imageURLPrefix + "/eraser.png'>";
		};
		Eraser.prototype.makePoint = function(x, y, lc) {
			this.strokeWidth = 50;
			return new LC.Point(x, y, this.strokeWidth, "#000");
		};
		Eraser.prototype.makeShape = function() {
			return new LC.EraseLinePathShape(this);
		};
		return Eraser;
	}(LC.Pencil);
	LC.Pan = function(_super) {
		__extends(Pan, _super);
		function Pan() {
			return Pan.__super__.constructor.apply(this, arguments);
		}


		Pan.prototype.title = "Pan";
		Pan.prototype.cssSuffix = "pan";
		Pan.prototype.buttonContents = function() {
			//return "<img src='" + this.opts.imageURLPrefix + "/pan.png'>";
		};
		Pan.prototype.begin = function(x, y, lc) {
			return this.start = {
				x : x,
				y : y
			};
		};
		Pan.prototype["continue"] = function(x, y, lc) {
			lc.pan(this.start.x - x, this.start.y - y);
			return lc.repaint();
		};
		return Pan;
	}(LC.Tool);
	LC.EyeDropper = function(_super) {
		__extends(EyeDropper, _super);
		function EyeDropper() {
			return EyeDropper.__super__.constructor.apply(this, arguments);
		}


		EyeDropper.prototype.title = "Eyedropper";
		EyeDropper.prototype.cssSuffix = "eye-dropper";
		EyeDropper.prototype.buttonContents = function() {
			// return "<img src='" + this.opts.imageURLPrefix + "/eyedropper.png'>";
		};
		EyeDropper.prototype.readColor = function(x, y, lc) {
			var newColor;
			newColor = lc.getPixel(x, y);
			if (newColor) {
				lc.primaryColor = newColor;
			} else {
				//lc.primaryColor = lc.backgroundColor;
			}
			return lc.trigger("colorChange", lc.primaryColor);
		};
		EyeDropper.prototype.begin = function(x, y, lc) {
			return this.readColor(x, y, lc);
		};
		EyeDropper.prototype["continue"] = function(x, y, lc) {
			return this.readColor(x, y, lc);
		};
		return EyeDropper;
	}(LC.Tool);
}).call(this);
