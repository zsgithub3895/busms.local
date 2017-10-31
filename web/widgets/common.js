/** 前置控件 */

W.define_widget({
	type: 'precede',
	name: 'p:select',
	description: '下拉框填充',
	selector: 'select[data-select]', 
	onrender: function(node) {
		var W = this, options = W.$(node).widget_attr('data-select', 'resource');
		var initial_options_length = options.from ? Number(options.from) : node.options.length;
		
		W.get(options.resource).done(function(data) {
			W.$(node).options(data, options.text, options.value, initial_options_length);
		});
	}
});

/** 标准控件 */

W.define_widget({
	name: 'auto-complete',
	description: '自动补全',
	selector: 'input[data-auto-complete]',
	onrender: function(node) {
		var W = this, options = W.$(node).widget_attr('data-auto-complete') || {},map_flag = false;
		if(!options.resource){
			options = W.$(node).widget_attr('data-auto-complete', 'resource');
		}
		
		if(options.text && options.value){
			map_flag = true;
		}
		
		var result={};
		
		var search_handler = function() {
			var value = $(node).val(), 
				resource = options.resource.replace(/\{this\}/, value); // FIXME
			
			W.get(resource).done(function(data) {
				result = {};
				var display = map_flag ? []:data;
				if(map_flag && data){
					var i;
					for(i=0;i<data.length;i++){
						display.push(data[i][options.text]);
						result[data[i][options.text]] = data[i][options.value];
					}
				}
				$(node).autocomplete('option', 'source', display)
					   .autocomplete('option', 'search', function() {
						   $(node).autocomplete('option', 'search', search_handler);
					   })
					   .autocomplete('search', value);				
			});
			return false;
		};
		
		$(node).autocomplete({
			search: search_handler
		});
		
		W.data_getter(node, function() {
			return map_flag?result[$(node).val()]:$(node).val();
		});		
	}
});

W.define_widget({
	name: 'button', 
	description: '按钮美化',
	selector: 'button',
	onrender: function(node) {
		var e = $(node), icon = e.attr('data-icon');
		if (icon) {
			$(node).button({ icons: { primary: 'ui-icon-' + icon }, text: !!e.text() });
		} else {
			$(node).button();
		}
	}
});

W.define_widget({
	name: 'date-picker',
	description: '日期选择',
	selector: 'input.w-date-picker',
	onrender: (function() {
		$.datepicker.setDefaults({
			changeMonth: true,
			changeYear: true,
			dateFormat: 'yy-mm-dd',
			dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
			monthNamesShort: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月']
		});
		
		var pad = function(val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};
		
		var PATTERNS = [{
			pattern: /^(\d{4}-\d{2}-\d{2})$/,
			getter: function(v) { return v; },
			setter: function(m) { return m[0]; }
		}, {
			pattern: /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/,
			getter: function(v) { return v + ' 00:00:00'; },
			setter: function(m) { return m[1]; }
		}, {
			pattern: /^\d+$/,
			getter: function(v) { 
				return Date.parse(v + 'T00:00:00+08:00');
			},
			setter: function(m) {
				var date = new Date(parseInt(m[0]));
				return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
			}
		}];
		
		var DEFAULT_PATTERN = PATTERNS[0];
		
		return function(node) {	
			$(node).datepicker({ showAnim: 'fadeIn' });
			
			var pattern = DEFAULT_PATTERN;
			
			W.data_getter(node, function() {
				return pattern.getter($(node).val());
			});
			
			W.data_setter(node, function(value) {
				// 响应清空操作
				if (value === null) {
					$(node).val(null);
					return;
				}
				
				for (var i = 0; i < PATTERNS.length; i++) {
					var p = PATTERNS[i];
					var m = p.pattern.exec(value);
					if (m) {
						pattern = p;
						$(node).val(p.setter(m));
						return;
					}
				}
				W.error("不支持的日期格式: " + value);
			});
		};
	})()
});

W.define_widget({
	name: 'editable',
	description: '直接编辑',
	selector:'.w-editable', 
	onrender: function(node) {
		var W = this;
		
		var click_handler = function(e) {
			var node = $(this), value = node.text();
			
			var editor_id = node.attr('data-editor');
			
			// 创建编辑器
			var editor;
			if (editor_id) {
				editor = W.$(editor_id).node.clone();
				editor.removeAttr('id').addClass('ui-editor');
			} else {
				editor = $('<input type="text" class="ui-editor" />');
			}
			editor.val(value);
			
			node.empty().addClass("w-editing").append(editor.show());
			
			editor.bind('change blur', function(e) {
				if (node.hasClass("w-editing")) {
					node.removeClass("w-editing");
					
					var new_value = editor.val();
					W.later(function() {
						node.empty().text(new_value).one('click', click_handler);

						if (value != new_value) {
							node.change();
						}
					});
				}
				e.stopPropagation();
			});
			
			editor.keyup(function(e) {
				switch (e.keyCode) {
					case 13: { // ENTER
						$(this).blur();
						break;
					}
					case 27: { // ESCAPE
						editor.val(value);
						$(this).blur();
						break;
					}
				}
			});
			
			editor.focus();
			editor.select();
			
			e.stopPropagation();
		};
	
		$(node).one('click', click_handler);
	}
});

