/**
 * @fileOverview Bumblebee框架核心 
 * @author 金旻颢
 * @version 1.1.0
 */
(function() {
	
/** @scope _global_ */
	
var NOOP = function() {};
var SLICE = Array.prototype.slice;
var TO_STRING = Object.prototype.toString;
	
var EXPANDO = {
	GETTER: 'getter',
	ORIGINAL: 'original',
	POLLING: 'polling',
	SETTER: 'setter',
	TEMPLATE_NODES: 'template-nodes',
	TEMPLATES: 'templates',
	VALIDATOR: 'validator',
	WIDGET: 'widget'
};
	
var C = function W(W, node) {
	this.node = node;
	this.parent = W;
};
var P = C.prototype;
P.fn = P;

/**
 * W是DOM元素的封装对象。对于全局页面来说，W是document.body的封装。对于每个窗口来说，W是该窗口对应的DOM元素（通常是div）的封装。<br><br>
 * W对象具有同一个原型，这个原型可以通过{@link W.extend}函数来扩展。<br><br>
 * 窗口内的Javascript代码通过访问W对象来完成所有窗口操作，包括DOM修改，事件处理，资源操作，数据绑定等等。不同窗口具有不同的W的实例，以保证彼此之间的隔离性。 
 * @class 
 */
var W = window.W = new C();

var E = 
	/**
	 * @namespace 框架配置 
	 */
	W.env = (JSON.parse(sessionStorage.getItem('W.env'))) || {
		/** 
		 * 是否显示上下文日志
		 * @type boolean
		 * @default false
		 */
		context_debug_enabled: false,
			
		/** 
		 * 是否显示事件日志
		 * @type boolean
		 * @default false
		 */
		event_debug_enabled: false,
		
		/** 
		 * 轮询间隔，单位ms
		 * @type number
		 * @default 10000
		 */
		polling_interval: 10000,
		
		/** 
		 * 在Ajax请求头中加入来源窗口信息的属性名，设置为null则关闭此功能
		 * @type String
		 * @default 'OW-Referer'
		 */
		referer_header: 'OW-Referer',
		
		/** 
		 * 是否显示控件渲染日志
		 * @type boolean
		 * @default false
		 */
		render_debug_enabled: false,
			
		/** 
		 * 默认服务器地址 
		 * @type String
		 */
		server: 'rest' 
	};

/**
 * 将多个对象的属性合并到第一个对象中<br><br>
 * 当传入参数为多个对象时，所有对象的属性将被复制到目标对象，即第一个对象。<br><br>
 * 当传入参数为单个对象时，则认为目标对象为W的原型。可以使用此特性为W添加属性。由于操作的是W的原型，因此所有W的实例均可使用这些添加属性。<br><br>
 * 目标对象将会被修改以包含新增的属性，并作为函数的返回值。若不希望修改所有传入的对象，则可以传入一个空对象作为目标对象。<br><br>
 * 此函数不是递归的。同名的属性，无论是数组还是对象，都不会被合并，之后的对象的属性值会覆盖之前的对象的属性值。<br><br>
 * 值为undefined的属性将不会被复制。<br><br>
 * @name W#extend
 * @function
 * @param {Object} target 当之后有更多的对象传入时，接受新属性的目标对象。若只传入该对象，则目标对象为W的原型
 * @param [args...] 更多包含了需要合并的属性的对象
 * @returns {Object} 目标对象
 * @example
 * var object = W.extend({ a: 1 }, { b: 2 }, { a: 3, c: 3 });
 * // object值：{ a: 3, b: 2, c: 3 } 
 */
P.extend = function() {
	var target = arguments[0] || {}, i = 1, length = arguments.length, source, name, value;
	
	if (length === i) {
		target = P;
		--i;
	}
	
	for (; i < length; i++) {
		if ((source = arguments[i]) != null) {
			for (name in source) {
				value = source[name];
				if (value !== undefined) {
					target[name] = value;
				}
			}
		}
	}
	
	return target;
};

/**
 * 定义类
 * @name W#Class
 * @function
 * @param {String} name 类名
 * @param {function} super_class 父类构造函数，为null时表示使用Object
 * @param {Object} [declaration] 类成员声明，该对象属性将被复制到类构造函数的prototype对象中去。类构造函数通过同类名的函数来指定，与Java规则相同
 * @returns {function} 封装后的类构造函数
 * @example
 * var Animal = W.Class('Animal', null, {
 *   Animal: function(name) {
 *     this.name = name;
 *   },
 * 
 *   getName: function() {
 *     return this.name;
 *   }
 * });
 * var cat = new Animal('Cat');
 * alert(cat.getName());
 * @example
 * // 类继承 Animal <- Cat
 * var Cat = W.Class('Cat', Animal, {
 *   Cat: function(color) {
 *     this.Animal('Cat'); // 调用父类构造函数，可以理解为Java里的super('Cat');
 *     this.color = color;
 *   }
 * });
 * var cat = new Cat('white');
 * alert(cat.color); // 可以访问父类属性
 * alert(cat.name);
 */
P.Class = function(name, super_class, declaration) {
	var clazz = window.eval(
		((name in declaration) ?
			'(function ' + name + '(){ this.' + name + '.apply(this, arguments); })' :
			'(function ' + name + '(){})')
		+ '\n//@ sourceURL=' + name + '.js'
	);
	
	var inherited;
	
	if (super_class && super_class != Object) {
		clazz.prototype = Object.create(super_class.prototype);
		clazz.prototype._super_class = super_class;
		
		inherited = function(name, args) {
			var caller = arguments.callee.caller;
			
			if (arguments.length <= 1) {
				args = name;
				name = caller._name;
			}
			
			var super_class = caller._class.prototype._super_class;
			if (name in super_class.prototype) {
				return super_class.prototype[name].apply(this, args);
			}
		};
	} else {
		inherited = function inherited() {};
	}
	
	for (var key in declaration) {
		var f = declaration[key];
		if (TO_STRING.call(f) == "[object Function]") {
			f._name = key;
			f._class = clazz;
		}
	}
	
	W.extend(clazz.prototype, { constructor: clazz, inherited: inherited, class_name: name }, declaration);
	
	return clazz;
};

// 正在载入中的第三方类库计数
var import_count = 0;

// 引导函数列表
var main = [];

function onready() {
	// 主页面尚未载入，则返回
	if (W.node === undefined) return;
	
	// 第三方类库都已载入，执行引导函数
	if (import_count == 0) {
		var _main = SLICE.call(main);
		main.length = 0;
		for (var i = 0; i < _main.length; i++) {
			_main[i].call(W);
		}
	}
}

$(function() {
	W.node = $(document.body);
	onready();
});

/**
 * 指定一个引导函数，当Bumblebee初始化完成后，调用这个函数<br><br>
 * 此函数只应在引导页面调用。引导函数被保证会在核心代码及第三方库载入后调用。
 * @name W#main
 * @param {function} f 引导函数
 */
P.main = function(f) {
	main.push(f);
};

P.define_property = function(name, declaration) {
	// FIXME: 兼容不支持ECMAScript5的浏览器
	Object.defineProperty(P, name, declaration);
};

P.namespace = function(name, declaration) {
	var delegate = {};
	for (var key in declaration) {
		var value = declaration[key];
		if (typeof value === 'function') {
			delegate[key] = (function(f) {
				return function() {
					return f.apply(this.W, arguments);
				};
			})(value);
		} else {
			delegate[key] = value;
		}
	}
	
	P.define_property(name, {
		get: function() {
			return Object.create(delegate, {
				W: { value: this }
			});
		}
	});
};

// *********************************************************************************************************************
// UTIL

if (!Function.prototype.bind) {
	Function.prototype.bind = function(that) {
		var f = this;
		
		if (arguments.length > 1) {
			var args = SLICE.call(arguments, 1);
			return function() {
				return f.apply(that, arguments.length ? args.concat(SLICE.call(arguments)) : args);
			};
		}
		
		return function() {
			return arguments.length ? f.apply(that, arguments) : f.call(that);
		};
	};
}

/**
 * 封装函数，将函数的前若干个参数值固定
 * @param [args...] 固定的前若干个参数值
 * @returns {function} 封装后的新函数
 */
Function.prototype.curry = function() {
	var f = this, curry_args = SLICE.call(arguments);
	return function() {
		return f.apply(this, arguments.length ? curry_args.concat(SLICE.call(arguments)) : curry_args);
	};
};

/**
 * 计算字符串的哈希值
 * @returns {number} 哈希值
 */
String.prototype.hash = function() {
	var h = 0;
    var len = this.length;
    for (var i = 0; i < len; i++) {
    	h = (31 * h + this.charCodeAt(i)) & 0xffffffff;
    }
    return h;
};

var DUMMY_ELEMENT = document.createElement("div"); 

/**
 * 编码字符串成HTML格式
 * @returns {String} HTML格式的字符串
 */
String.prototype.to_html = function() {
	DUMMY_ELEMENT.textContent = this;
	return DUMMY_ELEMENT.innerHTML;
};

/**
 * 解码HTML格式的字符串
 * @returns {String}
 */
String.prototype.from_html = function() {
	DUMMY_ELEMENT.innerHTML = this;
	return DUMMY_ELEMENT.textContent;
};

if (!String.prototype.trim) {
	String.prototype.trim = function() {   
		return this.replace(/(^\s*)|(\s*$)/g, '');   
	}; 
}

W.extend((function() {
	return /** @lends W.prototype */ {
		
		/** 
		 * 将参数包装为数组。参数本身是数组，直接返回参数值；参数为非undefined的其他值，返回包含该值的长度为1的数组；参数为undefined，返回空数组
		 * @param {mixed} obj
		 * @returns {Array} 
		 */
		Array: function(obj) {
			if (obj === undefined) return [];
			return TO_STRING.call(obj) === "[object Array]" ? obj : [obj];
		},
		
		/** 
		 * 显示一段提示信息
		 * @param {String} msg 提示信息
		 * @returns {W} this
		 */
		alert: function(msg) {
			window.alert(msg);
			return this;
		},
		
		/** 
		 * 判断一句断言是否成立。若成立，执行指定的回调函数；若不成立，显示指定的提示信息
		 * @param {boolean} condition 断言
		 * @param {String} msg 断言不成立时，显示的提示信息
		 * @param {function} [callback] 断言成立时，执行的回调函数
		 * @returns {Chain} 
		 * @example
		 * var x = 1;
		 * W.assert(x > 0, 'Assertion failed', function() {
		 *   alert('Assertion passed');
		 * });
		 */
		assert: function(condition, msg, callback) {
			var W = this, chain = W.Chain(), token = chain.next_token('W.assert');
			W.later(function() {
				if (condition) {
					chain.yield(token, 'success');
				} else {
					if (msg) W.alert(msg);
				}
			});
			
			if (callback) {
				return chain.done(callback);
			} else {
				return chain;
			}
		},
		
		/**
		 * 调用传入的函数
		 * @param {function(args...)} f 被调用函数
		 * @param [args...] 被调用函数的参数列表
		 * @returns {Chain}
		 * @example
		 * function add(a, b) { return a + b; }
		 * W.call(add, 1, 2).done(function(sum) {
		 *   alert(sum);
		 * });
		 */
		call: function(f) {
			var W = this, chain = W.Chain(), token = chain.next_token('W.call');
			var result = f.apply(this, SLICE.call(arguments, 1));
			W.later(function() {
				chain.yield.apply(chain, [token, 'success', result]);				
			});
			return chain;
		},
	
		/**
		 * 显示一段确认信息让用户进行确认。确认完成后执行指定的回调函数
		 * @param {String} msg 确认信息
		 * @param {function} [done_handler] 确认完成后执行的回调函数
		 * @returns {Chain}
		 * @example
		 * W.confirm('是否要删除记录？').done(function() {
		 *   // 删除记录
		 * });
		 */
		confirm: function(msg, done_handler) {
			var W = this, chain = W.Chain(), token = chain.next_token('W.confirm');
			W.later(function() {
				if (window.confirm(msg)) {
					chain.yield(token, 'success');
				} else {
					chain.yield(token, 'error');
				}
			});
			
			if (done_handler) {
				chain.done(done_handler);
			}
			
			return chain;
		},
		
		/**
		 * 遍历数组或对象，将数组中的每一元素或对象中的每一键值对作为参数，调用指定的回调函数
		 * @param {Array|Object} obj 需遍历的数组或对象 
		 * @param {function(item,index)} callback 回调函数。函数的this和第一个参数指向数组元素值或对象属性值，第二个参数指向数组下标或对象属性名。回调函数可返回false以中断遍历。
		 * @returns {W}
		 * @example
		 * var arr = [1, 2, 3];
		 * var sum = 0;
		 * W.each(arr, function(value, index) {
		 *   sum += value; // 等价于：sum += this;
		 * });
		 */
		each: function(obj, callback) {
			var name, i = 0, length = obj.length;
			if (length === undefined || W.is_function(obj)) {
				for (name in obj) {
					if (callback.call(obj[name], obj[name], name) === false) {
						break;
					}
				}
			} else {
				for (var value = obj[0]; i < length && callback.call(value, value, i) !== false; value = obj[++i]) {}
			}
			return this;
		},
		
		/**
		 * 从数组中提取出所有满足条件的元素，组成一个新数组。这通过迭代原数组，对每一元素调用筛选函数，提取函数返回为true的元素来实现。
		 * @param {Array} arr 原数组
		 * @param {function} func 筛选函数。函数的this指向数组元素。函数返回值为true时，元素被加入到返回数组
		 * @returns {Array}
		 * @example
		 * W.filter([1,2,3,4,5,6], function() {
		 *   return this > 3;
		 * }); // 返回值为[4,5,6]
		 */
		filter: function(arr, func) {
			var ret = [];
			for (var i = 0; i < arr.length; i++) {
				if (func.call(arr[i])) {
					ret.push(arr[i]);
				}
			}
			return ret;
		},
		
		/**
		 * 判断数组中是否包含指定元素。若包含，返回元素的坐标；若不包含，返回-1。和JavaScript原生的indexOf()函数相比，这里包含的判断用的是"相等"(==)，而不是"全等"(===)
		 * @param {Array} arr 需扫描的数组
		 * @param {mixed} value 需扫描的元素
		 * @returns {number}
		 */
		in_array: function(arr, value) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] == value) return i;
			}
			return -1;
		},
		
		/**
		 * 判断参数是否为数组
		 * @param {mixed} obj
		 * @returns {boolean}
		 */
		is_array: function(obj) {
			return TO_STRING.call(obj) === "[object Array]";
		},
		
		/**
		 * 判断参数是否为函数
		 * @param {mixed} obj
		 * @returns {boolean}
		 */
		is_function: function(obj) {
			return typeof obj === "function";
		},
		
		/**
		 * 判断参数是否为数字
		 * @param {mixed} obj
		 * @returns {boolean}
		 */
		is_number: function(obj) {
			return TO_STRING.call(obj) === "[object Number]";
		},
		
		/**
		 * 判断参数是否为正则表达式
		 * @param {mixed} obj
		 * @returns {boolean}
		 */
		is_regexp: function(obj) {
			return TO_STRING.call(obj) === "[object RegExp]";
		},
		
		/**
		 * 将数组中所有元素映射成一组新的元素。这通过迭代原数组，对每一元素调用映射函数，提取函数的返回值来实现。
		 * @param {Array} arr 原数组
		 * @param {function} func 映射函数。函数的this指向数组元素。函数返回值被加入到返回数组
		 * @returns {Array} 返回数组
		 * @example
		 * W.map([1,2,3], function() {
		 *   return this + 3;
		 * }); // 返回值为[4,5,6]
		 */
		map: function(arr, func) {
			var ret = [];
			for (var i = 0; i < arr.length; i++) {
				ret.push(func.call(arr[i]));
			}
			return ret;
		},
		
		/** 
		 * 显示一段通知信息
		 * @param {String} msg 提示信息
		 * @returns {W} 
		 */
		notice: function(msg) {
			return this.alert(msg);
		},
		
		/**
		 * 获得现在距1970年1月1日之间的毫秒数
		 * @returns {number}
		 */
		now: Date.now || function() {
			return (new Date).getTime();
		},
		
		paginate: function(result, paginator) {
			if (typeof paginator === 'string') {
				var parts = paginator.split('-');
				paginator = { currentPage: 1, pageSize: 10 };
				if (parts[0]) paginator.currentPage = parseInt(parts[0]);
				if (parts[1]) paginator.pageSize = parseInt(parts[1]);
				if (parts[2]) paginator.order_by = parts[2]; 
				if (parts[3]) paginator.order = parts[3];
			} else if (typeof paginator === 'undefined') {
				paginator = { currentPage: 1, pageSize: 10 };
			}
			if (paginator.order_by && paginator.order) {
				var key = paginator.order_by;
				var comparator = (paginator.order == 'desc') ? function(a, b) {
					if (a[key] == b[key]) return 0;
					return a[key] > b[key] ? -1 : 1;
				} : function(a, b) {
					if (a[key] == b[key]) return 0;
					return a[key] < b[key] ? -1 : 1;
				};
				result = result.slice();
				result.sort(comparator);
			}
			var total = result.length, first = (paginator.currentPage - 1) * paginator.pageSize, last = Math.min(paginator.currentPage * paginator.pageSize, total);
			return {
				paginator: W.extend(paginator, {
					first: last == 0 ? 0 : first + 1,
					last: last,
					total: total,
					totalPage: Math.floor((total - 1) / paginator.pageSize) + 1
				}),
				result: result.slice(first, last)
			};
		},
		
		/**
		 * 将对象转换成标准的URL编码形式
		 * @param {Object} obj 需转换的对象
		 * @param {String} [prefix] 查询字符串中参数名的前缀 
		 * @returns {String}
		 * @example
		 * W.param({ a: 1, b: 2 });      // "a=1&b=2"
		 * W.param({ a: [1, 2] });       // "a=1&a=2"
		 * W.param({ a: 1, b: 2 }, 'c'); // "c.a=1&c.b=2"
		 */
		param: function(obj, prefix) {
			prefix = prefix || '';
			var arr = [];
			if (this.is_array(obj)) {
				for (var i = 0; i < obj.length; i++) {
					var value = obj[i];
					if (typeof value !== 'object') {
						arr.push(encodeURIComponent(prefix) + '=' + encodeURIComponent(value));
					} else {
						// TODO
					}
				}
			} else {
				if (prefix) prefix += '.';
				for (var key in obj) {
					var value = obj[key];
					if (typeof value !== 'object') {
						arr.push(encodeURIComponent(prefix + key) + '=' + encodeURIComponent(value));
					} else {
						arr.push(this.param(value, prefix + key));
					}
				}
			}
			return arr.join('&').replace(/%20/g, '+');
		},
		
		/**
		 * 获取一个全局唯一的ID
		 * @function
		 * @returns {String}
		 */
		unique_id: (function() {
			var sequence = 0;
			return function() {
				return "gen" + (++sequence); 
			};
		})()
	};
})());

// *********************************************************************************************************************
// CONTEXT

var Context = (function() {
	
	// 当前上下文
	var current_context;
	
	var set_zero_timeout = (function() {
		// 单次执行最大耗时限制，避免一次执行过多的函数以便浏览器更快地刷新页面
		var COST_MAX = 20;
		
		var KEY = "zero-timeout-message";
		
		// 执行的函数列表
		var timeouts = [];
		
		function on_message(e) {
			if (e.source === window && e.data === KEY) {
				e.stopPropagation();
				
				// 期望结束时间
				var stop_at = W.now() + COST_MAX;
				
				var i = 0, length = timeouts.length;
				outer: 
				while (i < length) {
					do {
						var timeout = timeouts[i++];
						try {
							// 设置当前上下文并执行函数
							current_context = timeout.context;
							timeout.f.call(current_context);
						} catch (e) {
							W.error(e);
						} finally {
							current_context && current_context.dec_reference();
						}
					
						// 如果过了期望结束时间，则停止执行，等下一次message事件触发下一次执行
						if (W.now() >= stop_at) {
							break outer;
						}
					} while (i < length);
					
					length = timeouts.length;
				}
				
				if (i === timeouts.length) {
					timeouts = [];
				} else {
					timeouts = SLICE.call(timeouts, i);
					window.postMessage(KEY, "*");
				}
				
				current_context = null;
			}
		}
		
		window.addEventListener("message", on_message, true);
		
		// set_zero_timeout:
		return function(f, context) {
			var length = timeouts.length;
			
			if (length === 0) {
				window.postMessage(KEY, "*");
			}
			
			timeouts[length] = { f: f, context: context };
		};
	})(); 
	
	var id_sequence = 0;
	var token_sequence = 0;
	
	var check_contexts = {};
	
	function finalize(context) {
		check_contexts[context.id] = context;
		set_zero_timeout(function() {
			for (var id in check_contexts) {
				var context = check_contexts[id];
				if (context.reference == 0) {
					delete check_contexts[id];

					if (E.context_debug_enabled) {
						W.debug('结束上下文', context);
					}
					
					if (context.handlers) {
						for (var i = 0; i < context.handlers.length; i++) {
							context.handlers[i].call(context);
						}
					}
				}
			}
		});
	}
	
	var EXECUTE_IN_CONTEXT_TEMPLATE = function(context, f) {
		var old_context = current_context;
		try {
			current_context = context;
			
			return f.apply(context, SLICE.call(arguments, 2));
		} finally {
			if (current_context) {
				current_context.dec_reference();
			}
			current_context = old_context;
		}
	};
	
	var Context = W.Class('Context', null, {
		Context: function(root) {
			if (root) {
				this.root = root;
			} else {
				this.id = id_sequence++;
				this.reference = 0;
				this.root = this;
			}
		},
		
		dec_reference: function() {
			var root = this.root;
			if (--root.reference === 0) {
				finalize(root);
			};
		},
		
		done: function(handler) {
			var root = this.root, handlers = root.handlers;
			if (handlers === undefined) {
				handlers = root.handlers = [];
			}
			handlers.push(handler);
		},
		
		inc_reference: function() {
			this.root.reference++;
		},
		
		execute: function(f) {
			this.inc_reference();
			set_zero_timeout(f, this);
		},
		
		execute_in_child: function(f) {
			var new_context = new Context(this.root);
			new_context.parent = this;
			new_context.inc_reference();
			set_zero_timeout(f, new_context);
		}
	});
	
	W.extend({
		current_context: function() {
			return current_context;
		},
		
		later: function(f) {
			if (current_context) {
				current_context.execute(f);
			} else {
				set_zero_timeout(f);
			}
		}
	});
	
	/** Context */
	return {
		/**
		 * 将指定函数绑定到当前上下文中，返回一个新函数。稍后对返回函数的调用将会导致在绑定的上下文中同步执行原函数<br>
		 * 如果当前无上下文，返回原函数本身
		 * @param {function()} f 原函数
		 * @returns {function()} 如果当前有上下文，返回新函数，调用该函数将会在绑定的上下文中同步执行原函数f。如果当前无上下文，返回原函数f本身
		 */
		bind: function(f) {
			if (current_context) {
				current_context.inc_reference();
				return EXECUTE_IN_CONTEXT_TEMPLATE.curry(current_context, f); 
			} else {
				return f;
			}
		},
		
		/**
		 * 在当前上下文中同步执行指定函数。如果当前无上下文，则新建一个上下文
		 * @returns {any} 函数返回值
		 */
		execute: function(f) {
			var context = this.get();
			context.inc_reference();
			
			return EXECUTE_IN_CONTEXT_TEMPLATE(context, f);
		},
		
		/**
		 * 在当前上下文中异步执行指定函数。如果当前无上下文，则新建一个上下文
		 * @returns {any} 函数返回值
		 */
		execute_async: function(f) {
			this.get().execute(f);
		},
		
		/**
		 * 获取当前上下文。如果当前无上下文，则新建一个上下文并返回
		 * @returns {Context} 上下文实例
		 */
		get: function() {
			if (current_context) {
				return current_context;
			}
			
			var context = new Context;
			
			if (E.context_debug_enabled) {
				W.debug('开始上下文', context);
			}

			return context;
		},
		
		next_token: function() {
			return token_sequence++;
		}
	};
})();

// *********************************************************************************************************************
// CHAIN

W.extend((function() {
	
	var DEFAULT_ERROR_HANDLER = function(e) {
		if (e) {
			this.alert(e.localizedMessage || e.message || ("Unknown error: " + e));
		}
	};
	
	function make_chain_constructor(W) {
		var chain_proto = W.extend(Object.create(W), /** @lends W.prototype */ {
			in_chain: true,
			
			Chain: function(new_chain) {
				return new_chain ? new Chain() : this;
			},
			
			abort: function() {
				var nodes = this._nodes;
				if (nodes) {
					for (var i = this._first, len = nodes.length; i < len; i++) {
						var node = nodes[i];
						node && node.abort && node.abort();
					}
				}

				this.aborted = true;
				this._nodes = null;
			},
			
			/**
			 * 为之前的异步调用注册回调函数
			 * @param {function(data)|Object} handler 异步调用成功处理的回调函数；或者包含以下属性的对象
			 * @param {function(data)} [handler.success] 当handler为对象时，成功处理的回调函数。
			 * @param {function(ex)} [handler.error] 当handler为对象时，异常处理的回调函数。ex 为由 Java 异常对象转换成的 Javascript 对象。
			 * @param {function()} [handler._finally] 当handler为对象时，无论成功或异常，在相应的回调函数调用完成（或异常终止）后，始终执行的回调函数。
			 * @returns {Chain}
			 * @example
			 * W.get(resource).done(function(data) { ... });
			 */
			done: function(handler) {
				if (handler) {
					var node = this._nodes[this._current_token];
					if (W.is_function(handler)) {
						node.success = handler;
					} else {
						if (handler.success)  node.success = handler.success;
						if (handler.error)    node.error = handler.error;
						if (handler._finally) node._finally = handler._finally;
					}
				}
				
				return this;
			},
			
			join_done: function(success_handler) {
				var chain = this, token = ++this._current_token;
				
				this._nodes[token] = { name: 'W.join_done', success: success_handler };
				
				Context.execute_async(function join_done0() {
					chain.yield(token, 'success');
				});
				
				return chain;
			},
			
			next_token: function(name, abort) {
				var token = ++this._current_token;
				
				this._nodes[token] = { name: name, abort: abort };
				
				return token;
			},
			
			pipe: function(status, filter) {
				var node = this._nodes[this._current_token];
				
				if (arguments.length === 1) {
					if (W.is_function(status)) {
						// Chain.pipe(filter)
						node.success_filters = node.success_filters || [];
						node.success_filters.push(status);
					} else {
						// Chain.pipe({ success: success_filter, error: error_filter });
						if (status.success) {
							node.success_filters = node.success_filters || [];
							node.success_filters.push(status.success);
						}

						if (status.error) {
							node.error_filters = node.error_filters || [];
							node.error_filters.push(status.error);
						}
					}
				} else if (status === 'error' || status === 'success') {
					var key = status + '_filters';
					node[key] = node[key] || [];
					node[key].push(filter);
				}

				return this;
			},
			
			yield: function(token, status) {
				var nodes = this._nodes;
				
				// 检查调用链是否已中止，若中止则直接返回
				if (nodes === null) return;
				
				var node = nodes[token];
				if (arguments.length > 2) node.result = SLICE.call(arguments, 2);
				
				if (token !== this._first) {
					node.status = status;
					return;
				}
				
				for (;;) {
					try {
						if (status === 'success') {
							if (node.success) {
								var result = node.result;
								
								// 如果定义了结果过滤器，则依次调用
								if (node.success_filters) {
									for (var i = 0; i < node.success_filters.length; i++) {
										result = W.Array(node.success_filters[i].apply(W, result));
									}
								}
								
								var sub_chain = node.success.apply(W, result);
								
								// 若回调函数返回一个调用链，则将其作为子调用链处理
								if (sub_chain && sub_chain.in_chain) {
									if (sub_chain !== this) {
										node.abort = function() { sub_chain.abort(); };
										node.chain = sub_chain;
										node.status = null;
										node.success = null;
										
										var chain = this;
										sub_chain.join_done(function() {
											chain.yield(token, 'success');
										});
										
										break;
									} else {
										W.warn('调用链不能join自身');
									}
								}
							}
						} else {
							var error = node.error || DEFAULT_ERROR_HANDLER, result = node.result;
							
							// 如果定义了结果过滤器，则依次调用
							if (node.error_filters) {
								for (var i = 0; i < node.error_filters.length; i++) {
									result = node.error_filters[i].call(W, result);
								}
							}
							
							error.apply(W, result);
							return;
						}
					} catch (e) {
						W.error(e);
					} finally {
						node._finally && node._finally.apply(W);
					}
					
					node = nodes[++token];
					if (node === undefined) break;
					
					status = node.status;
					if (status === undefined) break;
				}
				
				this._first = token;
			}
		});
		
		var Chain = function() {
			this._current_token = 0;
			this._first = 1;
			this._nodes = [];
		};
		
		Chain.prototype = chain_proto;
		
		return Chain;
	}
	
	return /** @lends W.prototype */ {
		
		/**
		 * 构造一个调用链
		 * @returns {Chain}
		 */
		Chain: function() {
			var chain_constructor = this.chain_constructor;
			if (chain_constructor === undefined) {
				chain_constructor = this.chain_constructor = make_chain_constructor(this);
			}
			
			return new chain_constructor;
		},
		
		done: function(handler) {
			var W = this;
			if (handler) {
				handler = W.is_function(handler) ? handler : (handler.success || NOOP);
				handler.call(W, 'success');
			}
			return W;
		},
		
		/**
		 * 创建一个空的异步调用并立即注册回调函数
		 * @param {function} handler 回调函数
		 * @returns {Chain}
		 * @example
		 * var abc, def;
		 * W.get('abc').done(function(data) {
		 *   abc = data; // 设置 abc 的值
		 * }).get('def').done(function(data) {
		 *   def = data; // 设置 def 的值
		 * }).join(function() {
		 *   // 运行到这里时，abc 和 def 的值都已经设置完毕
		 *   W.alert(abc + def); 
		 * });
		 */
		join: function(chains, join_handler) {
			var W = this;
			
			// W.join(join_handler)
			if (W.is_function(chains)) {
				join_handler = chains;
				chains = null;
			}
			
			var chain = W.Chain();
			
			var count = 0; // 被join的子调用链计数
			if (chains) {
				chains = W.Array(chains);
				
				var len = chains.length;
				
				var token = chain.next_token('W.join', function() {
					// 中止所有的子调用链
					// FIXME: 这里可能需要考虑是否有场景下子调用链不随主调用链中止
					for (var i = 0; i < len; i++) {
						var _chain = chains[i];
						if (_chain.in_chain) {
							_chain.abort();
						}
					}
				});
				
				for (var i = 0; i < len; i++) {
					if (chains[i].in_chain) {
						if (chains[i] === chain) {
							W.warn('调用链不能join自身');
							break;
						}	
						
						// join子调用链，计数加1，回调时计数减1，减到0时表示所有子调用链完成，触发主调用链yield
						++count;
						chains[i].join_done(function join_done() {
							if (--count === 0) {
								if (join_handler) {
									chain.yield(token, 'success', join_handler());
								} else {
									chain.yield(token, 'success');
								}
							}
						});
					}
				}
			}

			// 没有子调用链，则主调用链立即yield
			if (count === 0) {
				Context.execute_async(function() {
					if (join_handler) {
						chain.yield(token, 'success', join_handler());
					} else {
						chain.yield(token, 'success');
					}
				});
			}
			
			// 返回主调用链
			return chain;
		},
		
		join_done: function(success_handler) {
			return this.Chain().join_done(success_handler);
		},
		
		push: function() {
			W.warn("过期的函数Chain.push()，应为Chain.transmit()");
			return this.transmit.apply(this, arguments);
		},
		
		/**
		 * 设置下一个回调函数的参数，用于在W协议中声明变量
		 * @param [args...] 参数列表
		 * @returns {Chain}
		 * @example 在W协议中声明变量msg
		 * transmit("hello") -> msg|alert(msg)
		 */
		transmit: function() {
			var W = this, chain = W.Chain(), token = chain.next_token('W.transmit');
			
			var args = SLICE.call(arguments); 
			var current_context = Context.get();
			
			current_context.execute(function() {
				chain.yield.apply(chain, [token, 'success'].concat(args));
			});

			return chain;
		}
	};
})());

// *********************************************************************************************************************
// LOG

W.extend((function() {
	
	// 修复IE9的console问题，见：http://stackoverflow.com/questions/5538972/console-log-apply-not-working-in-ie9
	if (typeof console !== 'undefined' && typeof console.log == "object") {
		var call = Function.prototype.call;
		W.each(['error', 'log', 'warn'], function(method) {
			console[method] = call.bind(console[method], console);
		});
	}
	
	return /** @lends W.prototype */ {
		
		/**
		 * 显示调试级别的日志信息
		 * @param [args...] 日志信息
		 * @returns {W}
		 */
		debug: function() {
			if (typeof console !== 'undefined') {
				console.log.apply(console, arguments);
			}
			return this;
		},
		
		/**
		 * 显示错误级别的日志信息
		 * @param [args...] 日志信息
		 * @returns {W}
		 */
		error: function(obj) {
			if (typeof console !== 'undefined') {
				console.error.apply(console, arguments);
			}
			
			return this;
		},
		
		/**
		 * 显示警告级别的日志信息
		 * @param [args...] 日志信息
		 * @returns {W}
		 */
		warn: function() {
			if (typeof console !== 'undefined') {
				console.warn.apply(console, arguments);
			}
			return this;
		}
	};
})());

// *********************************************************************************************************************
// EVENT