W.define_widget({
	name: 'enum',
	description: '枚举(本地)',
	selector: '[data-enum]', 
	onrender: function(node) {
		var W = this, elem = W.$(node), enum_data = elem.widget_attr('data-enum');
		
		if (enum_data) {
			var current_value;
			
			W.data_getter(node, function() {
				return current_value;
			});
			
			W.data_setter(node, function(value, vars) {
				var text = enum_data[value];
				if (text === undefined) text = '';
				current_value = value;
				elem.data(text, vars, true);
			});
		}
	}
});

W.define_widget({
	name: 'enum-lookup',
	description: '枚举(远程)',
	selector: '[data-enum-lookup]', 
	onrender: (function() {
		var cache = W.cache.create(); // 已获取的枚举数据缓存
		var queues = {}; // 枚举数据lookup资源 -> 等待该资源的节点列表
		
		var bind_data_handler = function(W, node, _enum) {
			var elem = W.$(node);
			var current_value;
			
			W.data_getter(node, function() {
				return current_value;
			});
			
			W.data_setter(node, function(value, vars) {
				current_value = value;
				
				var text = _enum[value];
				if (text === undefined) text = '';
				elem.data(text, vars, true);
			});
		};
		
		W.namespace('lookup', {
			/**
			 * 清除所有枚举数据缓存
			 */
			clear: function() {
				cache.clear();
				return this;
			},
		
			/**
			 * 刷新当前窗口应用的枚举数据并刷新窗口的相应展现
			 */
			refresh: function(lookups) {
				var W = this, chain = W.Chain();
				
				W.each(W.Array(lookups), function(lookup) {
					chain.join(
						W.get(lookup).done(function(_enum) {
							cache.put(lookup, _enum);
							W.fire('lookup:refresh', lookup); 
						})
					);
				});
				
				return chain;
			}
		});
		
		return function(node) {
			var W = this, elem = W.$(node), lookup = elem.attr('data-enum-lookup');
			
			if (!lookup) return;
			
			var _enum = cache.get(lookup);
			if (_enum) {
				// 缓存命中，直接设置数据绑定接口
				bind_data_handler(W, node, _enum);
			} else {
				if (queues[lookup]) {
					// 如果已经发起了请求，则将当前节点加入到同队列中，以便响应时一并处理
					var chain = W.Chain(), token = chain.next_token();
					queues[lookup].push({ W: W, node: node, success: function() { chain.yield(token, 'success'); }});
				} else {
					queues[lookup] = [{ W: W, node: node }];
					
					// 发起请求
					W.get(lookup).done(function(_enum) {
						cache.put(lookup, _enum);
						
						var queue = queues[lookup];
						for (var i = 0; i < queue.length; i++) {
							var e = queue[i];
							bind_data_handler(e.W, e.node, _enum);
							e.success && e.success();
						}
						
						delete queues[lookup];
					});
				}
			}
			
			elem.on('lookup:refresh', function(e, _lookup) {
				if (lookup != _lookup) return;
				elem.data(elem.data());
			});
		};
	})()
});

W.define_widget({
	name: 'submit',
	description: '提交按钮美化',
	selector: 'input:submit',
	onrender: function(node) {
		var e = $(node), icon = e.attr('data-icon');
		if (icon) {
			$(node).button({ icons: { primary: 'ui-icon-' + icon }});
		} else {
			$(node).button();
		}
    }
});

W.define_widget({
	name: 'tile',
	description: '下拉框平铺',
	selector: 'select.w-tile',
	onrender: function(select, render_context) {
		var W = this, multiple = $(select).attr('multiple');
		
		var root = $('<div />'), name;
		if (!multiple) {
			name = W.unique_id();
		}
		
		for (var i = 0; i < select.options.length; i++) {
			var option = $(select.options[i]), id = W.unique_id();
			var input;
			
			if (multiple) {
				input = $('<input type="checkbox" />');
			} else {
				input = $('<input type="radio" name="' + name + '"/>');
			}
			
			input.attr('id', id).attr('value', option.attr('value'));
			
			var label = $('<label />').attr('for', id).text(option.text());
			
			if (option.prop('selected')) {
				input.attr('checked', true);
			}
			
			root.append(input).append(label);
		}
		
		render_context.alter(root, true);
		
		root.buttonset();
		
		W.$(root).data_getter(function() {
			if (multiple) {
				var data = [];
				root.children(':checked').each(function() {
					data.push($(this).attr('value'));
				});
				return data;
			} else {
				return root.children(':checked').attr('value');
			}
		});
		
		W.$(root).data_setter(function(data) {
			data = (data == '' ? [] : W.Array(data));
			root.find(':input').each(function() {
				var input = $(this), value = input.attr('value'), checked = (W.in_array(data, value) != -1);
				if (checked) {
					input.prop('checked', true).next().addClass('ui-state-active');
				} else {
					input.prop('checked', false).next().removeClass('ui-state-active');
				}
			});
		});
	}
});