W.extend((function() {
	var EVENTS = {};
	
	W.each(
		"blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),
		function(name) {
			EVENTS[name] = "browser";
		}
	);
	
	W.each(
		"open close refresh meta popup switch".split(" "),
		function(name) {
			EVENTS[name] = "layout";
		}
	);

	var BROWSER_EVENT_CALLBACK = function(W, handler) {
		var self = this, args = SLICE.call(arguments, 2);
		Context.execute(function() {
			return handler.apply(W.$(self), args);
		});
	};
	
	var EVENT_CALLBACK = function(W, handler) {
		return handler.apply(W, SLICE.call(arguments, 2));
	};
	
	/**
	 * 自定义事件监听函数表，结构为: { 事件类型: [事件处理函数...] }
	 * 事件监听函数为函数对象
	 */
	var event_handlers = W.event_handlers = {};
	
	// 自定义事件监听函数ID序列
	var event_handler_id_sequence = 0;
	
	/** 
	 * 使用正则匹配的自定义事件监听函数表，结构为: { 事件类型: [事件处理函数...] } 
	 * 事件类型为正则表达式的源字符串值(.source)，事件监听函数为函数对象
	 */
	var wildcard_event_handlers = W.wildcard_event_handlers = {};
	
	var RETURN_TRUE = function() { return true; };
	var RETURN_FALSE = function() { return false; };
	
	var Event = W.Class('Event', null, {
		Event: function(type, node, args) {
			this.type = type;
			this.target = node && node[0];
			this.args = args;
			this.timeStamp = W.now();
		},
		isPropagationStopped: RETURN_FALSE,
		stopPropagation: function() {
			this.isPropagationStopped = RETURN_TRUE;
		}
	});
	
	return /** @lends W.prototype */ {
		Event: function() {
			return SLICE.call(arguments).join(':');
		},
		
		/**
		 * 指定事件名称和参数，触发事件
		 * @param {String|Object} event 事件名称或对象。若传入的是对象，属性定义如下：
		 * @param {String} event.type 事件名称
		 * @param {Array} [event.args] 事件参数
		 * @returns {W}
		 * @example 监听并触发自定义事件
		 * W.on('aaa', function() {
		 *   alert('事件 aaa 触发');
		 * });
		 * W.fire('aaa');
		 * @example 监听并触发带参数的自定义事件
		 * W.on('bbb', function(e, x, y) {
		 *   alert('事件 bbb 触发, x=' + x + ', y=' + y);
		 * });
		 * 
		 * W.fire('bbb', 1, 2);
		 */
		fire: function(event) {
			var W = this, node = W.node;
			var type = event.type || event, 
				args = event.args || SLICE.call(arguments, 1);
			
			event = (typeof event === "object") ? 
					W.extend(new Event(type, node, args), event) :
					new Event(type, node, args);
					
			var current_context = Context.get();
			
			// 检查当前的事件堆栈，禁止重复事件发送，以避免死循环
			var context = current_context, event_stack;
			while (context) {
				event_stack = context.event_stack;
				if (event_stack) break;
				context = context.parent;
			}
			event_stack = event_stack || [];
			
			loop:
			for (var i = 0; i < event_stack.length; i++) {
				var evt = event_stack[i];
				if (evt.node == node && evt.type == type && evt.args.length == args.length) {
					for (var j = 0; j < args.length; j++) {
						if (evt.args[j] != args[j]) {
							break loop;
						}
					}
					W.warn('重复事件', type, args, node.attr('id') || '');
					return W; 
				}
			}
			
			event_stack = SLICE.call(event_stack);
			
			// 调试选项中事件日志开启时，输出事件日志
			if (E.event_debug_enabled) {				
				W.debug('事件', type, args, node.attr('id') || '');
			}
			
			current_context.execute_in_child(function() {
				var context = this;
				
				// 设置事件堆栈
				context.event_stack = event_stack;
				event_stack.push({
					node: node,
					type: type,
					args: args
				});
				
				var handler_args = SLICE.call(args);
				handler_args.unshift(event); // 将事件对象作为监听函数的第一个参数
				
				switch (EVENTS[type]) {
					case "browser": {
						/** 浏览器事件，交给jQuery处理 */
						node.trigger(type);
						event.handled = true;
						break;
					}
					case "layout": {
						/** 布局事件 */
						while (node && node.length) {
							var w = W.$(node),
								inner_handlers = w.expando('inner_handlers'),
								outer_handlers = w.expando('outer_handlers');
							
							// 处理DOM元素作为容器元素注册的事件
							var handlers = inner_handlers && inner_handlers[type];
							if (handlers) {
								for (var i = 0; i < handlers.length; i++) {
									try {
										handlers[i].apply(W, handler_args);
									} catch (e) {
										W.error(e);
									}
									event.handled = true;
								}
								if (event.isPropagationStopped()) break;
							}
							
							// 处理DOM元素作为普通元素注册的事件
							handlers = outer_handlers && outer_handlers[type];
							if (handlers) {
								for (var i = 0; i < handlers.length; i++) {
									try {
										handlers[i].apply(W, handler_args);
									} catch (e) {
										W.error(e);
									}
									event.handled = true;
								}
								if (event.isPropagationStopped()) break;
							}
							
							node = node.parent();
						}
						
						break;
					}
					default: {
						/** 自定义事件 */
						var handlers = event_handlers[type];
						if (handlers) {
							for (var id in handlers) {
								var handler = handlers[id];
								
								if (handler.modifier === 'default') {
									if (handler.layout_id != W.layout.id) {
										continue;
									}
								}
								if (handler.modifier === 'private') {
									var node_on = handler.node[0], node_fire = W.node[0];
									if (handler.layout_id !== W.layout.id || !(node_on == node_fire || $.contains(node_on, node_fire))) {
										continue;
									}
								}
								
								try {
									handler.apply(W, handler_args);
								} catch (e) {
									W.error(e);
								}
								
								event.handled = true;
							}
						}
						
						for (var source in wildcard_event_handlers) {
							var entry = wildcard_event_handlers[source];
							if (!entry.type.test(type)) continue;
							handlers = entry.handlers;
							for (var id in handlers) {
								var handler = handlers[id];
								
								if (handler.modifier === 'default') {
									if (handler.layout_id != W.layout.id) {
										continue;
									}
								}
								if (handler.modifier === 'private') {
									var node_on = handler.node[0], node_fire = W.node[0];
									if (handler.layout_id !== W.layout_id || !(node_on == node_fire || $.contains(node_on, node_fire))) {
										continue;
									}
								}
								
								try {
									handler.apply(W, handler_args);
								} catch (e) {
									W.error(e);
								}
								
								event.handled = true;
							}
						}
					}
				}
				
				// 处理事件完成回调函数
				if (event.success) {
					event.success.apply(W, handler_args);
				}
			});
			
			return W;
		},
		
		/**
		 * 解除事件监听函数和当前元素的绑定
		 * @function
		 * @param {String|Regexp|Array} [events] 事件名称。若为undefined，解除当前元素所有事件的绑定
		 * @param {function} [handler] 绑定的事件监听函数。若为undefined，解除当前元素指定事件的所有监听函数的绑定
		 * @returns {W}
		 */
		off: (function() {
			function remove_user_handlers(W, expando_key, event, handler) {
				var handlers = W.expando(expando_key);
				var event_handler_ids = handlers && handlers['*'];
				if (event_handler_ids) {
					var is_regexp, type;
					
					if (event !== undefined) {
						is_regexp = W.is_regexp(event);
						type = is_regexp ? event.source : event;
					}
					
					if (type === undefined) {
						for (var i = 0; i < event_handler_ids.length; i++) {
							var event_handler_id = event_handler_ids[i];
							
							for (var event_type in event_handlers) {
								var event_handler = event_handlers[event_type][event_handler_id];
								if (event_handler) {
									if (handler === undefined || event_handler.source === handler) {
										delete event_handlers[event_type][event_handler_id];
									}
								}
							}
							
							for (var event_type in wildcard_event_handlers) {
								var event_handler = wildcard_event_handlers[event_type][event_handler_id];
								if (event_handler) {
									if (handler === undefined || event_handler.source === handler) {
										delete wildcard_event_handlers[event_type][event_handler_id];
									}
								}
							}
						}
						
						delete handlers['*'];
					} else {
						var filtered_event_handler_ids = []; 
						for (var i = 0; i < event_handler_ids.length; i++) {
							var event_handler_id = event_handler_ids[i];
							if (!is_regexp) {
								var event_handler = event_handlers[type][event_handler_id];
								if (event_handler && (handler === undefined || event_handler.source === handler)) {
									delete event_handlers[type][event_handler_id];
								} else {
									filtered_event_handler_ids.push(event_handler_id);
								}
							} else {
								var event_handler = wildcard_event_handlers[type][event_handler_id];
								if (event_handler && (handler === undefined || event_handler.source === handler)) {
									delete wildcard_event_handlers[type][event_handler_id];
								} else {
									filtered_event_handler_ids.push(event_handler_id);
								}
							}
						}
						
						handlers['*'] = filtered_event_handler_ids;
					}
				}
			}
			
			return function(events, handler) {
				var W = this, node = W.node, inner_only = (W.type == 'container');
				
				// 若未指定事件名称，则取消节点所有事件监听
				if (events === undefined) {
					// 取消浏览器事件监听
					node.unbind();
					
					// 取消布局事件和自定义事件监听
					remove_user_handlers(W, 'inner_handlers');
					W.remove_expando('inner_handlers');
					if (!inner_only) {
						remove_user_handlers(W, 'outer_handlers');
						W.remove_expando('outer_handlers');
					}
					
					return W;
				}
				
				W.each(W.Array(events), function() {
					remove_user_handlers(W, 'inner_handlers', this, handler);
					if (!inner_only) {
						remove_user_handlers(W, 'outer_handlers', this, handler);
					}
				});
				
				return W;
			};
		})(),
		
		/**
		 * 绑定事件监听函数到当前元素上
		 * @param {String|Regexp|Array} events 事件名称。可以对多个事件同时进行监听，此时events值可以为数组，包含每个事件名称或匹配事件名称的正则表达式 
		 * @param {String} [modifier] 监听范围。可以是 'public'，'default' 和 'private'。默认为 'default'
		 * @param {function(e, args...)} handler 监听函数。this被绑定到事件监听的W对象上
		 * @returns {W}
		 * @example 用户点击链接后，修改链接的颜色
		 * &lt;a id="link" href="#"&gt;Click me!&lt;/a&gt
		 * &lt;script&gt
		 * W.$('link').on('click', function(e) {
		 *   this.css('color', 'red'); // this 指向的是 W.$('link')
		 * });
		 * &lt;/script&gt
		 */
		on: function(events, modifier, handler) {
			var W = this, browser_events = [], layout_events = [], user_events = [], wildcard_user_events = [];
			
			if (handler === undefined) {
				handler = modifier;
				modifier = 'default';
			}
			
			W.each(W.Array(events), function(event) {
				if (W.is_regexp(event)) {
					wildcard_user_events.push(event);
				} else {
					switch (EVENTS[event]) {
						case 'browser': {
							browser_events.push(event);
							break;
						}
						case 'layout': {
							layout_events.push(event);
							break;
						}
						default: user_events.push(event);
					}
				}
			});

			var node = W.node;
			if (node.length === 0) {
				W.warn('待绑定事件节点不存在：' + node.selector);
				return W;
			}
			
			// 浏览器事件直接交由jQuery进行绑定
			if (browser_events.length) {
				node.bind(browser_events.join(' '), BROWSER_EVENT_CALLBACK.curry(W, handler));
			}
			
			// 获取已绑定的事件处理函数表，结构为 { 事件类型: [事件处理函数...] }
			var handlers_key = (W.type == 'container' ? 'inner_handlers' : 'outer_handlers'); 
			var handlers_attached = W.expando(handlers_key);
			if (!handlers_attached) {
				handlers_attached = {};
				W.expando(handlers_key, handlers_attached);
			}
			
			// 布局事件
			if (layout_events.length) {
				for (var i = 0; i < layout_events.length; i++) {
					var type = layout_events[i];
					var handlers = handlers_attached[type];
					if (!handlers) {
						handlers = handlers_attached[type] = [];
					}
					handlers.push(EVENT_CALLBACK.curry(W, handler));
				}
			}
			
			var event_handler_ids = handlers_attached['*'];
			if (!event_handler_ids) {
				event_handler_ids = handlers_attached['*'] = [];
			}
			
			// 自定义事件
			if (user_events.length) {
				for (var i = 0; i < user_events.length; i++) {
					var type = user_events[i];
					
					var _handler = EVENT_CALLBACK.curry(W, handler), id = ++event_handler_id_sequence;
					W.extend(_handler, {
						id: id,
						type: type,
						modifier: modifier,
						layout_id: W.layout.id,
						node: W.node,
						source: handler
					});
					
					var handlers = event_handlers[type];
					if (!handlers) {
						handlers = event_handlers[type] = {};
					}
					
					handlers[id] = _handler;
					event_handler_ids.push(id);
				}
			}
			
			// 使用正则匹配的自定义事件
			if (wildcard_user_events.length) {
				for (var i = 0; i < wildcard_user_events.length; i++) {
					var type = wildcard_user_events[i];
					
					var _handler = EVENT_CALLBACK.curry(W, handler), id = ++event_handler_id_sequence;
					W.extend(_handler, {
						id: id,
						type: type.source, 
						modifier: modifier, 
						layout_id: W.layout.id,
						node: W.node,
						source: handler
					});
					
					var handlers = wildcard_event_handlers[type.source];
					if (!handlers) {
						handlers = wildcard_event_handlers[type.source] = { type: type, handlers: {} };
					}
					
					handlers.handlers[id] = _handler;
					event_handler_ids.push(id);
				}
			}
			
			return W;
		},
		
		/**
		 * 绑定事件监听函数到当前元素上，和{@link W.on}的区别是，监听函数只会执行最多一次
		 * @param {String|Regexp|Array} events 事件名称。可以对多个事件同时进行监听，此时events值可以为数组，包含每个事件名称或匹配事件名称的正则表达式 
		 * @param {String} [modifier] 监听范围。可以是 'public'，'default' 和 'private'。默认为 'default'
		 * @param {function(e, args...)} handler 回调函数。this被绑定到事件监听的W对象上
		 * @returns {W}
		 */
		once: function(events, modifier, handler) {
			var W = this;
			if (handler === undefined) {
				handler = modifier;
				modifier = 'default';
			}
			
			var once_handler = function() {
				W.off(events, once_handler);
				handler.apply(this, arguments);
			};
			W.on(events, modifier, once_handler);
			
			return W;
		}
	};
})());

// *********************************************************************************************************************
// CACHE

W.namespace('cache', (function() {
	
	var Cache = W.Class('Cache', null, {
		
		Cache: function(options) {
			this.capacity = options.capacity || 100;
			this.clear();
		},
		
		clear: function() {
			this.map = {};
			this.head = this.tail = {};
			this.head.next = this.tail;
			this.tail.prev = this.head;
			this.size = 0;
		},
	
		get: function(key) {
			var e = this.map[key];
			if (e === undefined) return undefined;
			
			e.prev.next = e.next;
			e.next.prev = e.prev;
			this._append(e);
			
			return e.value;
		},
		
		put: function(key, value) {
			var e = this.map[key];
			if (e === undefined) {
				e = this.map[key] = {};
			}
			
			e.key = key;
			e.value = value;
			
			this._append(e);
			
			if (this.size == this.capacity) {
				var x = this.head.next; // 待删除节点
				x.prev.next = x.next;
				x.next.prev = x.prev;
				delete this.map[x.key];
			} else {
				this.size++;
			}
			
			return this;
		},
		
		_append: function(e) {
			var tail = this.tail;
			e.prev = tail.prev;
			e.next = tail;
			tail.prev.next = e;
			tail.prev = e;
		}
		
	});
	
	return {
		create: function(options) {
			return new Cache(options || {});
		}
	};
	
})());
	
// *********************************************************************************************************************
// REST

W.extend((function () {
	var DOWNLOAD_PREFIX = 'download/';
	
	var ping_enabled = false; // TODO
	var ping_interval = 10000;
	var ping_timeout;
	
	var ping_handler = function() {
		W.get('ping').done(function() {
			ping_reset();
		});
	};
	
	function ping_reset() {
		if (ping_timeout) {
			window.clearTimeout(ping_timeout);
		}
		if (ping_enabled) {
			ping_timeout = window.setTimeout(ping_handler, ping_interval);
		}
	}
	
	ping_reset();
	
	function handle_error_response(callback, r, t, e) {
		if (r.status === 0) return; // 请求被中止
		
		W.fire(W.Event('status-code', r.status));
		
		try {
			callback.call(this, r);
		} catch (e) {
			W.error(e);
		}
	};
	
	function handle_success_response(callback, data, t, r) {
		if (r.getResponseHeader('OW-Notice') === 'true') {
			W.get('notice').done(function(data) {
				for (var i = 0; i < data.length; i++) {
					W.fire(W.Event(data[i].type, 'notice'), data[i].data);
				}
			});
		}
		
		var file_id = r.getResponseHeader('OW-File-Id');
		
		ping_reset();
		
		try {
			callback.call(this, data, file_id);
		} catch (e) {
			W.error(e);
		}
	};
	
	function resource_to_url(resource) {
		if (/^https?:\/\//.test(resource)) {
			return resource;
		} else {
			var server = E.server;
			if (server && server.substr(-1) != '/') {
				server += '/';
			}
			return server + resource;
		}
	};
	
	function ajax(method, url, data, onsuccess, onerror, referer) {
		var handle_response = Context.bind(function(success) {
			var args = SLICE.call(arguments, 1);
			if (success) {
				args.unshift(onsuccess);
				handle_success_response.apply(this, args);
			} else {
				args.unshift(onerror);
				handle_error_response.apply(this, args);
			}
		});
		
		return $.ajax({
			type: (method === 'DELETE' ? 'PUT' : method),
			url: url,
			contentType: 'application/json',
			data: data,
			async: true,
			cache: false,
			global: !(/^rest\/polling(\?|\/channels$)/.test(url) || url === 'rest/ping' || url === 'rest/notice'),
			beforeSend: function(xhr) {
				xhr.setRequestHeader('OW-Request', method);
				if (referer && E.referer_header) {
					xhr.setRequestHeader(E.referer_header, referer);
				}
			},
			success: handle_response.curry(true),
			error: handle_response.curry(false)
		});
	};
	
	function ajax_cancel_upload(url, file_id, onsuccess, onerror) {
		$.ajax({
			type: 'PUT',
			url: url,
			contentType: 'application/json',
			data: $.toJSON(W.Array(file_id)),
			async: true,
			cache: false,
			global: false,
			beforeSend: function(xhr) {
				xhr.setRequestHeader('OW-Request', 'CANCEL_UPLOAD');
			},
			success: handle_success_response.curry(onsuccess),
			error: handle_error_response.curry(onerror)
		});
	};
	
	function ajax_upload(url, file, onsuccess, onerror, onprogress) {
		var xhr = new XMLHttpRequest;
		
		if (onprogress) {
			xhr.upload.addEventListener('progress', onprogress, false);
		}
		
	    xhr.open('POST', url, true);

	    var requestDone = false;
	    xhr.onreadystatechange = function(isTimeout) {
	    	if (!xhr || xhr.readyState === 0 || isTimeout === "abort") {
				requestDone = true;
				if (xhr) {
					xhr.onreadystatechange = jQuery.noop;
				}
			} else if (!requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout")) {
				requestDone = true;
				xhr.onreadystatechange = jQuery.noop;
				var status = isTimeout === "timeout" ?
					"timeout" :
					xhr.status == 200 ? "success" : "error";

				var errMsg;

				if (status === "success") {
					handle_success_response(onsuccess, $.parseJSON(xhr.responseText), status, xhr);
				} else {
					handle_error_response(onerror, xhr);
				}

				if (isTimeout === "timeout") {
					xhr.abort();
				}
			}
	    };

	    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
	    xhr.setRequestHeader('OW-Request', 'UPLOAD');
	    xhr.setRequestHeader('OW-File-Name', encodeURIComponent(file.name));
	    xhr.setRequestHeader('OW-File-Size', file.size);
	    xhr.send(file);
	};
	
	var method_mapping = {
		'GET': 'get',
		'POST': 'create',
		'PUT': 'update',
		'DELETE': 'remove',
		'UPLOAD': 'upload',
		'CANCEL_UPLOAD': 'cancel_upload',
		'DOWNLOAD': 'download' 
	};
	
	var Resource = W.Class('Resource', null, {
		Resource: function(W, path, param) {
			this.W = W;
			this.path = path;
			this.param = param;
		},
		
		get: function() {
			return this.W.get(this.to_url());
		},
		
		item: function(id) {
			return new Resource(this.path + '/' + id, this.param);
		},
		
		to_url: function() {
			var url = this.path;
			if (this.param) {
				url = url + '?' + W.param(this.param);
			}
			return url;
		}
	});
	
	return /** @lends W.prototype */ {
		Resource: function(path, param) {
			return new Resource(this, path, param);
		},
		
		/**
		 * 查询资源是否支持指定的方法<br><br>
		 * 可以通过{@link W.done}注册回调函数。若所有方法都支持，则调用成功处理的回调函数，否则调用异常处理的回调函数。
		 * @param {String} resource 资源名称
		 * @param {String|Array} methods 方法名称或方法名称列表
		 * @returns {Chain} 
		 */
		allow: function(resource, methods) {
			var W = this, chain = W.Chain(), token = chain.next_token('W.allow');
			$.ajax({
				type: 'OPTIONS',
				url: resource_to_url(resource),
				async: true,
				beforeSend: function(xhr) {
					xhr.setRequestHeader('OW-Request', 'OPTIONS');
				},
				success: function(data, t, r) {
					var allows = r.getResponseHeader('Allow').split(/,\s*/), allows_methods = {};
					for (var i = 0; i < allows.length; i++) {
						allows_methods[method_mapping[allows[i]]] = true;
					}
					if (methods === undefined) {
						chain.yield(token, 'success', allows);
					} else {
						methods = W.Array(methods);
						for (var i = 0; i < methods.length; i++) {
							if (!(methods[i] in allows_methods)) {
								chain.yield(token, 'error');
								return;
							}
						}
						chain.yield(token, 'success');
					}
				},
				error: handle_error_response.curry(function() {
					chain.yield(token, 'error');
				})
			});
			return chain;
		},
		
		/**
		 * 取消文件上传<br><br>
		 * 可以通过{@link W.done}注册回调函数。如果对应的Java方法是正常返回（即用return返回），则调用成功处理的回调函数。如果对应的Java方法抛出异常，则调用异常处理的回调函数。
		 * @param {String} resource 上传资源名称
		 * @param {String} file_id 上传文件ID
		 * @returns {Chain} 
		 */
		cancel_upload: function(resource, file_id) {
			var W = this, chain = W.Chain(), token = chain.next_token('W.cancel_upload');
			ajax_cancel_upload(resource_to_url(resource), file_id, function(data) {
				chain.yield(token, 'success', data);
				W.fire(W.Event(resource, 'cancel_upload'), data);
			}, function(r) {
				var _data;
				try {
					_data = $.evalJSON(r.responseText);
				} catch (e) {
					W.alert(r.status + ' ' + r.statusText + '\n\nW.cancel_upload("' + resource + '", ' + $.toJSON(file_id) + ')');
				}
				chain.yield(token, 'error', _data);
			});
			return chain;
		},
		
		/**
		 * 创建资源<br><br>
		 * 调用此函数后将会发起一个Ajax POST请求，调用服务器端资源的POST接口对应的Java类的方法，并传回返回值。<br><br>
		 * 可以通过{@link W.done}注册回调函数。如果对应的Java方法是正常返回（即用return返回），则调用成功处理的回调函数。如果对应的Java方法抛出异常，则调用异常处理的回调函数。
		 * @param {String} resource 资源名称
		 * @param {mixed} data 新建资源内容
		 * @returns {Chain} 
		 * @example 创建一个用户，完成后显示提示信息
		 * W.create('user', { name: 'abc', password: '123456' }).done({
		 *   success: function() { W.alert('Success'); },
		 *   error: function(ex) { W.alert('Failed: ' + ex.message); }
		 * });
		 */
		create: function(resource, data) {
			var W = this, chain = W.Chain(), token = chain.next_token('W.create', function() {
				xhr && xhr.readyState !== 4 && xhr.abort();
			});
			
			var xhr = ajax(
				'POST', resource_to_url(resource), data === undefined ? null : $.toJSON(data), 
				function(result) {
					chain.yield(token, 'success', result);
					W.fire(W.Event(resource, 'create'), result, data);
				}, 
				function(xhr) {
					var result;
					try {
						result = $.evalJSON(xhr.responseText);
					} catch (e) {
						var args = ['"' + resource + '"'];
						if (data !== undefined) args.push($.toJSON(data));
						W.alert(xhr.status + ' ' + xhr.statusText + '\n\nW.create(' + args.join(', ') + ')');
					}
					chain.yield(token, 'error', result, data);
				}, 
				W.layout.path
			);
			
			return chain;
		},
		
		/**
		 * 下载文件<br><br>
		 * @param {String} resource 下载资源名称
		 * @returns {W} this 
		 */
		download: function(resource) {
			// FIXME
			window.location.href = DOWNLOAD_PREFIX + resource;
			return this;
		},
		
		/**
		 * 获取资源<br><br>
		 * 调用此函数后将会发起一个Ajax GET请求，调用服务器端资源的GET接口对应的Java类的方法，并传回返回值。<br><br>
		 * 可以通过{@link W.done}注册回调函数。如果对应的Java方法是正常返回（即用return返回），则调用成功处理的回调函数。如果对应的Java方法抛出异常，则调用异常处理的回调函数。
		 * @param {String} resource 资源名称。可以带查询字符串，用"?"分隔，如"users?name=123"
		 * @returns {Chain} 
		 * @example 获取所有名称中包含"123"的用户，并输出总数
		 * W.get('users?searchName=123').done(function(users) {
		 *   W.alert('Total: ' + users.length);
		 * });
		 */
		get: function(resource) {
			var W = this, chain = W.Chain(), token = chain.next_token('W.get', function() {
				xhr && xhr.readyState !== 4 && xhr.abort();
			});
			
			var xhr = ajax(
				'GET', resource_to_url(resource), null, 
				function(result) {
					chain.yield(token, 'success', result);
					W.fire(W.Event(resource, 'get'), result);
				}, 
				function(xhr) {
					var result;
					try {
						result = $.evalJSON(xhr.responseText);
					} catch (e) {
						W.alert(xhr.status + ' ' + xhr.statusText + '\n\nW.get("' + resource + '")');
					}
					chain.yield(token, 'error', result);
				}, 
				W.layout.path
			);
			
			return chain;
		},
		
		/**
		 * 删除资源<br><br>
		 * 调用此函数后将会发起一个Ajax PUT请求，调用服务器端资源的DELETE接口对应的Java类的方法，并传回返回值。<br><br>
		 * 批量删除从语义上等于根据资源id的列表，创建一个匿名资源（资源集合），然后再其删除。因此是一个POST操作和一个DELETE操作的组合。由于DELETE具有等幂性，而POST不具有，另外DELETE不支持请求携带正文，所以在实际实现中，用具有等幂性并可携带正文的PUT来替代这个POST + DELETE的组合操作。<br><br>
		 * 可以通过{@link W.done}注册回调函数。如果对应的Java方法是正常返回（即用return返回），则调用成功处理的回调函数。如果对应的Java方法抛出异常，则调用异常处理的回调函数。
		 * @param {String} resource 资源名称
		 * @returns {Chain} 
		 * @example 删除id=1的用户
		 * var id = 1;
		 * W.remove('user/' + id).done(function() {
		 *   W.alert('Success');
		 * });
		 * @example 批量删除id为1，2，3的用户
		 * var ids = [1, 2, 3];
		 * W.remove('users', ids).done(function() {
		 *   W.alert('Success');
		 * });
		 */
		remove: function(resource, data) {
			var W = this, chain = W.Chain(), token = chain.next_token('W.remove', function() {
				xhr && xhr.readyState !== 4 && xhr.abort();
			});
			
			var xhr = ajax(
				'DELETE', resource_to_url(resource), data === undefined ? null : $.toJSON(data), 
				function(result) {
					chain.yield(token, 'success', result);
					W.fire(W.Event(resource, 'remove'), result, data);
				}, 
				function(xhr) {
					var result;
					try {
						result = $.evalJSON(xhr.responseText);
					} catch (e) {
						var args = ['"' + resource + '"'];
						if (data !== undefined) args.push($.toJSON(data));
						W.alert(xhr.status + ' ' + xhr.statusText + '\n\nW.remove(' + args.join(', ') + ')');
					}
					chain.yield(token, 'error', result, data);
				}, 
				W.layout.path
			);
			
			return chain;
		},
		
		/**
		 * 更新资源<br><br>
		 * 调用此函数后将会发起一个Ajax PUT请求，调用服务器端资源的PUT接口对应的 Java 类的方法，并传回返回值。<br><br>
		 * 可以通过{@link W.done}注册回调函数。如果对应的Java方法是正常返回（即用return返回），则调用成功处理的回调函数。如果对应的Java方法抛出异常，则调用异常处理的回调函数。
		 * @param {String} resource 资源名称
		 * @returns {Chain} 
		 * @example 更新id=1的用户
		 * var id = 1;
		 * W.update('user/' + id, { name: 'abc', password: '123456' }).done(function() {
		 *   W.alert('Success');
		 * });
		 */
		update: function(resource, data) {
			var W = this, chain = W.Chain(), token = chain.next_token('W.update', function() {
				xhr && xhr.readyState !== 4 && xhr.abort();
			});
			
			var xhr = ajax(
				'PUT', resource_to_url(resource), data === undefined ? null : $.toJSON(data), 
				function(result) {
					chain.yield(token, 'success', result);
					W.fire(W.Event(resource, 'update'), result, data);
				}, 
				function(xhr) {
					var result;
					try {
						result = $.evalJSON(xhr.responseText);
					} catch (e) {
						var args = ['"' + resource + '"'];
						if (data !== undefined) args.push($.toJSON(data));
						W.alert(xhr.status + ' ' + xhr.statusText + '\n\nW.update(' + args.join(', ') + ')');
					}
					chain.yield(token, 'error', result, data);
				}, 
				W.layout.path
			);
			
			return chain;
		},
		
		/**
		 * 文件上传<br><br>
		 * 可以通过{@link W.done}注册回调函数。如果对应的Java方法是正常返回（即用return返回），则调用成功处理的回调函数。如果对应的Java方法抛出异常，则调用异常处理的回调函数。
		 * @param {String} resource 上传资源名称
		 * @param {File} file 上传文件
		 * @param {function} onprogress 上传进度监听函数
		 * @returns {Chain} 
		 */
		upload: function(resource, file, onprogress) {
			var W = this, chain = W.Chain(), token = chain.next_token('W.upload');
			ajax_upload(resource_to_url(resource), file, function(data, file_id) {
				chain.yield(token, 'success', data, file_id);
				W.fire(W.Event(resource, 'upload'), data, file_id);
			}, function(r) {
				var _data;
				try {
					_data = $.evalJSON(r.responseText);
				} catch (e) {
					W.alert(r.status + ' ' + r.statusText + '\n\nW.upload("' + resource + '", file, onprogress)');
				}
				chain.yield(token, 'error', _data);
			}, onprogress);
			return chain;
		}
	};
})());

// *********************************************************************************************************************
// POLLING

W.extend((function() {
	var POLLING = EXPANDO.POLLING;
	
	var polling_time = 0;
	var polling_timeout;
	
	var polling_handler = function() {
		var W = this;
		W.get('polling?' + polling_time).done(function(polling_result) {
			polling_time = polling_result.time;
			
			var empty = true;
			for (var resource in polling_result.result) {
				empty = false;
				var data = polling_result.result[resource];
				if (data != null) {
					W.fire(W.Event(resource, 'get'), data);
				}
			}
			if (!empty) {
				polling_timeout = window.setTimeout(polling_handler.bind(W), E.polling_interval);
			} else {
				polling_timeout = null;
			}
		});
	};
	
	var global_polling_resources = W.global_polling_resources = {};
	
	// 为了防止调用多次 polling 时发送多个 update polling/channels 请求，将请求 polling 资源加入到队列，由一个 setTimeout 来统一处理

	// 开始 polling 资源队列
	var queue_insert = []; 
	
	// 结束 polling 资源队列
	var queue_remove = []; 
	
	// 处理 polling 资源队列的 setTimeout
	var queue_timeout;
	
	var start_queue_timeout = function() {
		// 判断当前是否存在处理 polling 资源队列的 setTimeout，仅不存在才创建
		if (!queue_timeout) {
			queue_timeout = window.setTimeout(function() {
				while (resource = queue_insert.shift()) {
					global_polling_resources[resource] = (global_polling_resources[resource] || 0) + 1;
				}
				
				while (resource = queue_remove.shift()) {
					var count = (global_polling_resources[resource] || 0) - 1;
					if (count > 0) {
						global_polling_resources[resource] = count;
					} else {
						delete global_polling_resources[resource];
					}
				}
				
				var resources = [];
				for (var resource in global_polling_resources) resources.push(resource);
				
				W.update('polling/channels', resources).done(function() {
					if (polling_timeout) {
						window.clearTimeout(polling_timeout);
					}
					polling_timeout = window.setTimeout(polling_handler.bind(W), 0);
				});
				
				queue_timeout = false;
			}, 0);
		}
	};
	
	return /** @lends W.prototype */ {
		
		/**
		 * 轮询资源<br><br>
		 * 逻辑上等价于不停调用{@link W.get}来获取资源。通过监听资源的:get事件来处理轮询结果。<br><br>
		 * @param {String} resource 资源名称。可以带查询字符串，用"?"分隔，如"users?name=123"
		 * @returns {W} this 
		 * @example 检查新邮件
		 * W.polling('new-mail');
		 * W.on('new-mail:get', 'public', function(e, mail) {
		 *   W.alert('新邮件：' + mail.title);
		 * });
		 */
		polling: function(resource) {
			var W = this;
			
			if (resource !== undefined) {
				queue_insert.push(resource);
				
				var polling_resources = W.expando(POLLING);
				if (!polling_resources) {
					W.expando(POLLING, polling_resources = []);
				}
				polling_resources.push(resource);
				
				start_queue_timeout();
			}
			
			return W;
		},
	
		stop_polling: function() {
			var W = this;
			
			var polling_resources = W.expando(POLLING);
			if (polling_resources && polling_resources.length) {
				for (var i = 0; i < polling_resources.length; i++) {
					queue_remove.push(polling_resources[i]);
				}
				start_queue_timeout();
			}
			
			W.remove_expando(POLLING);
			
			return W;
		}
	};
	
})());

// *********************************************************************************************************************
// MOCK

W.extend((function() {
	var handlers = {};
	var wildcard_create_handlers = [], wildcard_get_handlers = [], wildcard_remove_handlers = [], wildcard_update_handlers = [];
	
	var origin_methods = {
		create: W.create,
		get: W.get,
		remove: W.remove,
		update: W.update
	};
	
	var RECORD_HANDLER = function(event_type, wildcard_handlers, resource, return_value, async) {
		var handler = W.is_function(return_value) ? return_value : function() {
			return return_value;
		};
		if (async) {
			handler._async = true;
		}
		if (W.is_regexp(resource)) {
			wildcard_handlers.push({ resource: resource, handler: handler });
		} else {
			handlers[W.Event(resource, event_type)] = handler; 
		}
		return this;
	};
	
	var mock_record = {
		create: RECORD_HANDLER.curry('create', wildcard_create_handlers),
		get: RECORD_HANDLER.curry('get', wildcard_get_handlers),
		remove: RECORD_HANDLER.curry('remove', wildcard_remove_handlers),
		update: RECORD_HANDLER.curry('update', wildcard_update_handlers)
	};
	
	var REPLAY_HANDLER = function(event_type, wildcard_handlers, resource) {
		var W = this, event = W.Event(resource, event_type), args = SLICE.call(arguments, 3), handler = handlers[event];
		if (!handler) {
			for (var i = 0; i < wildcard_handlers.length; i++) {
				var wildcard_handler = wildcard_handlers[i];
				var m = wildcard_handler.resource.exec(resource);
				if (m) {
					m.shift();
					args = args.concat(m);
					handler = wildcard_handler.handler;
					break;
				}
			}
		}
		
		if (handler) {
			var chain = W.Chain(), token = chain.next_token();
			W.later(function() {
				if (handler._async) {
					args.unshift(function(data) {
						chain.yield(token, 'success', data);
						W.fire(event, data);
					});
					handler.apply(W, args);
				} else {
					var data = handler.apply(W, args);
					chain.yield(token, 'success', data);
					W.fire(event, data);
				}
			});
			return chain;
		} else {
			return origin_methods[event_type].apply(W, SLICE.call(arguments, 2));
		}
	};
	
	var mock_replay = {
		create: REPLAY_HANDLER.curry('create', wildcard_create_handlers),
		get: REPLAY_HANDLER.curry('get', wildcard_get_handlers),
		remove: REPLAY_HANDLER.curry('remove', wildcard_remove_handlers),
		update: REPLAY_HANDLER.curry('update', wildcard_update_handlers)
	};
	
	return W.extend({ mock: mock_record }, mock_replay);
})());

W.mock.get('debug/options', function() {
	return W.extend({}, E);
});

W.mock.update('debug/options', function(options) {
	W.extend(E, { context_debug_enabled: false, event_debug_enabled: false, render_debug_enabled: false }, options);
	sessionStorage.setItem('W.env', JSON.stringify(E));
	return true;
});

// *********************************************************************************************************************
// TEMPLATE