W.define_widget({
	name: 'radio',
	description: '下拉框单选平铺',
	selector: 'select.w-radio',
	onrender: function(select, render_context) {
		var W = this;
		
		var root = $('<div />'), name = W.unique_id();
		
		for (var i = 0; i < select.options.length; i++) {
			var option = $(select.options[i]), id = W.unique_id();
			var input;
			
			input = $('<input type="radio" name="' + name + '"/>');
			
			input.attr('id', id).attr('value', option.attr('value'));
			
			var label = $('<label style="margin:0 5px 0 0"/>').attr('for', id).text(option.text());
			
			if (option.prop('selected')) {
				input.attr('checked', true);
			}
			
			root.append(input).append(label);
			
		}
		
		render_context.alter(root, true);
		
		W.$(root).data_getter(function() {
			var a = root.children(':checked').attr('value');
			return a;
		});
		
		W.$(root).data_setter(function(data) {
			root.find(':input').each(function() {
				var input = $(this), value = input.attr('value'), checked = (value == data);
				if (checked) {
					input.prop('checked', true);
				} else {
					input.prop('checked', false);
				}
			});
		});
	}
});

W.define_widget({
	name: 'search',
	description: '搜索框',
	selector: 'input[type="search"]',
	onrender: function(node) {
		var W = this, search = $(node);
		
		var search_icon = $('<span class="ui-icon ui-icon-search">Search</span>');
		var close_icon = $('<span class="ui-icon ui-icon-close" style="display:none">Close</span>');
		
		var search_timeout;
		var search_handler = function() {
			var value = search.val();
			// 当值不为空时，显示清除按钮，否则隐藏清除按钮
			if (value) {
				close_icon.show();
			} else {
				close_icon.hide();
			}
			W.$(search).fire('search', value);
		};
		
		search.wrap('<div class="ui-search ui-widget-panel">')
			  .before(search_icon, close_icon);
		
		search.keyup(function() {
			// 避免每次键盘事件都触发过滤，这里设定一个200ms的延迟
			if (search_timeout) {
				window.clearTimeout(search_timeout);
			}
			search_timeout = window.setTimeout(search_handler, 200);
		});
		
		close_icon.click(function() {
			if (search_timeout) {
				window.clearTimeout(search_timeout);
				search_timeout = false;
			}
			search.val('');
			search_handler();
		});
    }
});

/** 装饰控件 */

W.define_widget({
	type: 'decorative',
	name: 'd:href',
	description: '点击事件绑定',
	selector: '[data-href]',
	onrender: function(node, render_context) {
		var W = this, node = W.$(node), href = node.attr('data-href');
		
		var vars = render_context.vars;
		
		// 为了向下兼容性
		if (W.DataContext) {
			vars = W.extend(Object.create(vars), { C: node.DataContext() });
		}
		
		var handler = W.Action(href, vars);
		
		if (node.node_name() === 'a') {
			node.attr('href', 'javascript:void(0)');
		}
		
		node.on('click', function() {
			node.attr('disabled', true).add_class('ui-state-disabled');
			
			W.current_context().done(function() {
				node.remove_attr('disabled').remove_class('ui-state-disabled');
			});
			
			handler.apply(this, arguments);
		});
	}
});

W.define_widget({
	type: 'decorative',
	name: 'd:listen',
	description: '事件监听',
	selector: '[data-listen]',
	onrender: function(node, render_context) {
		var W = this, elem = W.$(node), attr = elem.widget_attr('data-listen', 'action');
		
		var target = attr.target, event = attr.on || 'change', action = attr.action;
		
		if (action) {
			var handler = W.Action('transmit(arguments[2]) -> ' + action, render_context.vars);
			
			(target ? W.$(target) : elem).on(event, function(e) {
				handler.call(elem, this);
			});
		}
	}
});

W.define_widget({
	type: 'decorative',
	name: 'd:resource',
	description: '初始资源绑定',
	selector: '[data-resource]',
	onrender: function(node) {
		var W = this, resource = W.$(node).attr('data-resource');
		
		W.get(resource).done(function(data) {
			W.$(node).data(data);
		});
		
		// 当资源更新时，重新进行数据绑定
		/*
		W.on(W.Event(resource, 'update'), 'public', function(e, data) {
			W.$(node).data(data);
		});
		*/
	}
});

W.define_widget({
	type: 'decorative',
	name: 'd:value',
	description: '初始数据绑定',
	selector: '[data-value]',
	onrender: function(node) {
		var W = this, elem = W.$(node), value = elem.attr('data-value');
		
		elem.data(JSON.parse(value));
	}
});