(function() {
	
var UUID = 0;

var compile_text = function(source) {
	return source.replace(/\\/g, '\\\\').replace(/\r*\n/g, '\\n').replace(/"/g,  '\\"');
};
	
var compile_interpolation = function(source) {
	var script = [];
	var cursor = 0;
	while (cursor < source.length) {
		var begin = source.indexOf('${', cursor);
		if (begin >= 0) {
			var end = source.indexOf('}', begin + 2);
			var expression = source.substring(begin + 2, end);
			if (cursor < begin) {
				script.push('_OUT.push("' + compile_text(source.substring(cursor, begin)) + '");');
			}
			script.push('_OUT.push(' + expression + ');'); // FIXME
			cursor = end + 1;
		} else {
			script.push('_OUT.push("' + compile_text(source.substring(cursor, source.length)) + '");');
			break;
		}
	}
	return script;
};

var compile_directive = function(source) {
	var i = source.indexOf(' ');		
	var script = [], 
		tag = i == -1 ? source : source.substring(0, i), 
		rest = i == -1 ? null : source.substring(i + 1);
	switch (tag) {
	case '#assign': {
		script.push('var ' + rest + ';');
		break;
	}
	case '#if': {
		script.push('if (' + rest.from_html() + ') {');
		break;
	}
	case '/#if': {
		script.push('}');
		break;
	}
	case '#else': {
		script.push('} else {');
		break;
	}
	case '#elseif': {
		script.push('} else if (' + rest.from_html() + ') {');
		break;
	}
	case '#list': {
		var m = /^\s*(.*)\s+as\s+(\w+)\s*$/.exec(rest), id = UUID++;
		if (m) {
			var index = m[2] + '_index', has_next = m[2] + '_has_next';
			script.push('for (var ' + index + '=0,_A' + id + '=' + m[1] + ',_N' + id + '=_A' + id + '.length-1,' + has_next + ';' + has_next + '=' + index + '<_N' + id + ',' + index + '<=_N' + id + ';' + index + '++) {');
			script.push('var ' + m[2] + '=_A' + id + '[' + index + '];');
		} else {
			throw '无法解析的 #list 指令：' + source;
		}
		break;
	}
	case '/#list': {
		script.push('}');
		break;
	}
	case '#break': {
		script.push('break;');
		break;
	};
	case '#ftl': { break; }
	default: {
		throw '未知的模板指令：' + tag;
	}
	}
	return script;
};

var compile_macro = function(source) {
	var i = source.indexOf(' ');		
	var tag = i == -1 ? source : source.substring(0, i), 
		rest = i == -1 ? null : source.substring(i + 1).trim();
	return ['eval(window.MACRO["' + tag + '"](' + (rest ? '"' + rest.replace(/"/g, '\\"').replace(/\\(?!")/g, '\\\\') + '"' : '') + '));'];
};

var DIRECTIVE_PATTERN = /<#|<\/#|<@|#{/g;

var search_end = function(source, index, begin_ch, end_ch) {
	var length = source.length, n = 1;
	outer:
	while (index < length) {
		switch (source.charAt(index)) {
			case begin_ch: { ++n; break; }
			case end_ch: { if (--n == 0) break outer; else break; }
		}
		index++;
	}
	if (index >= length) throw '找不到匹配的结束字符："' + end_ch + '"';
	return index + 1;
};

var trim_begin = function(source, begin) {
	var index = begin;
	while (index >= 0) {
		var ch = source.charAt(index);
		if (ch == "\n") return index + 1;
		if (ch != " " && ch != "\t") break;
		index--;
	}
	return begin;
};

var trim_end = function(source, end) {
	var index = end, length = source.length;
	while (index < length) {
		var ch = source.charAt(index);
		if (ch == "\n") return index + 1;
		if (ch != " " && ch != "\t" && ch != "\r") break;
		index++;
	}
	return index;
};

var compile = function(source) {
	var source = source.replace(/<#--(?:.|\r|\n)*?-->(?:\r?\n)?/g, ''); // 去除注释
	var script = []; // 模板编译后生成的 javascript 代码
	
	script.push('var _OUT = [];');
	script.push('with (_CONTEXT || {}) {');
	
	DIRECTIVE_PATTERN.lastIndex = 0;
	var cursor = 0;
	while (true) {
		var m = DIRECTIVE_PATTERN.exec(source);
		if (m) {
			switch (m[0]) {
			case '<#':
			case '</#': { // 模板指令
				var begin = m.index, end = search_end(source, begin + m[0].length, '<', '>');
				if (begin > cursor) {
					script = script.concat(compile_interpolation(source.substring(cursor, trim_begin(source, begin))));
				}
				script = script.concat(compile_directive(source.substring(begin + 1, end - 1)));
				cursor = trim_end(source, end);
				break;
			}
			case '<@': { // 宏
				var begin = m.index, end = search_end(source, m.index + 2, '<', '>');
				if (begin > cursor) {
					script = script.concat(compile_interpolation(source.substring(cursor, trim_begin(source, begin))));
				}
				if (source.charAt(end - 2) == '/') {
					script = script.concat(compile_macro(source.substring(begin + 2, end - 2)));
				} else {
					// TODO
				}
				cursor = trim_end(source, end);
				break;
			}
			case '#{': { // 数据绑定模板
				var begin = m.index, end = search_end(source, begin + 2, '{', '}');
				if (begin > cursor) {
					script = script.concat(compile_interpolation(source.substring(cursor, trim_begin(source, begin))));
				}
				script = script.concat('_OUT.push("' + compile_text(source.substring(begin, end)) + '");');
				cursor = end;
				break;
			}
			}
			DIRECTIVE_PATTERN.lastIndex = cursor;
		} else {
			script = script.concat(compile_interpolation(source.substring(cursor, source.length)));
			break;
		}
	}
	
	script.push('}');
	script.push('return _OUT.join("");');

	try {
		return new Function('_CONTEXT', script.join('\n'));
	} catch (e) {
		W.error('模板编译失败：' + e.message + '\n' + source);
		return NOOP;
	}
};

W.template_engine = {
	compile: compile
};

window.MACRO = {
	add_class: function(expression) {
		return '_NODE.add_class(' + expression + ')';
	},
		
	style: function(expression) {
		return '_NODE.css(' + expression + ')';
	}
};

})();

// *********************************************************************************************************************
// DOM

W.extend((function () {
	var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var EXPANDO_KEY = 'W_EXPANDO';
	var PATH_POSTFIX = '.html';
	var R_SCRIPT = /<script[^<]*?>((.|\s)*?)<\/script>/gi;
	var SELF = function(obj) { return obj; };
	var TEMPLATE_HEADER = '<#ftl>';
	
	var Layout = W.Class('Layout', null, {
		Layout: function(id, W, parent) {
			this.id = id;
			this.W = W;
			this.parent = parent;
		},
		
		actual_id: function(id) {
			return 'w-' + this.id + '-' + id;
		},
		
		finalize: function() {
			var children = this.children, parent = this.parent;
			if (children) {
				W.each(children, function() { this.finalize(); });
			}
			if (parent) {
				delete parent[this.id];
			}
			
			if (this.loading_chain) {
				W.warn("窗口载入被中止", this);
				this.loading_chain.abort();
			}
		},
		
		initialize: function() {
			var parent = this.parent;
			if (parent) {
				var children = parent.children = parent.children || {};
				children[this.id] && children[this.id].finalize();
				children[this.id] = this;
			}
		}
	});
	
	W.extend(Layout.prototype, {
		actual_id: function(id) {
			return 'w-' + this.id + '-' + id;
		}
	});
	
	W.extend(W, {
		type: 'container',			// 根W的类型为容器
		layout: new Layout('', W)	// 根W的布局
	});
	
	var template_engine = W.template_engine;
	
	W.define_property('widget', {
		get: function() {
			return this.expando(EXPANDO.WIDGET);
		},
		set: function(value) {
			this.expando(EXPANDO.WIDGET, value);
		}
	});
	
	return /** @lends W.prototype */ {
		/**
		 * 获得窗口中指定ID的元素的W对象
		 * @param {String} id 元素ID
		 * @returns {W} 对应到该元素的W实例
		 */
		$: function(id) {
			var layout = this.layout; 
			var W;
			
			if (typeof id === 'string') {
				var actual_id = layout.actual_id(id);
				var node = $('#' + actual_id);
				W = new C(layout.W, node);
			} else {
				// 当参数不为字符串时，作为 DOM 元素或 jQuery 对象来处理
				W = new C(layout.W, $(id));
			}
			
			W.layout = layout;
			
			return W;
		},
		
		$$: function(id) {
			return W.$($('#' + id));
		},
		
		add_class: function(className) {
			this.node.addClass(className);
			return this;
		},
		
		/**
		 * 设置或读取元素属性值
		 * @param {String} name 属性名
		 * @param {mixed} [value] 属性值。需要读取时，省略此参数
		 * @returns {mixed} 获取时，返回元素属性值；设置时，返回this
		 */
		attr: function(name, value) {
			if (arguments.length == 1) {
				return this.node.attr(name);
			} else {
				this.node.attr(name, value);
				return this;
			}
		},
		
		attrs: function(values) {
			if (arguments.length == 0) {
				var result = {};
				var attrs = this.node[0].attributes;
				for (var i = 0; i < attrs.length; i++) {
					result[attrs[i].name] = attrs[i].value;
				}
				return result;
			} else {
				this.node.attr(values);
				return this;
			}
		},
		
		clone: function(obj) {
			if (arguments.length == 0) {
				obj = this;
			}
			
			if (obj instanceof $) {
				var new_obj = obj.clone(true);
				
				var expando = $.data(obj[0], EXPANDO_KEY);
				if (expando) {
					$.data(new_obj[0], EXPANDO_KEY, W.extend({}, expando));
				}
					
				return new_obj;
			}
			
			// TODO
		},
		
		/**
		 * 设置或读取元素样式
		 * @param {String} name 样式名
		 * @param {mixed} [value] 样式值。需要读取时，省略此参数
		 * @returns {mixed} 获取时，返回元素样式值；设置时，返回this
		 */
		css: function(name, value) {
			if (value === undefined && typeof name === 'string') {
				return this.node.css(name);
			} else {
				this.node.css.apply(this.node, arguments);
				return this;
			}
		},
		
		disable: function() {
			var W = this, widget = W.widget;
			if (widget && widget.disable) {
				widget.disable();
			} else {
				W.prop('disabled', true).add_class('ui-state-disabled');
			}
			return W;
		},
		
		enable: function() {
			var W = this, widget = W.widget;
			if (widget && widget.enable) {
				widget.enable();
			} else {
				W.prop('disabled', false).remove_class('ui-state-disabled');
			}
			return W;
		},
		
		/**
		 * 设置或读取元素扩展数据
		 * @param {String} name 扩展数据键名
		 * @param {mixed} [value] 扩展数据值。需要读取时，省略此参数
		 * @returns {mixed} 获取时，返回元素扩展数据值；设置时，返回this
		 */
		expando: function(name, value) {
			// 扩展数据通过jQuery Data API关联至DOM元素
			// 出于性能考虑，使用_expando属性保持到扩展数据的引用
			
			var W = this, expando = W._expando;
			
			// 初始化扩展数据
			if (expando == null) {
				var node = W.node[0];
				if (node === undefined) {
					return arguments.length == 1 ? undefined : W;
				}
				
				expando = $.data(node, EXPANDO_KEY);
				if (expando == null) {
					// DOM元素上无扩展数据
					// 如果是读取，则直接返回undefined，并设置标志
					if (arguments.length == 1) {
						W._expando = {};
						W._expando_empty = true;
						return undefined;
					}
					
					// 如果是写入，则绑定空的扩展数据
					expando = {};
					$.data(node, EXPANDO_KEY, expando);
				}
				W._expando = expando;
			}
			
			if (arguments.length == 1) {
				// W.expando(name)
				return expando[name];
			} else {
				// W.expando(name, value)
				expando[name] = value;
				
				if (W._expando_empty) {
					$.data(W.node[0], EXPANDO_KEY, expando);
					delete W._expando_empty;
				}
				
				return W;
			}
		},
		
		find: function(selector) {
			return this.$(this.node.find(selector));
		},
		
		/**
		 * 将元素设置为浏览器焦点
		 * @returns {W} this
		 */
		focus: function() {
			this.node.focus();
			return this;
		},
		
		has_class: function(className) {
			return this.node.hasClass(className);
		},
		
		/**
		 * 设置或读取元素高度
		 * @param {number} [value] 高度值。需要读取时，省略此参数
		 * @returns {mixed} 获取时，返回元素高度值；设置时，返回this
		 */
		height: function(value) {
			if (value === undefined) {
				return this.node.height();
			} else {
				this.node.height(value);
				return this;
			}
		},
		
		/**
		 * 隐藏元素
		 * @returns {W} this
		 */
		hide: function() {
			this.node.hide();
			return this;
		},
		
		_import: (function() {
			var all_imports = {};
			return function() {
				var imports = SLICE.call(arguments);
				if (imports.length) {
					var f = function() {
						import_count--;
						
						while (imports.length) {
							var _import = imports.shift();
							if (!_import || all_imports[_import]) continue;
							
							import_count++;
							
							all_imports[_import] = true;
							
							var s = document.createElement('script');
							s.setAttribute('type', 'text/javascript');
							s.setAttribute('src', _import);
							s.onload = f;
							
							var head = document.getElementsByTagName('head')[0];
							head.appendChild(s);
							
							return;
						}
						
						onready();
					};
					
					import_count++;
					f();
				}
				return this;
			};
		})(),
		
		inner: function() {
			var W = this, node = W.node, id = node.attr('id');
			
			// 若不存在 id，生成一个
			if (!id) {
				id = W.unique_id();
				node.attr('id', W.layout.actual_id(id));
			} else {
				var m = /^w-(\w\w)*-(.+)$/.exec(id);
				id = m[2];
			}
			
			var hash = Math.abs(id.hash() % 3844); // 哈希值可能是负数，负数%正数=负数，会导致下面转换成双字符时出错，所以这里取个绝对值
			
			var inner = new C(W, node),
				inner_layout_id = W.layout.id + CHARS.charAt(hash / 62) + CHARS.charAt(hash % 62);
			inner.layout = new Layout(inner_layout_id, inner, W.layout);
			inner.type = 'container';
			
			return inner;
		},
		
		is_disabled: function() {
			var W = this, widget = W.widget;
			if (widget && widget.is_disabled) {
				return widget.is_disabled();
			} else {
				return W.prop('disabled');
			}
		},
		
		/**
		 * 在容器元素中载入新窗口
		 * @param {String} path 窗口路径
		 * @param [args...] 窗口参数
		 * @returns {Chain}
		 */
		load: (function() {
			var worker = typeof Worker !== 'undefined' && new Worker('js/w-worker.js');
			var worker_handler_sequence = 0;
			var worker_handlers = {};
			
			if (worker) {
				worker.onmessage = function(e) {
					var result = e.data, id = result.id;
					worker_handlers[id](result.var_names);
					delete worker_handlers[id];
				};
				
				worker.onerror = function() {
					W.error(arguments);
				};
			}
			
			function parse_var_names(scripts, handler) {
				var id = worker_handler_sequence++;
				worker_handlers[id] = Context.bind(handler);
				worker.postMessage({ id: id, scripts: scripts });
			}
			
			/**
			 * 窗口元素的前置渲染，这将:
			 * 1. 发起一个AJAX GET请求，获取窗口的html文件
			 * 2. 如果html文件的内容是模板，交由模板引擎进行解析，编译和渲染
			 * 3. 将最终的html片段插入DOM
			 */
			function render_precede(W, options) {
				var continuation = function(html) {
					/**
					 * 1. 根据窗口元数据，构建窗口变量
					 * 
					 * html: <!-- @meta var="a,b" -->
					 * args: [1, 2]
					 * =>
					 * vars: { a: 1, b: 2 } 
					 */
					
					// 窗口范围内所有变量，变量名 -> 变量值
					var vars = W.layout.vars = { W: W };
					
					// 窗口元数据
					var meta = W.meta = W.Meta(html);
					
					// 构建窗口变量
					var var_def = meta['var'];
					if (var_def) {
						if (var_def == '*') {
							W.extend(vars, options.args[0]);
						} else {
							var_def = var_def.split(/,\s*/);
							for (var i = 0; i < var_def.length; i++) {
								vars[var_def[i].trim()] = options.args[i];
							}
						}
					}
					
					/**
					 * 2. 检查文本内容是否为模板，若是，交由模板引擎进行渲染
					 * 
					 * html: 
					 * <#ftl>
					 * <!-- @meta var="a,b" -->
					 * a=${a}, b=${b}
					 * 
					 * vars: { a: 1, b: 2}
					 * =>
					 * html:
					 * <!-- @meta var="a,b" -->
					 * a=1, b=2
					 */
					if (html) {
						if (html.indexOf(TEMPLATE_HEADER) === 0) {
							// 检测到模板标志，去除首行的模板标志
							html = html.substring(TEMPLATE_HEADER.length).replace(/^\r*\n/, '');
							
							// 编译模板并渲染
							try {
								html = (template_engine.compile(html))(vars);
							} catch (e) {
								W.error(e);
							}
							
							// 窗口元数据更新为模板渲染后的结果
							meta = W.meta = W.Meta(html);
						}
					}
					
					if (!html) {
						W.warn('template_handler: 页面内容为空');
						chain.yield(token, 'success');
					}
					
					/**
					 * 3. 分离文本中的代码部分，解析出其中的窗口变量
					 * 
					 * html:
					 * <div>...</div>
					 * <script>var x = 1;</script>
					 * 
					 * =>
					 * html:
					 * <div>...</div>
					 * 
					 * scripts = ["var x = 1;"]
					 * vars = { x: undefined }
					 */
					
					var scripts = [];
					
					// FIXME: 这里会把用html注释<!-- -->中的<script>也取出来
					html = html.replace(R_SCRIPT, function($0, $1) {
						scripts.push($1);
						return '';
					});
					
					var use_worker = false;
					
					if (scripts.length) {
						if (worker) {
							use_worker = true;
							parse_var_names(scripts, function(var_names) {
								for (var i = 0; i < var_names.length; i++) {
									var name = var_names[i];
									if (!vars.hasOwnProperty(name)) {
										vars[name] = undefined;
									}
								}
								
								chain.yield(token, 'success');
							});
						} else {
							for (var i = 0; i < scripts.length; i++) {
								var ast = jsp.parse('(function(){' + scripts[i] + '})');
								var ast_walker = pro.ast_walker();
								var first = true;
								ast_walker.with_walkers({
									'function': function() {
										if (first) {
											first = false;
										} else {
											return false;
										}
									},
									'var': function(defs) {
										for (var j = 0; j < defs.length; j++) {
											var name = defs[j][0];
											if (!vars.hasOwnProperty(name)) {
												vars[name] = undefined;
											}
										}
									}
								}, function() {
									ast_walker.walk(ast);
								});
							}
						}
					}
					
					/**
					 * 4. 处理延迟绑定模板
					 * 
					 * 延迟绑定模板从'#{'开始，到'}'结束，会被替换成html注释的形式。如: 
					 * 替换前: <p>#{...}</p>
					 * 替换后: <p><!--#{...}--></p>
					 */
					var html_fragments = [];
					var cursor = 0, length = html.length;
					while (cursor < length) {
						var begin = html.indexOf('#{', cursor);
						if (begin >= 0) {
							var end = begin + 2, n = 1;
							outer:
							while (end < length) {
								switch (html.charAt(end)) {
								case '{': { n++; break; }
								case '}': {
									if (--n == 0) {
										break outer;
									}
									break;
								}
								}
								end++;
							}
							if (end == length) {
								W.error('找不到匹配的结束字符："}"');
								return;
							}
							html_fragments.push(html.substring(cursor, begin));
							html_fragments.push('<!--#{' + html.substring(begin + 2, end).to_html() + '}-->');
							cursor = end + 1;
						} else {
							html_fragments.push(html.substring(cursor, length));
							cursor = length;
						}
					}
					
					// 处理完延迟绑定模板后的文本内容
					html = html_fragments.join('');
					
					/**
					 * 5. 设置窗口内容，处理延迟渲染模板和窗口元素隔离
					 */
					var node = W.node;
					node.addClass('ui-rendering').html(html);
					
					function visit_comment(node, callback) {
						if (node.nodeType == 8) {
							callback(node);
							return;
						}
						if (node.hasChildNodes()) {
							var children = node.childNodes;
							for (var i = 0; i < children.length; i++) {
								visit_comment(children.item(i), callback);
							}
						}
					}
					
					visit_comment(node[0], function(e) {
						var elem = $(e), text = e.data;
						
						// 忽略普通注释
						if (!/^#\{(.|\s)*\}$/.test(text)) return;
						
						text = text.from_html();
						
						// 预编译延迟渲染模板
						var template = window.W.template_engine.compile(text.substring(2, text.length - 1));
						
						// 编译后结果存放在父节点上，因为comment节点无法存放数据
						var parent = W.$(elem.parent());
						var templates = parent.expando(EXPANDO.TEMPLATES);
						if (!templates) {
							parent.expando(EXPANDO.TEMPLATES, templates = []);
						}
						var index = templates.length;
						templates.push(template);
						
						// 将原注释替换成两个注释元素，以便之后渲染时在其中间插入生成元素
						// <!--{模板代码}-->
						// 替换成：
						// <!--tpl#序号--><!--tpl#序号-->
						var boundary = 'tpl#' + index;
						e.data = boundary;
						elem.after('<!--' + boundary + '-->');
					});
					
					var layout = W.layout;
					
					// 隔离处理开始，隔离是为了防止各窗口间元素可能的冲突
					
					var ids = [];
					
					// 替换所有元素的id
					$('*[id]', node).each(function(i, e) {
						var id = e.getAttribute('id');
						e.setAttribute('id', layout.actual_id(id));
						
						ids.push(id);
					});
					
					// 替换所有的label元素的for属性
					$('label[for]', node).each(function(i, e) {
						e.setAttribute('for', layout.actual_id(e.getAttribute('for')));
					});
					
					// TODO: input:radio[name]也需要进行隔离处理
					
					// 隔离处理结束
					
					options._scripts = scripts;
					options._ids = ids;
					
					if (use_worker) return;
					
					chain.yield(token, 'success');
				};
				
				var chain = W.Chain(), token = chain.next_token('W.load:precede', function() {
					xhr && xhr.readyState !== 4 && xhr.abort();
				});
				
				var xhr;
				
				if ('source' in options) {
					Context.execute(function() {
						continuation(options.source);
					});
				} else {
					xhr = $.ajax({
						type: 'GET',
						url: options.path + PATH_POSTFIX,
						dataType: 'text',
						cache: true,
						global: false,
						success: Context.bind(continuation)
					});
				}
				
				return chain;
			}
			
			/**
			 * 窗口元素的标准渲染，这将:
			 * 1. 渲染窗口布局
			 * 2. 构建窗口代码并执行，进行窗口内部的渲染
			 */
			function render_standard(W, options) {
				var scripts = options._scripts, ids = options._ids;
				
				var extern = options.extern;

				// 标准布局渲染
				var node = W.node;
				
				var header = node.children('header').addClass('ui-layout-north');
				var footer = node.children('footer').addClass('ui-layout-south');
				var nav = node.children('nav').addClass('ui-layout-west');
				var aside = node.children('aside').addClass('ui-layout-east');
				
				var content = node.children(':not(header,footer,nav,aside)');
				if (content.length === 1 && (header.length/* + footer.length*/ + nav.length + aside.length) === 0) {
					content.addClass('ui-fit');
				}
				
				var extern_nodes;
				
				if (extern) {
					extern.meta(W.meta);
					extern_nodes = extern.render(content, header, footer, nav, aside);
				}
				
				var layout;
				if (header.length || footer.length || nav.length || aside.length) {
					if (content.length == 1) {
						content.addClass("ui-layout-center");
					} else {
						content.wrapAll('<div class="ui-layout-center" />');
					}
					
					var header_height = header.css('height');
					var footer_height = footer.css('height');
//					var nav_width = nav.css('width');
//					var aside_width = aside.css('width');
					
					// FIXME
					layout = node.layout({ 
						applyDefaultStyles: false,
						scrollToBookmarkOnLoad: false,
						north__size: header_height ? parseInt(header_height) : 'auto',
						south__size: footer_height ? parseInt(footer_height) : 'auto'
//						west__size: nav_width ? parseInt(nav_width) : 200,
//						east__size: aside_width ? parseInt(aside_width) : 200
					});
				}
				
				// 构建窗口代码并执行，进行窗口内部的渲染
				var script_gen = [];
				script_gen.push('(function(W) { with (W.layout.vars) {');
				script_gen.push('// ===================================================================================');
				
				for (var i = 0; i < scripts.length; i++) {
					var script = scripts[i];
					if (script) {
						script_gen.push(script);
					}
				}
				
				script_gen.push('// ===================================================================================');
				script_gen.push('}})');
				
				var id = W.attr('id'), script_name = options.path + '.html' + (id ? '@' + id : '');
				script_gen.push('//@ sourceURL=' + script_name);
				
				script = script_gen.join('\n');
				
				var nodes = W.node.children().toArray();
				if (extern_nodes && extern_nodes.length) {
					nodes = nodes.concat(extern_nodes);
				}
				
				var f = window.eval(script), widget;

				var render_timeout = window.setTimeout(function() {
					if (chain.aborted) return;
					
					render_timeout = false;
					W.node.removeClass('ui-rendering');
				}, 200);
				
				var chain = W.Chain().join(
					W._render(nodes, { extern: extern }).done(function() {
						if (render_timeout) {
							window.clearTimeout(render_timeout);
							W.node.removeClass('ui-rendering');
						}
						
						var vars = W.layout.vars;
						for (var i = 0; i < ids.length; i++) {
							vars['$' + ids[i]] = W.$(ids[i]);
						}
						
						widget = f.call(W, W);
						
						layout && layout.resizeAll();
					}),
					function() { return widget; }
				);
				
				return chain;
			}
			
			// 所有正在载入窗口的主调用链，结构：布局ID -> 调用链
			var loading_chains = {};
			
			// load:
			return function(path) {
				var W = this, options = {};

				// 标准化输入参数，分离 path（窗口路径） 和 args（窗口参数）
				if (typeof path === 'string') {
					// W.show(path, args...)
					options.path = path;
					options.args = SLICE.call(arguments, 1);
				} else if (typeof path === 'object') {
					if (W.is_array(path)) {
						// W.show([path, args...])
						options.path = path[0];
						options.args = SLICE.call(path, 1);
					} else {
						// W.show(options)
						options = path;
						if (W.is_array(options.path)) {
							options.args = SLICE.call(options.path, 1);
							options.path = options.path[0];
						} else {
							options.args = options.args || [];
						}
					}
				}
				
				// 窗口路径为空时，不做任何操作
				if (!options.path) return W;
				
				// 是否使用兼容方式打开窗口
				// 使用兼容方式时，窗口路径以 compat: 开头，如 compat:http://www.example.com
				if (options.path.indexOf('compat:') === 0) {
					return W.load('layouts/compat', options.path.substring(7), options.args[0]);
				}
				
				if (options.path.indexOf('source:') === 0) {
					options.source = options.path.substring(7);
					options.path = '<source>';
				}
				
				var w = (W.type == 'container' ? W : W.inner()), layout = w.layout;
				layout.path = options.path;
				layout.initialize();
				
				W.node.addClass('ui-rendering');
//				if(options.extern){
//					options.extern.button_bar.node && options.extern.button_bar.node.empty();
//					options.extern.status_bar.node && options.extern.status_bar.node.empty();
//					options.extern.action_bar.node && options.extern.action_bar.node.empty();
//					options.extern.tabs.target.tab_headers && options.extern.tabs.target.tab_headers.empty();
//				}
				//options.extern && options.extern.target.search_form && options.extern.target.search_form.empty();
				
				// 窗口控件对象
				var widget;
				
				// 构建一条主调用链返回给调用者以注册回调函数，并join一条子调用链进行渲染
				// 这保证回调函数在渲染完成后执行
				return layout.loading_chain = 
					W.join(
						// 实际渲染在子调用链中完成	
						W.Chain(true)
						 .join_done(function() { 
							 // 释放先前的窗口
							 w.clean();
						 })
						 .join_done(function() { return render_precede(w, options); })
						 .join_done(function() { 
							 return render_standard(w, options).done(function(data) {
								 widget = data;
							 });
						 }),
						
						// 实际渲染完成后的后续处理
						function() {
							delete layout.loading_chain;
							if (widget) {
								W.widget = widget;
								return widget;
							}
						}
					);
			};
		})(), 
		
		/**
		 * 读取元素标签名称
		 * @param {DOMElement} [elem] 页面元素。省略此参数以读取当前元素的标签名称
		 * @returns {String} 标签名称，总是全部小写的字符串
		 */
		node_name: function(elem) {
			elem = elem || this.node[0];
			return elem.nodeName && elem.nodeName.toLowerCase();
		},
		
		/**
		 * 为当前的select元素构建option
		 * @param {Array|Object} data 数据源。当数据源是数组时，option基于每个数组元素构建；当数据源是对象时，option基于每个键值对构建
		 * @param {String|function(row)} text 数组元素的属性名，其属性值对应为option的文本；或者是数组元素到option文本的映射函数
		 * @param {String|function(row)} value 数组元素的属性名，其属性值对应为option的值；或者是数组元素到option值的映射函数
		 * @param {number} [initial_options_length=0] 保留的option数量
		 * @returns {W} this
		 * @example
		 * W.options(
		 *   [{ name: 'aaa', value: 1 }, { name: 'bbb', value: 2 }],
		 *   'name', // 或者 function() { return this.name; }
		 *   'value' // 或者 function() { return this.value; }
		 * );
		 * @example
		 * W.options({
		 *   '1': 'aaa',
		 *   '2': 'bbb'
		 * });
		 */
		options: function(data, text, value, initial_options_length) {
			var options = text;
			if (arguments.length !== 2) {
				options = {
					text: text,
					value: value,
					initial_options_length: initial_options_length
				};
			}
			
			var W = this;
			var text_getter = 
				options.text == null ? SELF : 
					W.is_function(options.text) ? options.text : function(row) { return row[options.text]; };
			var value_getter = 
				options.value == null ? SELF : 
					W.is_function(options.value) ? options.value : function(row) { return row[options.value]; };
			var select = W.node[0];
			
			if(arguments.length == 2){//FIXME 	外部改方法改变option
				var _select = W.expando(EXPANDO.ORIGINAL)/**select-multiple,w-radio*/ || $(select)/**multi-select-transfer*/;
				if(!options.append)
					_select.empty();
				if (W.is_array(data)) {
					for (var i = 0; i < data.length; i++) {
						var row = data[i];
						_select.append(new Option(text_getter(row), value_getter(row)));
					}
				} else {
					for (var key in data) {
						_select.append(new Option(text_getter(data[key]), value_getter(key)));
					}
				}
				W.node.trigger('rerender',_select);//重新渲染
			}else{
				select.options.length = options.initial_options_length || 0;//TODO 
				if (W.is_array(data)) {
					for (var i = 0; i < data.length; i++) {
						var row = data[i];
						var _opt = new Option(text_getter(row), value_getter(row));
						if(row.state && row.state == 'selected'){
							_opt.selected = true;
						}else{
							_opt.selected = false;
						}
						select.options.add(_opt);
					}
				} else {
					for (var key in data) {
						var _opt = new Option(text_getter(data[key]), value_getter(key));
						if(data[key].state && data[key].state == 'selected'){
							_opt.selected = true;
						}else{
							_opt.selected = false;
						}
						select.options.add(_opt);
					}
				}
				W.fire('change');
			}
			return W;
		},
		options_value:function(text){
			var select = this.node[0].tagName == 'SELECT'?this.node:this.node.data('SELECT'),option = select.find('option').filter(function(){
				return $(this).text()==text;
			});
			return option?option.attr('value'):null;
		},
		
		prop: function(name, value) {
			if (arguments.length == 1) {
				return this.node.prop(name);
			} else {
				this.node.prop(name, value);
				return this;
			}
		},
		
		/**
		 * 删除元素属性
		 * @param {String} name 属性名
		 * @returns {W}
		 */
		remove_attr: function(name) {
			this.node.removeAttr(name);
			return this;
		},
		
		remove_expando: function(name) {
			var W = this;
			if (W._expando) {
				if (arguments.length == 0) {
					if (W._expando_empty) {
						delete W._expando_empty;
					} else {
						$.removeData(W.node[0], EXPANDO_KEY);
					}
					delete W._expando;
				} else {
					delete W._expando[name];
				}
			}
			return W;
		},
		
		show: function(path) {
			if (path !== undefined) {
				W.warn('过期的函数W.show(path)，应为W.load()');
				return this.load.apply(this, arguments);
			}
			
			this.node.show();
			return this;
		},
		
		text: function(value) {
			if (value === undefined) {
				return this.node.text();
			} else {
				this.node.text(value);
				return this;
			}
		},
		
		/**
		 * 切换或设置元素的显示状态
		 * @param {boolean} [show_or_hide] 期望的显示状态，显示为true，隐藏为false。需要切换时，省略此参数
		 * @returns {W} this
		 */
		toggle: function(show_or_hide) {
			this.node.toggle(show_or_hide);
			return this;
		},
		
		/**
		 * 设置或读取元素宽度
		 * @param {number} [value] 宽度值。需要读取时，省略此参数
		 * @returns {mixed} 获取时，返回元素宽度值；设置时，返回this
		 */
		width: function(value) {
			if (value === undefined) {
				return this.node.width();
			} else {
				this.node.width(value);
				return this;
			}
		},
		/****************拖拽*********************/
		draggable:function(options){
			options.helper = function(event,ui){
				var _h =$(options.helper_html);
				//把helper放到鼠标当前位置下去
				_mouse_left = event.originalEvent.x || event.originalEvent.layerX || 0;
				_h.css("margin-left",_mouse_left - 15);
				return _h;
			};
			this.node.draggable(options);
		},
		droppable:function(options){
			var W = this;
			options.position = options.position || ['nw','ne','sw','se','c','w','n','s','e'];
			/**
			 * 计算helper参考元素的方位
			 * @param x , y:helper相对于参考元素左上角的位移
			 * @param wnh:参考元素所占物理宽高度：width or height + padding + border
			 */
			var _calculate_position = function(x,y,wnh){
				var w = wnh[0], h = wnh[1] ,p=[];
				if(x < w/3 && y < h/3){
					p.push('nw');
					if(x*h > y*w){
						p.push('n');p.push('w');
					}else{
						p.push('w');p.push('n');
					}
					p.push('c');
					return p;
				}
				
				if(x < 2*w/3 && y < h/3){
					p.push('n');
					if(x < w/2){
						p.push('nw');p.push('c');p.push('w');
					}else{
						p.push('ne');p.push('c');p.push('e');
					}
					return p;
				}
				
				if(x >= 2*w/3 && y < h/3){
					p.push('ne');
					if((w-x)*h > y*w){
							p.push('n');p.push('e');
					}else{
							p.push('e');p.push('n');
					}
					p.push('c');
					return p;
				}
				
				if(x < w/3 && y < 2*h/3){
					p.push('w');p.push('c');
					if(y < h/2){
						p.push('n');p.push('nw');
					}else{
						p.push('s');p.push('sw');
					}
					return p;
				}
				
				if(x < 2*w/3 && y < 2*h/3){
					p.push('c');
					if(x < w/2 && y < h/2 && x*h > y*w){
						p.push('n');p.push('w');
					}
					if(x < w/2 && y < h/2 && x*h <= y*w){
						p.push('w');p.push('n');
					}
					if(x >= w/2 && y < h/2 && (w-x)*h > y*w){
						p.push('n');p.push('e');
					}
					if(x >= w/2 && y < h/2 && (w-x)*h <= y*w){
						p.push('e');p.push('n');
					}
					if(x < w/2 && y >= h/2 && x*h < (h-y)*w){
						p.push('w');p.push('s');
					}
					if(x < w/2 && y >= h/2 && x*h >= (h-y)*w){
						p.push('s');p.push('w');
					}
					if(x >= w/2 && y >= h/2 && (w-x)*h > (h-y)*w){
						p.push('s');p.push('e');
					}
					if(x >= w/2 && y >= h/2 && (w-x)*h <= (h-y)*w){
						p.push('e');p.push('s');
					}
					return p;
				}
				
				if(x >= 2*w/3 && y < 2*h/3){
					p.push('e');p.push('c');
					if(y < h/2){
						p.push('n');p.push('ne');
					}else{
						p.push('s');p.push('se');
					}
					return p;
				}
				
				if(x < w/3 && y >= 2*h/3){
					p.push('sw');
					if(x*h < (h-y)*w){
						p.push('w');p.push('s');
					}else{
						p.push('s');p.push('w');
					}
					p.push('c');
					return p;
				}
				
				if(x < 2*w/3 && y >= 2*h/3){
					p.push('s');
					if(x < w/2){
						p.push('sw');p.push('c');p.push('w');
					}else{
						p.push('se');p.push('c');p.push('e');
					}
					return p;
				}
				
				if(x >= 2*w/3 && y >= 2*h/3){
					p.push('se');
					if((w-x)*h < (h-y)*w){
						p.push('e');p.push('s');
					}else{
						p.push('s');p.push('e');
					}
					p.push('c');
					return p;
				}
			};
			
			var calculate = function(standard,wnh,positions,currentlocation){
				var _x = currentlocation.left - standard.left, _y = currentlocation.top - standard.top;
				if(_x>0 && _y>0){
					var p = _calculate_position(_x,_y,wnh);
					while(p.length > 0){
						var _p = p.shift();
						if (W.in_array(positions,_p) != -1){
							return _p;
						}
					}
				}
			};
			
			options.out = function(event,ui){
				console.log("****out");
				$(ui.helper).unbind("mousemove");
			};
			
			options.over = function(event,ui){
				console.log("****over");
				var self = this, p_temp=[];//移动过程中相同方位只处理一次
				$(ui.helper).bind({
					mousemove:function(){
						var p = calculate($(self).offset(),[self.offsetWidth,self.offsetHeight],options.position,$(ui.helper).offset());
						if( p && p_temp.pop() != p){
							console.log("validate move!position:"+p);
							$(ui.draggable).data('position', p);
						}
						p_temp.push(p);
					}
				});
			};
			
			options.drop = function(event, ui){
				console.log("****drop");
				var _data = W.$(ui.draggable).data();
				_data.ref_position = $(ui.draggable).data('position');
//				$(ui.draggable).remove();
				W.node.trigger('insert',_data);
			};
			
			this.node.droppable(options);
		}
		/****************拖拽*********************/
	};
})());

// *********************************************************************************************************************
// DATA

W.extend((function() {
	var GETTER = EXPANDO.GETTER, 
		SETTER = EXPANDO.SETTER,
		TEMPLATE_NODES = EXPANDO.TEMPLATE_NODES,
		TEMPLATES = EXPANDO.TEMPLATES,
		VALIDATOR = EXPANDO.VALIDATOR;
	
	var get_node_data = function(W) {
		var getter = W.expando(GETTER);
		if (getter) {
			return getter.call(W);
		}
		
		var node = W.node;
		if (node.length == 0) return undefined;
		
		switch (W.node_name()) {
		case 'input': {
			var type = node.attr('type');
			if (type === 'checkbox') {
				return node.prop('checked') ? node.attr('value') : undefined;
			} else if (type === 'radio') {
				return node.prop('checked') ? node.attr('value') : undefined;
			} else {
				return node.val();
			}
		}
		case 'select': case 'textarea': {
			return node.val();
		}
		default: {
			if (node.children().size() == 0) {
				return node.text();
			}
			
			var value = {};
			$('[name]', node).each(function(i) {	
				var e = $(this), expression = e.attr('name'), obj = value;
				var tokens = expression.split('.');
				for (var i = 0; i < tokens.length - 1; i++) {
					obj = obj[tokens[i]] = obj[tokens[i]] || {};
				}
				var data = get_node_data(W.$(e));
				if (data !== undefined) {
					var datas = obj[tokens[tokens.length - 1]];
					if (datas !== undefined) {
						if (W.is_array(datas)) {
							datas.push(data);
						} else {
							datas = [datas, data];
							obj[tokens[tokens.length - 1]] = datas;
						}
					} else {
						obj[tokens[tokens.length - 1]] = data;
					}
				}
			});
			return value;
		}
		}
	};
	
	var set_node_data = function(W, value) {
		var node = W.node;
		if (node.length == 0) return;
		
		switch (W.node_name()) {
			case 'input': {
				var type = node.attr('type');
				if (type === 'checkbox') {
					node.prop('checked', value); 
				} else if (type === 'radio') {
					node.prop('checked', value == node.attr('value'));
				} else {
					node.val(value);
				}
				break;
			}
			case 'select': case 'textarea': {
				node.val(value);
				break;
			}
			default: {
				node.text(value);
				break;
			}
		}
	};
	
	var render_templates = function(W, value, vars) {
		var templates = W.expando(TEMPLATES);
		if (templates) {
			var chains = [];
			
			vars = W.extend(Object.create(vars), { _NODE: W });
			
			// 遍历所有注释节点
			var contents = W.node.contents();
			for (var i = 0; i < contents.length; i++) {
				var ei = contents[i], ej;
				if (ei.nodeType != 8) continue; // 忽略非注释节点
				
				var boundary = ei.data;
				if (boundary.indexOf('tpl#') != 0) continue; // 忽略普通注释节点
				
				var remove_nodes = [];
				
				// 此时ei为模板元素上边界，开始寻找模板元素下边界。上下边界之间的元素为上一次的模板渲染结果，需要移除
				for (var j = i + 1; j < contents.length; j++) {
					ej = contents[j];
					if (ej.nodeType == 8 && ej.data == boundary) break;
					remove_nodes.push(ej);
				}
				i = j + 1;
				
				// 移除上一次模板渲染结果
				if (remove_nodes.length) {
					W.$($(remove_nodes)).destroy();
				}
				
				// 已编译的模板
				var template = templates[parseInt(boundary.substring(4))];
				
				// 渲染模板
				var html = template.call(value, vars);
				var nodes = $('<div>').html(html).contents();
				
				$(ei).after(nodes);
				
				// 渲染模板内的控件
				var chain = W.render(W.filter(nodes, function() { return this.nodeType === 1; }), { vars: vars });
				chains.push(chain);
			}
			
			return W.join(chains);
		}
	};
	
	return /** @lends W.prototype */ {		
		
		/**
		 * 设置或读取元素的绑定值
		 * @param {mixed} [value] 绑定值。需要读取时，省略此参数
		 * @param {mixed} [vars] 内部使用参数
		 * @param {boolean} [ignore_setter] 内部使用参数
		 * @returns {mixed} 绑定值
		 */
		data: function(value, vars, ignore_setter) {
			var W = this;
			if (arguments.length == 0) {
				return get_node_data(W);
			} else {
				if (ignore_setter !== true) {
					var setter = W.expando(SETTER);
					if (setter) {
						try {
							setter.call(W, value, vars);
						} catch (e) {
							W.error(e);
						}
						return W;
					}
				}
				
				vars = vars || W.layout.vars;
				
				var continuation = function() {
					if (typeof value === "object" && value !== null) {
						if (value instanceof String || value instanceof Number) {
							value = value.valueOf();
						} else if (W.is_array(value)) {
							// EMPTY
						} else {
							$('[name]', W.node).each(function(i, elem) {						
								var e = $(elem), expression = e.attr('name'), obj = value;						
								W.each(expression.split('.'), function(token) {
									obj = obj != null ? obj[token] : obj;
								});
								W.$(elem).data(obj, vars);
							});
						}
					}
				};
				
				// 若存在延迟绑定模板，先渲染模板
				var chain = render_templates(W, value, vars);
				
				if (chain) {
					chain.join_done(continuation);
				} else {
					continuation();
					set_node_data(W, value);
				}
				
				return W;
			}
		},
		
		data_getter: function(node, getter) {
			var W = this;
			if (arguments.length === 1) {
				W.expando(GETTER, node);
			} else {
				W.$(node).expando(GETTER, getter);
			}
			return W;
		},
		
		data_setter: function(node, setter) {
			var W = this;
			if (arguments.length === 1) {
				W.expando(SETTER, node);
			} else {
				W.$(node).expando(SETTER, setter);
			}
			return W;
		},
		
		data_validator: function(node, validator) {
			var W = this;
			switch (arguments.length) {
				case 0: {
					return W.expando(VALIDATOR);
				}
				case 1: {
					W.expando(VALIDATOR, node);
					break;
				}
				case 2: {
					W.$(node).expando(VALIDATOR, validator);
					break;
				}
			}
			return W;
		},
		
		validate: function() {
			var W = this, chain = W.Chain(), token = chain.next_token('W.validate');
			
			var data = W.data();
			var result;

			var validator = W.expando(VALIDATOR);
			if (validator) {
				result = validator.call(W, data, function continuation(result) {
					if (result === true) {
						chain.yield(token, 'success', data);
					} else {
						chain.yield(token, 'error', result);
					}
				});
			} else {
				result = true;
			}
			
			if (result === true) {
				Context.execute_async(function() {
					chain.yield(token, 'success', data);
				});
			}
			
			if (result === false || typeof result === 'string') {
				Context.execute_async(function() {
					chain.yield(token, 'error', result);
				});
			}
			
			return chain;
		}
	};
	
})());

// *********************************************************************************************************************
// WIDGET

W.extend((function () {
	var widgets = {};	// 注册控件列表
	var find_precede_widgets;	// 查找匹配的前置控件列表
	var find_standard_widget;	// 查找匹配的标准控件
	var find_decorative_widgets;// 查找匹配的装饰控件列表
	
	/** 计划生成控件查找函数 */
	W.main(function() {
		var precede_statements = [],
			decorative_statements = [],
			standard_statements = [],
			standard_statements_has_attrs = [];
		
		for (var name in widgets) {
			var widget = widgets[name];
			
			var selector = widget.selector, 
				tag = null,		// 选择元素的标签
				classes = null,	// 选择元素的class列表
				attrs = null;	// 选择元素的属性表，结构为: { 属性名: 属性值 }，属性值为null表示只需判断该属性是否存在
			
			/** 解析选择器字符串 */
			var match;
			while ((match = /^(?:\*|\w+|\.[\w\-]+|\[[^\]]+\]|:\w+)/.exec(selector)) !== null) {
				var part = match[0];
				selector = selector.substring(part.length);
				
				switch (part.charAt(0)) {
				case '.': {
					classes = classes || [];
					classes.push(part.substring(1));
					break;
				}
				case '[': {
					match = /^\[\s*((?:[\w-]|\\.)+)\s*(?:=\s*(['"]*)(.*?)\2|)\s*\]$/.exec(part);
					if (match !== null) {
						attrs = attrs || {};
						attrs[match[1]] = match[3] || null;
					}
					break;
				}
				case ':': {
					switch (part) {
					case ':file': {
						attrs = attrs || {};
						attrs.type = 'file';
						break;
					}
					case ':submit': {
						attrs = attrs || {};
						attrs.type = 'submit';
						break;
					}
					// TODO: 更多的pseudo选择器支持
					}
					break;
				}
				default: {
					tag = part;
				}
				}
			}
			
			/** 根据解析结果，拼接条件字符串 */
			var conditions = [];
			
			if (attrs) {
				for (var attr_name in attrs) {
					var attr_value = attrs[attr_name];
					if (attr_value === null) {
						conditions.push('node.hasAttribute("' + attr_name + '")');
					} else {
						conditions.push('node.getAttribute("' + attr_name + '") === "' + attr_value + '"');
					}
				}
			}
			
			if (classes) {
				for (var i = 0; i < classes.length; i++) {
					conditions.push('/(?:^| )' + classes[i] + '(?: |$)/.test(node.className)');
				}
			}
			
			if (tag && tag !== '*') {
				conditions.push('node.tagName === "' + tag.toUpperCase() + '"');
			}
			
			switch (widget.type) {
			case 'precede': 	{
				precede_statements.push('if (' + conditions.join(' && ') + ') result.push("' + widget.name + '");');
				break;
			}
			case 'decorative': 	{
				decorative_statements.push('if (' + conditions.join(' && ') + ') result.push("' + widget.name + '");');
				break;
			}
			default: {
				var statements = (attrs || classes) ? standard_statements_has_attrs : standard_statements;
				statements.push('if (' + conditions.join(' && ') + ') return "' + widget.name + '";');	
			}
			}
		}
		
		find_precede_widgets = new Function('node', 'var result = [];\n' + precede_statements.join('\n') + 'return result;');
		find_standard_widget = new Function('node', 'if (node.hasAttributes()) {\n' + standard_statements_has_attrs.join('\n') + '}\n' + standard_statements.join('\n')); 
		find_decorative_widgets = new Function('node', 'var result = [];\n' + decorative_statements.join('\n') + 'return result;');
	});
	
	/** 注册控件资源 */
	W.mock.get(/bumblebee\/precede-widgets\/([^?]*)(?:\?(.*))?/, function(keyword, paginator) {
		var precede_widgets = [];
		W.each(widgets, function(widget) {
			if (widget.type === 'precede') {
				precede_widgets.push(widget);
			}
		});
		if (keyword !== '') {
			precede_widgets = W.filter(precede_widgets, function() {
				return (
					this.name.indexOf(keyword) != -1 || 
					this.selector.indexOf(keyword) != -1 || 
					this.description.indexOf(keyword) != -1
				);
			});
		}
		return W.paginate(precede_widgets, paginator);
	});
	
	W.mock.get(/bumblebee\/standard-widgets\/([^?]*)(?:\?(.*))?/, function(keyword, paginator) {
		var standard_widgets = [];
		W.each(widgets, function(widget) {
			if (widget.type == null || widget.type === 'standard') {
				standard_widgets.push(widget);
			}
		});
		if (keyword !== '') {
			standard_widgets = W.filter(standard_widgets, function() {
				return (
					this.name.indexOf(keyword) != -1 || 
					this.selector.indexOf(keyword) != -1 || 
					this.description.indexOf(keyword) != -1
				);
			});
		}
		return W.paginate(standard_widgets, paginator);
	});
	
	W.mock.get(/bumblebee\/decorative-widgets\/([^?]*)(?:\?(.*))?/, function(keyword, paginator) {
		var decorative_widgets = [];
		W.each(widgets, function(widget) {
			if (widget.type === 'decorative') {
				decorative_widgets.push(widget);
			}
		});
		if (keyword !== '') {
			decorative_widgets = W.filter(decorative_widgets, function() {
				return (
					this.name.indexOf(keyword) != -1 || 
					this.selector.indexOf(keyword) != -1 || 
					this.description.indexOf(keyword) != -1
				);
			});
		}
		return W.paginate(decorative_widgets, paginator);
	});
	
	var LAMBDA_REGEX = /^([a-zA-Z0-9_$, ]+)\|/;
	var PROPERTY_REGEX = /^([a-zA-Z0-9_$, ]+)[.( ]/;
	
	var NATIVE = function(e) {
		if (e instanceof jQuery) return e[0];
		if (e instanceof C) return e.node[0];
		return e;
	};
	
	var LAST_PHASE = { standard: 'precede', decorative: 'standard' };
	
	var RenderContext = W.Class('RenderContext', null, {
		RenderContext: function(root, options) {
			this.root = NATIVE(root);
			
			this.descendant = [];
			this.extern = options.extern;
			this.phase = options.phase && LAST_PHASE[options.phase];
			this.vars = options.vars;
		},
		
		alter: function(new_root, remove_old) {
			var root = this.root;
			
			new_root = NATIVE(new_root);
			
			// 复制所有属性
			var attrs = SLICE.call(root.attributes);
			for (var i = 0; i < attrs.length; i++) {
				var attr = attrs[i];

				if (attr.name == 'class') {
					var value = new_root.getAttribute('class');
					if (value) {
						new_root.setAttribute('class', value + ' ' + attr.value);
					} else {
						new_root.setAttribute(attr.name, attr.value);
					}
				} else {
					new_root.setAttribute(attr.name, attr.value);
				}
				
				if (!remove_old && /* input[type] 属性不能删除 */ attr.name != 'type') {
					root.removeAttribute(attr.name);
				}
			}
			
			// 复制所有事件
			var events = $.data(root, 'events');
			if (events) {
				for (var type in events) {
					var events_of_type = events[type];
					for (var i = 0; i < events_of_type.length; i++) {
						$.event.add(new_root, type, events_of_type[i], events_of_type[i].data);
					}
				}
			}
			
			if (remove_old) {
				$(root).replaceWith($(new_root));
			}
			
			this.root = new_root;
		},
		
		render: function(nodes, options) {
			if (!nodes || nodes.length == 0) return;
			
			if (this.vars) {
				options = options || {};
				options.vars = W.extend(Object.create(this.vars), options.vars);
			}
			
			this.descendant.push([nodes, options]);
		}
	});
	
	return /** @lends W.prototype */ {
		Action: function(expression, vars) {
			var W = this;
			
			vars = vars || W.layout.vars;
			
			var head = ['(function(W, _vars) {\n', 'with(_vars) {\n'];
			var tail = ['})\n', '}\n'];
			var parts = expression.split(/->/g);
			for (var i = 0; i < parts.length; i++) {
				var vars_def = [], action = parts[i].trim();
				
				var m = LAMBDA_REGEX.exec(action);
				if (m) {
					vars_def = m[1].split(/,\s*/);
					action = $.trim(action.substring(m[0].length));
				}
				
				for (var j = 0; j < vars_def.length; j++) {
					head.push('var ' + vars_def[j] + ' = arguments[' + j + '];\n');
				}
				
				m = PROPERTY_REGEX.exec(action);
				if (m) {
					if (m[1] in vars) {
						head.push(action);
					} else {
						head.push('(\'' + m[1] + '\' in _vars ? _vars : this).' + action);
					}
				} else {
					head.push('this.' + action);
				}
				
				tail.push(';\n');
				if (i < parts.length - 1) {
					head.push('.done(function() {\n');
					tail.push('})\n');
				}
			}
			tail.reverse();
			
			var script = head.concat(tail).join('');
			var f;
			return function() {
				if (!f) {
					try {
						f = window.eval(script).curry(W, vars);
					} catch (e) {
						W.error(e);
					}
				}
				return f.apply(this, arguments);
			};
		},
		
		Meta: function(s) {
			var m = /<!--\s*@meta\s+([\s\S]*?)-->/.exec(s), r = {};
			if (m) {
				m[1].replace(/(\w+)\s*=\s*"((?:[^"]|\\")*)"/g, function($0, $1, $2) {
					r[$1] = $2;
				});
			}
			return r;
		},
		
		/**
		 * 清理元素<br><br>
		 * 这将清理元素和其所有子元素，清除绑定在这些元素上的额外数据（如事件监听函数）
		 * @returns {W} this
		 */
		clean: function() {
			var W = this, inner_only = (W.type == 'container');
			for (var i = 0; i < W.node.length; i++) {
				var node = W.node[i];
				if (node.nodeType != 1) continue;
				
				var elems = node.getElementsByTagName("*");
				
				// 释放所有子元素
				for (var j = 0; j < elems.length; j++) {
					var w = W.$(elems[j]);
					w.stop_polling();
					w.off().remove_expando();
				}
			}
			
			// 释放当前元素
			W.stop_polling();
			W.off();
			if (!inner_only) {
				W.remove_expando();
			} else {
				W.remove_expando('inner_handlers');
			}
			return W;
		},
		
		/**
		 * 关闭窗口
		 * @param [args...] 返回给父窗口的参数
		 * @returns {W} this
		 */
		close: function() {
			var W = this;
			
			var args = SLICE.call(arguments);
			args.unshift('close');
			
			W.fire.apply(W.type === 'container' ? W : W.parent, args);
			
			return W;
		},
		
		/**
		 * 注册控件
		 * @param {Object} widget_def 控件定义
		 * @returns {W} this
		 */
		define_widget: function(widget_def) {
			if (widgets[widget_def.name]) {
				W.warn('重复定义控件：' + widget_def.name);
			}
			
			widgets[widget_def.name] = widget_def;
			
			if (widget_def['import']) {
				var imports = W.Array(widget_def['import']);
				for (var i = 0; i < imports.length; i++) {
					W._import(imports[i]);
				}
			}
			
			return this;
		},
		
		/**
		 * 清理并删除元素<br><br>
		 * @returns {W} this
		 */
		destroy: function() {
			var W = this;
			W.clean();
			W.node.remove();
			return W;
		},
		
		empty: function() {
			var W = this;
			W.inner().clean();
			W.node.empty();
			return W;
		},
		
		/**
		 * 设置元素的HTML内容。Bumblebee会在设置完成后对这些HTML内容进行渲染
		 * @returns {W} this
		 */
		html: function(html) {
			var W = this;
			W.inner().clean();
			W.node.html(html);
			return W.render_inner();
		},
		
		/**
		 * 打开窗口<br><br>
		 * 可以通过{@link W.done}注册回调函数。如果打开的窗口被关闭，则调用成功处理的回调函数，并可以接受对方通过{@link W.close}返回的参数。
		 * @param {String} path 窗口路径
		 * @param [args...] 传递给窗口的参数
		 * @returns {Chain}
		 * @example 打开用户编辑窗口，编辑id=1的用户
		 * W.open('user/edit', 1);
		 */
		open: function() {
			var W = this, chain = W.Chain(), token = chain.next_token('W.open');
			var path = SLICE.call(arguments);
			if (path.length == 1 && W.is_array(path[0])) {
				path = SLICE.call(path[0]);
			}
			
			var source = (W.type === 'container' ? chain : W.parent);
			
			source.fire('open', path, function(result) {
				chain.yield(token, 'success', result);
			});
			
			return chain;
		},
		
		/**
		 * 以弹出窗口形式，打开窗口<br><br>
		 * 可以通过{@link W.done}注册回调函数。如果打开的窗口被关闭，则调用成功处理的回调函数，并可以接受对方通过{@link W.close}返回的参数。
		 * @param {String} path 窗口路径
		 * @param [args...] 传递给窗口的参数
		 * @returns {Chain}
		 * @example 以弹出窗口形式，打开用户编辑窗口，编辑id=1的用户
		 * W.popup('user/edit', 1);
		 */
		popup: function() {
			var W = this, chain = W.Chain(), token = chain.next_token('W.popup');
			var path = SLICE.call(arguments);
			if (path.length == 1 && W.is_array(path[0])) {
				path = SLICE.call(path[0]);
			}
			
			var source = (W.type === 'container' ? chain : W.parent);
			var event = {
				type: 'popup',
				args: [path, function(result) { chain.yield(token, 'success', result); }],
				success: function(e) {
					if (!e.handled) {
						window.W.default_popup_handler.apply(W, event.args);
					}
				}
			};
			
			source.fire(event);
			
			return chain;
		},
		
		/**
		 * 刷新窗口<br><br>
		 * @returns {W} this
		 */
		refresh: function() {
			return this.fire('refresh');
		},
		
		remove_class: function(className) {
			this.node.removeClass(className);
			return this;
		},
		
		_render: (function() {
			
			/**
			 * 第一阶段：前置控件渲染
			 */ 
			function render_precede(W, render_context) {
				var chains = [], node = render_context.root;
				
				render_context.phase = 'precede';
				
				var widget_names = find_precede_widgets(node);
				for (var i = 0; i < widget_names.length; i++) {
					var widget = widgets[widget_names[i]];
					
					try {
						E.render_debug_enabled && W.debug('前置控件渲染', widget.description, node);
						
						var chain = W.Chain(true);
						chains.push(chain);
						
						widget.onrender.call(chain, node, render_context);
					} catch (e) {
						W.error('前置控件渲染时出错', widget.description, node, e);
					}
				}
				
				if (chains.length) {
					return W.join(chains);
				}
			}
			
			/**
			 * 第二阶段：标准控件渲染
			 */
			function render_standard(W, render_context) {
				var node = render_context.root;
				
				render_context.phase = 'standard';
				
				var widget_name = find_standard_widget(node);
				if (widget_name) {
					var widget = widgets[widget_name];
										
					try {
						E.render_debug_enabled && W.debug('标准控件渲染', widget.description, node);

						var chain = W.Chain(true);
						
						widget.onrender.call(chain, node, render_context);
						
						var chains = [chain];
						for (var j = 0; j < render_context.descendant.length; j++) {
							var descendant = render_context.descendant[j];
							var descendant_chain = W._render(descendant[0], descendant[1]);
							chains.push(descendant_chain);
						}
						
						return W.join(chains);
					} catch (e) {
						W.error('标准控件渲染时出错', widget.description, node, e);
					}
				} else {				
					// 若非标准控件，递归渲染子元素
					return W._render($(node).children(), { vars: render_context.vars });
				}
			}
			
			/**
			 * 第三阶段：修饰控件渲染
			 */ 
			function render_decorative(W, render_context) {
				var chains = [], node = render_context.root;
				
				render_context.phase = 'decorative';
				
				var widget_names = find_decorative_widgets(node);
				for (var i = 0; i < widget_names.length; i++) {
					var widget = widgets[widget_names[i]];
					
					try {
						E.render_debug_enabled && W.debug('修饰控件渲染', widget.description, node);

						var chain = W.Chain(true);
						chains.push(chain);
						
						widget.onrender.call(chain, node, render_context);
					} catch (e) {
						W.error('修饰控件渲染时出错', widget.description, node, e);
					}
				}
				
				if (chains.length) {
					return W.join(chains);
				}
			}
			
			function render_node(W, render_context) {
				var chain = W.Chain(true);
				
				switch (render_context.phase) {
					default: 			chain.join_done(function() { return render_precede(W, render_context); });
					case 'precede': 	chain.join_done(function() { return render_standard(W, render_context); });
					case 'standard':	chain.join_done(function() { return render_decorative(W, render_context); });
				}
				
				chain.join_done(function() { delete render_context.phase; });
				
				return chain;
			}
			
			function _render(nodes, options) {
				var W = this, chains = [];
				
				options = W.extend({}, { extern: W.extern, vars: W.layout.vars }, options);
				
				for (var i = 0; i < nodes.length; i++) {
					// 当前渲染节点
					var node = NATIVE(nodes[i]);
					
					// 当前渲染上下文
					var render_context = new RenderContext(node, options);

					// 渲染单节点
					var render_chain = render_node(W, render_context);
					
					// 渲染完成后，回填控件根节点的变化
					render_chain.join_done((function(i, render_context) {
						return function() {
							nodes[i] = render_context.root;
						};
					})(i, render_context));
					
					chains.push(render_chain);
				}
				
				return W.join(chains);
			}
			
			// W._render();
			return _render;
		})(),
		
		render: function(nodes, options) {
			var W = this;
			if (arguments.length === 0) {
				// W.render() => W.render(W.node.toArray());
				nodes = W.node.toArray();
			} else if (arguments.length === 1) {
				if (typeof nodes.length === 'undefined') {
					// W.render(options) => W.render(W.node.toArray(), options);
					options = nodes;
					nodes = W.node.toArray();
				} else {
					// W.render(nodes, options);
					if (nodes instanceof jQuery) {
						nodes = nodes.toArray();
					}
				}
			}
			
//			if (W.in_chain) debugger;
			
			return W._render(nodes, options);
		},
		
		render_inner: function(node, options) {
			var W = this;
			if (arguments.length === 0) {
				// W.render_inner() => W.render_inner(W.node);
				node = W.node;
			} else if (arguments.length === 1 && !node instanceof HTMLElement && !node instanceof jQuery) {
				// W.render_inner(options) => W.render_inner(W.node, options);
				options = node;
				node = W.node;
			}
			
			return W._render($(node).children().toArray(), options);
		},
		
		/**
		 * 设置窗口的标题
		 * @param {String} title 窗口标题
		 * @returns {W} this
		 */
		title: function(title) {
			return this.fire('meta', 'title', title);
		},
		
		widget_attr: function(attr_name, default_key) {
			var attr_value = this.attr(attr_name);

			if (!attr_value) return null;
			
			var attr = {}, attr_def = attr_value.split(';');
			for (var i = 0; i < attr_def.length; i++) {
				var p = attr_def[i], j = p.indexOf(':');
				if (j == -1) {
					if (default_key && i == 0) {
						attr[default_key] = p.trim();
					}
					continue;
				}
				attr[p.substring(0, j).trim()] = p.substring(j + 1).trim();
			}
			
			return attr;
		},
		
		widget_switch: function(switch_def) {
			var switches = {};
			W.each((switch_def || "").split(","), function() {
				var part = this.trim();
				if (part && part.length > 1) {
					var off = 0, disabled = false, ch = part.charAt(0);
					if (ch == '+' || (disabled = (ch == '-'))) {
						off = 1;
					}
					switches[part.substring(off)] = !disabled;
				}
			});
			return switches;
		}
	};
})());

widget = {};

(function() { 
	
widget.Base = W.Class('Base', null, {
	Base: function(W, render_context) {
		this.W = W;
		this.node = W.node[0];
		this.render_context = render_context;
		this.extern = render_context && render_context.extern;
		this._initialize_mixin();
		this._initialize_options();
	},
	
	alter: function(new_node, remove_old) {
		this.node = (new_node instanceof jQuery ? new_node[0] : new_node);
		this.render_context.alter(new_node, remove_old);
		this.W = this.W.$(new_node);
		this._initialize_mixin();
	},
	
	render: function(nodes, options) {
		if (arguments.length == 0) {
			this._render();
		} else {
			if (this.render_context.phase) {
				this.render_context.render(nodes, options);
			} else {
				var W = this.W;
				return W.render(nodes, options);
			}
		}
	},
	
	_initialize_mixin: function() {
		var W = this.W, mixin_name = this.mixin_name;
		
		if (mixin_name && !P.hasOwnProperty(mixin_name)) {
			W.define_property(mixin_name, {
				get: function() { return this.expando(EXPANDO.WIDGET); }
			});
		}
		
		W.widget = this;
	},
	
	_initialize_options: function() {
		var W = this.W, attr_name = this.options_attr_name;
		if (attr_name) {
			var options = W.widget_attr(attr_name);
			if (options) {
				if (this.options) {
					this.options = W.extend({}, this.options, options);
				} else {
					this.options = options;
				}
				
				var feature_def = options.feature || options.features;
				if (feature_def) {
					if (this.features) {
						this.features = W.extend({}, this.features, W.widget_switch(feature_def));
					} else {
						this.features = W.widget_switch(feature_def);
					}
				}
				
				var event_def = options.event || options.events;
				if (event_def) {
					if (this.events) {
						this.events = W.extend({}, this.events, W.widget_switch(event_def));
					} else {
						this.events = W.widget_switch(event_def);
					}
				}
			}
		}
	},
	
	_render: NOOP
});

widget.Panel = W.Class('Panel', widget.Base, {
	Panel: function(W, render_context) {
		this.Base(W, render_context);
		this._status = 'show';
	},
	
	collapse: function() {
		var self = this;
		if (self._status == 'show') {
			self._status = null;
			self.content.hide('blind', {}, 'fast', function() { self._status = 'hide'; });
		}
	},
	
	expand: function() {
		var self = this;
		if (self._status == 'hide') {
			self._status = null;
			self.content.show('blind', {}, 'fast', function() { self._status = 'show'; });
		}
	},
	
	title: function(value) {
		if (arguments.length === 0) {
			return this.header.text();
		} else {
			this.header.text(value);
			return this;
		}
	},
	
	_render: function() {
		var header = this.header = $('<div class="w-panel-header ui-widget-header" />');
		var content = this.content = $(this.node);
		
		content.wrap('<div class="ui-widget ui-widget-panel" />');
		
		this.container = content.parent();
		this.alter(this.container);
		
		content.before(header).addClass('w-panel-content ui-widget-content');
		
		var self = this;
		header.bind('click dblclick', function() {
			switch (self._status) {
				case 'show': {
					self.collapse();
					break;
				}
				case 'hide': {
					self.expand();
					break;
				}
			}
		});
	}
});

widget.Extern = W.Class('Extern', null, {
	meta: function(meta) {
		for (var key in meta) {
			if (key in this) {
				this[key](meta[key]);
			}
		}
	},
	
	render: function(content, header, footer, nav, aside) {} 
});

widget.PopupExtern =  W.Class('PopupExtern', widget.Extern, {
	PopupExtern: function(target) {
		this.target = target;
		this.button_bar = new ButtonBar(target);
		this._rendered = false;
		this._width = 600;
	},
	
	render: function(content, header, footer, nav, aside) {
		this.target.dialog({
			autoOpen: false,
			bgiframe: false,
			modal: true,
			resizable: true,
			title: this._title,
			width: this._width,
			zIndex: 1000
		});
		
		this.target.dialog('open');
		
		var self = this, buttons = [];
		
		var nodes;
		
		if (footer.length) {
			buttons = footer.children('button').clone();
			if (buttons.length) {
				footer.remove();
				footer.length = 0;
			}
		}
		
		// 为了向后兼容
		if (!buttons.length) {
			buttons = content.filter('.w-window-button');
		}
		
		if (buttons.length) {
			nodes = W.map(buttons, function() {
				return self.button_bar.append(this);
			});
		}
		
		this._rendered = true;
		
		return nodes;
	},
	
	title: function(value) {
		if (this._rendered) {
			this.target.dialog('option', 'title', value);
		} else {
			this._title = value;
		}
	},
	
	type: function(value) {
		switch (value) {
			case 'login': {
				this._width = 300; 
				break;
			}
			default: {
				this._width = 600; 
				break;
			}
		}
	},
	
	width: function(value) {
		if (this._rendered) {
			this.target.dialog('option', 'width', value);
		} else {
			this._width = value;
		}
	}
});

var ButtonBar = W.Class('ButtonBar', null, {
	ButtonBar: function(target) {
		this.target = target;
	},
	
	initialize: function() {
		if (this.initialized) return;
		
		this.node = $('<div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix" />');
		this.buttonset = $('<div class="ui-dialog-buttonset" />');
		
		this.node.append(this.buttonset);
		this.target.parent().append(this.node);
		
		this.initialized = true;
	},
	
	append: function(node) {
		this.initialize();
		
		var button = $(node);
		var window_button = $('<button>');
		
		var attrs = W.$(button).attrs();
		
		if (button.is(':button')) {
			window_button.text(button.text() || button.attr('value'));
			button.remove();
		} else if (button.is(':submit')) {
			window_button.text(button.attr('value'));
			button.remove();
		} else {
			return;
		}
		
		delete attrs.type;
		window_button.attr(attrs);
		
		this.buttonset.append(window_button);
		
		return window_button;
	}
});

window.W.default_popup_handler = function(path, handler) {
	var popup_id = W.unique_id(),
		popup_container = $('<div />').attr('id', W.layout.actual_id(popup_id));
	
	W.node.append(popup_container);
	
	var extern = new widget.PopupExtern(popup_container);
	
	var popup = W.$(popup_id);
	
	popup.on('close', function(e) {
		popup.clean();
		popup_container.dialog('close');
		popup_container.remove();
		if (handler) {
			try {
				handler.apply(null, e.args);
			} catch (e) {
				W.error(e);
			}
		}
		e.stopPropagation();
	});
	
	popup.on('meta', function(e, key, value) {
		if (key === 'title') {
			extern.title(value);
			e.stopPropagation();
		}
	});
	
	var options = {};
	options.path = path[0];
	options.args = path.slice(1);
	options.extern = extern;
	
	// 载入子窗口，并在载入完成后重新定位弹出框使其居中显示
	popup.load(options).done(function() {
		popup_container.closest('.ui-dialog').position({
			my: 'center center',
			at: 'center center',
			of: $(document.body)
		});
	});
};

})();

})();