var GridData = W.Class('GridData', null, {
	GridData: function(paginator_data, sort_data) {
		W.extend(this, paginator_data, sort_data);
	}, 
	
	toString: function() {
		var arr = [];
		arr.push(this.currentPage);
		arr.push(this.pageSize);
		if (this.order_by) {
			arr.push(this.order_by);
			arr.push(this.order);
		}
		return arr.join('-');
	},
	
	validate: function() {
		return !isNaN(this.currentPage || 1);
	}
});

var Row = W.Class('Row', null, {
	Row: function(row, grid) {
		this.row = row;
		this.vars = W.extend(Object.create(grid.vars), { row: row })
	},
	
	data: function(value) {
		var row = this.row;
		if (arguments.length == 0) {
			return row.data();
		} else {
			row.data(value, this.vars);
		}
	},
	/**是否选择该行*/
	is_checked:function(){
		return $(this.row.node).find('td.w-grid-select input:checkbox').prop('checked');
	},
	/**
	 * 根据属性选择行内元素
	 */
	select_item:function(attrName,attrValue,matchType){
		var item = [];
		var condition = "["+attrName+matchType+"'"+attrValue+"']";
		$(this.row.node).find(condition).each(function(){
			item.push(W.$(this));
		});
		return item;
	}
});

widget.Grid = W.Class('Grid', widget.Base, {
	Grid: function(W, render_context) {
		this.Base(W, render_context);
		this.query_data = {};
		this.sort_data = {};
		this.vars = W.extend(Object.create(W.layout.vars), { grid: this });
	},
	
	EMPTY_HTML: '<tr><td style="text-align:center;padding:20px">没有符合查询条件的记录</td></tr>',
	
	PAGINATOR_HTML: 		
		'<table class="w-paginator"><tbody><tr>' +		
		'<td class="w-paginator-icon"><div class="ui-corner-all"><span class="ui-icon ui-icon-seek-first"></span></div></td>' + 
		'<td class="w-paginator-icon"><div class="ui-corner-all"><span class="ui-icon ui-icon-seek-prev"></span></div></td>' +
		'<td class="w-paginator-separator"><span></span></td>' +
		'<td>第 <input type="text" name="currentPage" value="1" /> 页 / 共 <span name="totalPage">0</span> 页</td>' +
		'<td class="w-paginator-separator"><span></span></td>' +
		'<td class="w-paginator-icon"><div class="ui-corner-all"><span class="ui-icon ui-icon-seek-next"></span></div></td>' + 
		'<td class="w-paginator-icon"><div class="ui-corner-all"><span class="ui-icon ui-icon-seek-end"></span></div></td>' +
		'<td class="w-paginator-separator"><span></span></td>' +
		'<td>每页 <select name="pageSize"><option value="10">10</option><option value="20">20</option><option value="30">30</option><option value="50">50</option></select></td>' +
		'<td class="w-paginator-separator"><span></span></td>' +
		'<td>当前显示 <span name="first">0</span> - <span name="last">0</span>，总数 <span name="total">0</span></td>' +
		'</tbody></tr></table>',
	
	mixin_name: 'grid',
	
	/** 默认事件开关 */
	events: {
		"edit-row": true,
		"enter-row": false,
		"leave-row": false,
		"refresh": true,
		"select-row": true,
		"update-row": true,
		"sort-row":true,
		"load-children-row":true
	},
	
	/** 默认功能开关 */
	features: {
		paginator: true,
		sort:false
	},
	
	/** 默认配置 */
	options: {
		/**
		 * 右键菜单元素ID
		 * @type String
		 */
		contextmenu: null,
		
		/**
		 * 标题
		 * @type String
		 */
		title: null
	},
	
	options_attr_name: 'data-grid',
	
	sort_row_index: function(){
		var W = this.W;
		this.tbody.find('.w-grid-index').each(function(i,e){
			if(W.$(this).data() != ++i){
				W.$(this).data(i);
			}
		});
	},
	
	add_row: function(row_data, row_index) {
		var W = this.W, self = this;
		
		var row_node = W.clone(this.row_def);
		
		this.tbody.append(row_node);
		
		this._render_row_listener(row_node);
		
		var row = new Row(W.$(row_node), this);

		this.render(row_node, { vars: row.vars }).done(function() {
			row.data(row_data);
			
			// 对标注的特殊列进行处理
			row_node.children('td').each(function(i, e) {
				var td = $(e);
				
				if(self.column_drag == i){
					var _span=$('<span/>').addClass('ui-icon ui-icon-transferthick-e-w');
					td.append(_span);
				}
				
				if (self.column_select == i) {
					// 处理选择列
					td.addClass('w-grid-select').append(
						$('<input type="checkbox" />').change(function(e) {
							self._on_row_select();
							e.stopPropagation(); 
						})
					);
				}
				
				if (self.column_index == i) {
					// 处理编号列
					td.addClass('w-grid-index');
					W.$(td).data(row_index);
				}
			});
			// 调用data-grid-filter
			var filter = row_node.attr('data-grid-filter');
			if (filter) {
			    var handler = row.vars[filter];
			    handler.apply(this, [row_data, row_node]);
			}

		});
	},
	
	empty: function() {
		var node = $(this.EMPTY_HTML);
		node.find('td').attr('colspan', this.column);
		
		this.tbody.empty().append(node);
	},
	
	refresh: function() {
		var W = this.W;
		var grid_data = new GridData(this.paginator ? this.paginator.data() : {}, this.sort_data);
		if (grid_data.validate()) {
			this.events["refresh"] && W.fire('grid:refresh', this.query_data, grid_data);
		}
	},
	
	select_row: function(func) {
		var W = this.W;
		this.tbody.find('tr').each(function() {
			var row = W.$(this), row_data = row.data();
			var checkbox = $(this).find('td.w-grid-select input:checkbox'), checked = checkbox.prop('checked');
			checkbox.prop('checked', func.call(row_data, checked));
		});
		this._on_row_select();
	},
	
	selected_rows: function(func) {
		var data = [];
		this.tbody.find('td.w-grid-select input:checked').closest('tr').each(function() {
			data.push(W.$(this).data());
		});
		if (func) {
			if (typeof func === "string") {
				data = W.map(data, function() {
					return this[func];
				});
			} else {
				data = W.map(data, func);
			}
		}
		return data;
	},
	/**
	 * 根据条件选择行
	 * 返回Row对象的数组
	 */
	select_Rows: function(func) {
		var rows = [],self=this;
		this.tbody.find('tr').each(function() {
			if(func && W.is_function(func)){
				func(new Row(W.$(this), self)) && rows.push(new Row(W.$(this), self));
			}else{
				rows.push(new Row(W.$(this), self));
			}
		});
		return rows;
	},
	
	_on_row_select: function() {
		if (this.column_select !== undefined) {
			var inputs = this.tbody.find('td:nth-child(' + (this.column_select + 1) + ') input:checkbox');
			var total = inputs.length, checked = inputs.filter(':checked').length;
			
			this.column_select_checkbox.prop('checked', total == checked);
			
			if (!this.action_bar) return;
			if (checked <= 1) {
				this.action_bar.children('button.w-grid-select-1').button('enable');
			} else {
				this.action_bar.children('button.w-grid-select-1').button('disable');
			}
		}
	},
	
	_window_resize:function(){
		var grid = $(this.node);
		var _wr=grid.parent(),_whp=grid.parent();

		var delta = _wr.width() - _whp.width();
		
		var WRRESIZE = function(w_change) {
			if(w_change == true || delta != _wr.width() - grid.find('.dtbody').width()){//表头拖动也会触发该事件
				grid.find('th').each(function(){
					$(this).attr('style','');
				});
				grid.find('.dtbody').width(_whp.width());
				grid.find('.dthead').width(_whp.width()-17);//减去滚动条宽度
			}
			grid.find('.dtbody').height(_whp.height()-grid.find('.ui-grid-toolkit').innerHeight());// TODO
		};
		
		_wr.resize(WRRESIZE);
		
		WRRESIZE(true);
	},
	
	_render: function() {
		var grid = $(this.node), options = this.options;
		
		// FIXME
		if (options.title && this.render_context.extern) {
			this.render_context.extern.title(options.title);
		}
		
		if (W.node_name(this.node) === 'table') {
			this.table = grid;
			this.table.wrap('<div />');
			this.container = this.table.parent();
			
			this.alter(this.container);
		} else {
			this.container = grid;
			this.table = grid.children('table');
		}
		
		this.container.addClass("ui-widget-panel w-grid-container");
		this.table.addClass('ui-widget ui-widget-content');
		
		this._render_buttons();
		this.features['paginator'] && this._render_paginator();
		this._render_toolkit();
		
		this._render_thead();
		this._render_tbody();
		
		this._render_data_accessor();
		this._render_listener();
		
		if(grid.hasClass('fit-head')){
			var _dthead = $(this.node).find('.dthead');
			var d_tbody = $('<div class="dtbody"/>');
			_dthead.before(d_tbody);
			d_tbody.append(this.table);
			d_tbody.width(_dthead.width());
			
			_dthead.width(_dthead.width()-17);
			$(this.node).removeClass('ui-widget-panel');
			d_tbody.css('overflow-y', 'scroll');
			d_tbody.css('overflow-x', 'hidden');
			this._window_resize();
		}
	},
	
	/** 渲染表格动作条 */
	_render_buttons: function() {
		var buttons = this.container.children('button');
		if (buttons.length) {
			this.action_bar = $('<div class="w-grid-action-bar" />');
			this.action_bar.append(buttons);
			this.render(this.action_bar, { vars: this.vars });
		}
	},

	/** 渲染表头 */
	_render_thead: function() {
		var self = this;
		var thead = this.thead = this.table.find('thead');
		var column = this.column = this.table.find('thead th').length;
		
		thead.find('tr').addClass('ui-grid-header');
		var _thead_temp = thead;
		/***/
		if($(self.node).hasClass('fit-head')){
			var _d_thead=$('<div class="dthead" style="position:relative"/>'),h_table = $('<table class="ui-widget ui-widget-content" style="box-shadow:0 0 2px #ccc;"/>');
			_d_thead.append(h_table);
			thead.parent().before(_d_thead);
			h_table.append(thead.clone());
		
			thead.find('th').each(function(i,e){
				$(e).empty();
			});
			_thead_temp = h_table;
		}
		/***/
		
		_thead_temp.find('th').each(function(i, e) {
			var th = $(e);
			
			//处理拖动列
			if(th.hasClass('w-grid-drag')){
				if (self.column_drag !== undefined) {
					W.error('重复定义拖动列');
				} else {
					self.column_drag = i;
				}
			}
			
			//处理树状列
			if(th.hasClass('w-treegrid-tree')){
				if (self.column_tree !== undefined) {
					W.error('重复定义树状列');
				} else {
					self.column_tree = i;
				}
			}
			
			// 处理选择列
			if (th.hasClass('w-grid-select') || th.hasClass('w-treegrid-select')) {
				if (self.column_select !== undefined) {
					W.error('重复定义选择列');
				} else {
					self.column_select = i;
					if(th.hasClass('w-treegrid-select-no-children')){
						self.column_select_style = 'no-children';
					}

					// 全选框
					var checkbox = self.column_select_checkbox = $('<input type="checkbox" style="margin-top:4px"/>');
					checkbox.change(function() {
						var checked = $(this).prop('checked');
						self.tbody.find('td:nth-child(' + (self.column_select + 1) + ') input:checkbox').prop('checked', checked);
						self._on_row_select();
					});
					th.append(checkbox);
				}
			}
			
			// 处理编号列
			if (th.hasClass('w-grid-index') || th.hasClass('w-treegrid-index')) {
				if (self.column_index !== undefined) {
					W.error('重复定义编号列');
				} else {
					self.column_index = i;
				}
			}
			
			th.wrapInner('<div />');
			
			// 处理列大小拖动
			if (i !== column - 1) {
				(function(th) {
					var th_next = th.next();
					var table_width, th_width, th_next_width;
					
					var RESIZE_HANDLER = function(e, ui) {
						var delta = ui.size.width - ui.originalSize.width;
						
						th_next.width(th_next_width - delta);
						th.width(th_width + delta);
						if($(self.node).hasClass('fit-head')){
							$(thead.find('th')[i]).width(th.width());
							$(thead.find('th')[i]).next().width(th_next.width());
						}
						
						if (e.type === 'resizestop') {
							th.children('div').css('width', 'auto');
						}
					};
					
					th.find('>div').resizable({
						handles: 'e',
						minWidth: 25,
						resize: RESIZE_HANDLER,
						start: function(event, ui) {
							table_width = self.table.width();
							th_width = th.width();
							th_next_width = th_next.width();
							
							$(this).resizable('option', 'maxWidth', th_width + th_next_width - 26);
						},
						stop: RESIZE_HANDLER
					});
				})(th);
			}
			
			// 处理可排序列
			if (th.hasClass('w-sortable')) {
				// 创建排序图标
				var icon = $('<span class="ui-icon" />');
				
				th.children('div').append(icon.hide());
				
				// 单击表头后排序处理
				th.click((function(th, icon) {
					var column_name = th.attr('data-sortable');
					self.sort_data.order_by = column_name;
					
					switch (th.data('order')) {
					case 'asc': {
						self.sort_data.order = 'desc';
						icon.removeClass('ui-icon-carat-1-n').addClass('ui-icon-carat-1-s');
						break;
					}
					case 'desc':
					default: {
						self.sort_data.order = 'asc';
						icon.removeClass('ui-icon-carat-1-s').addClass('ui-icon-carat-1-n');
						break;
					}
					}
					
					th.data('order', self.sort_data.order);
					
					th.siblings('.w-sortable').data('order', 'none').find('.ui-icon').hide();
					icon.show();
					
					self.refresh();
				}).curry(th, icon));
			}
		});
	},
	
	_render_tbody: function() {
		var W = this.W;
		
		var tbody = this.tbody = this.table.find('tbody');
		tbody.addClass('w-grid-tbody');
		
		// 获取定义行
		this.row_def = this.table.find('tbody tr:first');
		this.row_def.detach().addClass('w-grid-row');
		
		this.empty();
		
		// 定义右键菜单
		var menu;
		if (this.options.contextmenu) {
			menu = this.menu = W.$(this.options.contextmenu); 
		} else {
			var menus = this.container.children('menu');
			if (menus.length == 1) {
				menu = W.$(menus.first());
			}
		}
		
		if (menu) {
			tbody.bind('contextmenu', function(e) {
				var row = $(e.target).closest('tr');
				var data = W.$(row).data();
				menu.data(data);
				W.context_menu.push(W, data, menu.node);
			});
		}
	},
	
	_render_paginator: function() {
		var W = this.W, self = this;
		
		// 创建分页器
		var paginator_node = this.paginator_node = $(this.PAGINATOR_HTML);
		
		var current_page = paginator_node.find('*[name="currentPage"]');
		var total_page = paginator_node.find('*[name="totalPage"]');
		
		paginator_node
			.find('td.w-paginator-icon div')
			.hover(function() { $(this).addClass('ui-state-hover'); }, function() { $(this).removeClass('ui-state-hover'); });
		
		var seek_timeout, seek_interval;
		
		// 首页
		paginator_node.find('span.ui-icon-seek-first').mousedown(function() {
			current_page.val(1); 
		}).mouseup(function() {
			current_page.change();
		});
		
		// 上一页
		paginator_node.find('span.ui-icon-seek-prev').mousedown(function() {
			current_page.val(Math.max(1, (parseInt(current_page.val()) || 1) - 1));
			seek_timeout = window.setTimeout(function() {
				seek_interval = window.setInterval(function() {
					current_page.val(Math.max(1, (parseInt(current_page.val()) || 1) - 1));
				}, 100);
			}, 500);
		}).mouseup(function() {
			if (seek_timeout) window.clearTimeout(seek_timeout);
			if (seek_interval) window.clearInterval(seek_interval);
			current_page.change();
		});
		
		// 下一页
		paginator_node.find('span.ui-icon-seek-next').mousedown(function() {
			current_page.val(Math.min(parseInt(total_page.text()) || 1, (parseInt(current_page.val()) || 1) + 1));
			seek_timeout = window.setTimeout(function() {
				seek_interval = window.setInterval(function() {
					current_page.val(Math.min(parseInt(total_page.text()) || 1, (parseInt(current_page.val()) || 1) + 1));
				}, 100);
			}, 500);
		}).mouseup(function() {
			if (seek_timeout) window.clearTimeout(seek_timeout);
			if (seek_interval) window.clearInterval(seek_interval);
			current_page.change();
		});
		
		// 末页
		paginator_node.find('span.ui-icon-seek-end').mousedown(function() {
			current_page.val(parseInt(total_page.text()) || 1); 
		}).mouseup(function() {
			current_page.change();
		});
		
		// 每页多少记录
		paginator_node.find('select').change(function() {
			current_page.val(1);
		});
		
		// 操作 paginator 将触发 grid:refresh 事件
		paginator_node.change(function(e) {
			e.stopPropagation();
			self.refresh();
		});
		
		this.paginator = W.$(paginator_node);
	},
	
	_render_toolkit: function() {
		if (this.action_bar || this.paginator) {
			var toolkit = $('<div />').addClass('ui-state-default ui-grid-toolkit');
	
			if($(this.node).hasClass('fit-head')){
				toolkit.width('100%');
			}
			
			this.action_bar && toolkit.append(this.action_bar);
			this.paginator_node && toolkit.append(this.paginator_node);
			
			this.container.prepend(toolkit);
		}
	},
	
	_render_data_accessor: function() {
		var W = this.W, self = this;
		
		// 设定 data getter
		W.data_getter(function() {
			var data = [];
			
			self.tbody.children('tr.w-grid-row').each(function() {
				data.push(W.$(this).data());
			});
			
			return {
				paginator: new GridData(self.paginator ? self.paginator.data() : {}, self.sort_data),
				result: data
			};
		});
		
		// 设定 data setter
		W.data_setter(function(data) {
			var total, result, first;
			
			if (self.paginator && data.paginator) {
				// 绑定 paginator 数据
				self.paginator.data(data.paginator);
				result = data.result;
				total = data.paginator.total;
				first = data.paginator.first;
			} else {
				result = W.is_array(data) ? data : data.result;
				total = result.length;
				first = 1;
			}
			
			if (total === 0) {
				self.empty();
				return;
			} else {
				self.tbody.empty();
			}
			
			// 清除全选
			if (self.column_select_checkbox) {
				self.column_select_checkbox.prop('checked', false);
			}
			
			for (var i = 0; i < result.length; i++) {
				self.add_row(result[i], first + i);
			}
			
			
			//添加拖拽功能
			self.features.sort && self.table.tableDnD({
				onDrop:function(table, row, new_index) {
					var row_node = W.$(row);
					self.sort_row_index();
					self.events["sort-row"] && row_node.fire('grid:sort-row',new Row(row_node,self),new_index);
				},
				dragHandle: ".w-drag-handle"
			});
		});
	},
	
	_render_listener: function() {
		var W = this.W, self = this;
		
		// 默认监听同 window 的 form:query 事件
		W.on('form:query', function(e, query_data) {
			self.query_data = query_data;
			
			if (self.paginator) {
				self.paginator.data(W.extend(self.paginator.data(), { currentPage: 1 }));
			}
			
			self.refresh();
		});
	},
	
	_render_row_listener: function(row_node) {
		var W = this.W, self = this, events = this.events;
		
		W.$(row_node).on('mouseenter', function() {
			this.node.addClass('ui-state-hover');
			events["enter-row"] && this.fire('grid:enter-row', this.data());
		}).on('mouseleave', function() {
			this.node.removeClass('ui-state-hover');
			events["leave-row"] && this.fire('grid:leave-row', this.data());
		}).on('change', function() {
			events["update-row"] && this.fire('grid:update-row', this.data());
		}).on('click', function(e) {
			if ($(e.target).is(":not(:input,a,option,.tree-click)") && $(e.target).closest('td').is(":not(.w-drag-handle)")) { // 仅当事件触发元素不是:input时才执行逻辑
				
				// 设置选择列
				row_node.find('td.w-grid-select input:checkbox').each(function() {
					$(this).prop('checked', !$(this).prop('checked'));
				});
				self._on_row_select(row_node);
				
				// 设置高亮，发送grid:select-row事件
				if (!row_node.hasClass('ui-state-highlight')) {
					self.tbody.find('tr.ui-state-highlight').removeClass('ui-state-highlight');
					row_node.addClass('ui-state-highlight');
					
					events["select-row"] && this.fire('grid:select-row', this.data());
				}
			}
		}).on('dblclick', function() {
			events["edit-row"] && this.fire('grid:edit-row', this.data());
		});
	}
});

widget.DesktopGrid = W.Class('DesktopGrid', widget.Grid, {
	DesktopGrid: function(W, render_context) {
		this.Grid(W, render_context);
	},
	
	_window_resize:function(){
		var grid = $(this.node);
		var _wr=grid.closest('.ui-resizable')/**窗口div*/,_whp=grid.closest('.ui-desktop-window-inner')/**确定表格大小的div*/;
		
		_whp.css('overflow','hidden');
		
		var delta = _wr.width() - _whp.width();
		
		var WRRESIZE = function(w_change) {
			if(w_change == true || delta != _wr.width() - grid.find('.dtbody').width()){//表头拖动也会触发该事件
				grid.find('th').each(function(){
					$(this).attr('style','');
				});
				grid.find('.dtbody').width(_whp.width());
				grid.find('.dthead').width(_whp.width()-17);//减去滚动条宽度
			}
			grid.find('.dtbody').height(_whp.height());// TODO
		};
		
		_wr.resize(WRRESIZE);
		
		WRRESIZE(true);
	},
	
	_render: function() {
		this.inherited();
		
		var _dthead = $(this.node).find('.dthead');
		var d_tbody = $('<div class="dtbody"/>');
		_dthead.before(d_tbody);
		d_tbody.append(this.table);
		d_tbody.width(_dthead.width());
		
		_dthead.width(_dthead.width()-17);
		
		d_tbody.css('overflow-y', 'scroll');
		d_tbody.css('overflow-x', 'hidden');
		
		this._window_resize();
	},
	
	_render_thead: function() {
		var self = this;
		var thead = this.thead = this.table.find('thead');
		var column = this.column = this.table.find('thead th').length;
		
		thead.find('tr').addClass('ui-grid-header');
		
		var _d_thead=$('<div class="dthead" style="position:relative"/>'),h_table = $('<table class="ui-widget ui-widget-content" style="box-shadow:0 0 2px #ccc;"/>');
		_d_thead.append(h_table);
		thead.parent().before(_d_thead);
		h_table.append(thead.clone());
		
		thead.find('th').each(function(i,e){
			$(e).empty();
		});
		
		h_table.find('th').each(function(i, e) {
			var th = $(e);
			//处理拖动列
			if(th.hasClass('w-grid-drag')){
				if (self.column_drag !== undefined) {
					W.error('重复定义拖动列');
				} else {
					self.column_drag = i;
				}
			}
			
			//处理树状列
			if(th.hasClass('w-grid-tree')){
				if (self.column_tree !== undefined) {
					W.error('重复定义树状列');
				} else {
					self.column_tree = i;
				}
			}
			
			// 处理选择列
			if (th.hasClass('w-grid-select')) {
				if (self.column_select !== undefined) {
					W.error('重复定义选择列');
				} else {
					self.column_select = i;

					// 全选框
					var checkbox = self.column_select_checkbox = $('<input type="checkbox" style="margin-top:4px"/>');
					checkbox.change(function() {
						var checked = $(this).prop('checked');
						self.tbody.find('td:nth-child(' + (self.column_select + 1) + ') input:checkbox').prop('checked', checked);
						self._on_row_select();
					});
					th.append(checkbox);
				}
			}
			
			// 处理编号列
			if (th.hasClass('w-grid-index')) {
				if (self.column_index !== undefined) {
					W.error('重复定义编号列');
				} else {
					self.column_index = i;
				}
			}
			
			th.wrapInner('<div />');
			
			// 处理列大小拖动
			if (i !== column - 1) {
				(function(th) {
					var th_next = th.next();
					var table_width, th_width, th_next_width;
					
					var RESIZE_HANDLER = function(e, ui) {
						
						var delta = ui.size.width - ui.originalSize.width;
						th_next.width(th_next_width - delta);
						th.width(th_width + delta);
						$(thead.find('th')[i]).width(th.width());
						$(thead.find('th')[i]).next().width(th_next.width());
						if (e.type === 'resizestop') {
							th.children('div').css('width', 'auto');
						}
					};
					
					th.find('>div').resizable({
						handles: 'e',
						minWidth: 25,
						resize: RESIZE_HANDLER,
						start: function(event, ui) {
							table_width = self.table.width();
							th_width = th.width();
							th_next_width = th_next.width();
							
							$(this).resizable('option', 'maxWidth', th_width + th_next_width - 26);
						},
						stop: RESIZE_HANDLER,
					});
				})(th);
			}
			
			// 处理可排序列
			if (th.hasClass('w-sortable')) {
				// 创建排序图标
				var icon = $('<span class="ui-icon" />');
				
				th.children('div').append(icon.hide());
				
				// 单击表头后排序处理
				th.click((function(th, icon) {
					var column_name = th.attr('data-sortable');
					self.sort_data.order_by = column_name;
					
					switch (th.data('order')) {
					case 'asc': {
						self.sort_data.order = 'desc';
						icon.removeClass('ui-icon-carat-1-n').addClass('ui-icon-carat-1-s');
						break;
					}
					case 'desc':
					default: {
						self.sort_data.order = 'asc';
						icon.removeClass('ui-icon-carat-1-s').addClass('ui-icon-carat-1-n');
						break;
					}
					}
					
					th.data('order', self.sort_data.order);
					
					th.siblings('.w-sortable').data('order', 'none').find('.ui-icon').hide();
					icon.show();
					
					self.refresh();
				}).curry(th, icon));
			}
		});
	},
	
	_render_buttons: function() {
		var W = this.W, extern = this.extern;
		
		var buttons = this.container.children('button');
		if (buttons.length) {
			this.action_bar = $('<div style="float:left" />');
			this.action_bar.append(buttons);
			this.render(this.action_bar, { vars: this.vars });
		}
	},
	
	_render_paginator: function() {
		var W = this.W, extern = this.extern;
		
		var paginator_node = this.paginator_node = $('<div style="float:right">');
		
		var self = this;
		var value = { currentPage: 1, pageSize: 10, totalPage: 0, first: 0, last: 0, total: 0 };
		
		var prev_node = $('<button>').button({ icons: { primary: 'ui-icon-seek-prev' }, text: false });
		prev_node.click(function() {
			value.currentPage = Math.max(1, (parseInt(value.currentPage) || 1) - 1);
			self.refresh();
		});
		
		var next_node = $('<button>').button({ icons: { primary: 'ui-icon-seek-next' }, text: false });
		next_node.click(function() {
			value.currentPage = Math.min(parseInt(value.totalPage) || 1, (parseInt(value.currentPage) || 1) + 1);
			self.refresh();
		});
		
		paginator_node.append(prev_node).append(next_node);
		
		var status_node = this.status_node = $('<span class="ui-grid-status">');
		
		this.paginator = W.$(paginator_node);
		
		this.paginator.data_getter(function() {
			return value;
		});
		
		this.paginator.data_setter(function(new_value) {
			value = new_value;
			update();  
		});
		
		this.paginator_context_menu = function() {
			return [{ 
				text: '首页', 
				icon: 'images/icon/icon_16_first.png', 
				disabled: (value.currentPage <= 1),
				action: function() {
					value.currentPage = 1;
					self.refresh();
				}
			}, {
				text: '末页', 
				icon: 'images/icon/icon_16_last.png', 
				disabled: (value.currentPage >= value.totalPage),
				action: function() {
					value.currentPage = value.totalPage;
					self.refresh();
				}
			}, '-', {
				text: '每页[10]条',
				disabled: (value.pageSize == 10),
				action: function() {
					value.currentPage = 1;
					value.pageSize = 10;
					self.refresh();
				}
			}, {
				text: '每页[20]条',
				disabled: (value.pageSize == 20),
				action: function() {
					value.currentPage = 1;
					value.pageSize = 20;
					self.refresh();
				}
			}, {
				text: '每页[50]条',
				disabled: (value.pageSize == 50),
				action: function() {
					value.currentPage = 1;
					value.pageSize = 50;
					self.refresh();
				}
			}];
		};
		
		function update() {
			status_node.text('当前显示 ' + value.first + ' - ' + value.last + '，总数 ' + value.total);
			
			if (value.currentPage > 1) {
				prev_node.button('enable');
			} else {
				prev_node.removeClass('ui-state-hover').button('disable');
			}
			
			if (value.currentPage < value.totalPage) {
				next_node.button('enable');
			} else {
				next_node.removeClass('ui-state-hover').button('disable');	
			}
		};
		
		update();
	},
	
	_render_toolkit: function() {
		var W = this.W, extern = this.extern;
		
		if (this.action_bar || this.paginator) {
			this.action_bar && extern.action_bar.append(this.action_bar);
			if (this.paginator_node) {
				extern.action_bar.append(this.paginator_node);
				extern.action_bar.context_menu(this.paginator_context_menu);
			}
		}
		
		extern.status_bar.append(this.status_node);
	}
});

W._import('js/jquery.tablednd.js');

W.define_widget({
	name: 'grid',
	description: '表格',
	selector: '.w-grid',
	onrender: function(node, render_context) {
		var W = this;

		// FIXME
		if (render_context.extern && $(node).hasClass('ui-fit')) {
			var extern_class_name = render_context.extern.class_name;
			if (extern_class_name == 'WindowExtern' || extern_class_name == 'TabProxyExtern') {
				var grid = new widget.DesktopGrid(W.$(node), render_context);
				grid.render();
				return;
			}
		}

		var grid = new widget.Grid(W.$(node), render_context);
		grid.render();
	}
});


widget.TreeGrid = W.Class('TreeGrid', widget.Grid,{
	TreeGrid: function(W, render_context) {
		this.Grid(W, render_context);
	},
	/**
	 * 重置行背景
	 */
	reset_trbg:function(){
		var _visiable_tr = this.tbody.find('tr:visible');
		_visiable_tr.filter('tr:even').each(function(){
			$(this).css('background-color','#fafcff');
		});
		_visiable_tr.filter('tr:odd').each(function(){
			$(this).css('background-color','#fff');
		});
	},
	
	show_children:function(_node,_data){
		var self = this;
		$(_node.data('_children')).each(function(){
			'open' == _data.state && 'none' != _node.css('display') && this.show();
			this.data('_children') && self.show_children(this, this.data('_arguments'));
		});
		self.reset_trbg();
	},
	
	hide_children:function(_node){
		var self = this;
		$(_node.data('_children')).each(function(){
			this.hide();
			this.data('_children') && self.hide_children(this);
		});
		self.reset_trbg();
	},
	
	select_row:function(row){
		//row是Row对象
		var self = this;
		var checkbox = row.row.node.find('td:nth-child(' + (self.column_select + 1) + ') input:checkbox'),checked = checkbox.prop('checked');
		checkbox.prop('checked', !checked);
		self._on_row_select(row.row.node);
	},
	
	_on_row_select: function(select_row,uc_children) {
		this.inherited();
		
		var self = this;
		
		//change时候修改子节点的选择框状态
		!uc_children && self.column_select !== undefined && select_row && select_row.data('_children') && select_row.data('_children').length > 0
		&& (function(){
			var checked = select_row.find('td:nth-child(' + (self.column_select + 1) + ') input:checkbox').prop('checked');
			
			$(select_row.data('_children')).each(function(){
				var checkbox = this.find('td:nth-child(' + (self.column_select + 1) + ') input:checkbox');
				checkbox.prop('checked', checked);
				checkbox.length && self._on_row_select(this);
			});
		})();
		
		//change时候修改父节点的选择框状态
		self.column_select !== undefined && select_row && select_row.data('_parent') && select_row.data('_parent').length > 0
		&& (function(){
			var _c = select_row.data('_parent').data('_children'), c_total=0;
			
			$(_c).each(function(){
				this.find('td:nth-child(' + (self.column_select + 1) + ') input:checkbox').prop('checked') && c_total++;
			});
			
			select_row.data('_parent').find('td:nth-child(' + (self.column_select + 1) + ') input:checkbox').prop('checked',_c.length == c_total);
			self._on_row_select(select_row.data('_parent'),true);
		})();
	},
	
	/**
	 * 添加行
	 * @param {String or jQuery} _parent 参考节点
	 * @param {Number} degree 当前节点的深度
	 * @param {mixed} row_data 行数据
	 * {
		state:'open',
		title:'bookName',
		data:{id:'1',bookName:'book1',description:'b1'},
		children:[{
			icon:'ui-icon-folder-collapsed',
			title:'bookName',
			data:{id:'2',bookName:'book2',description:'b2'}
		},{}]
	}
	 * @param {boolean} is_last 是否是最后一个子节点
	 * @param {Number} row_index 行编号
	 */
	add_children:function(row_data,arr){
		var _children = arr,_i = _children.length -1;
		for(;_i >=0;_i--){
			this.add_row(row_data.target,row_data.degree,_children[_i],(_i == _children.length -1));
		}
		row_data.target.parent().find('.loading').remove();
		this.show_children(row_data.target,row_data.target.data('_arguments'));
	},
	
	add_row: function(_parent,degree,row_data,is_last, row_index) {
		var W = this.W, self = this;
		
		var row_node = W.clone(this.row_def);
		row_node.data('_children_state',row_data.state);
		if(_parent == 'root'){
			this.tbody.append(row_node);
		}else{
			row_node.insertAfter(_parent[0]);
			('open' != _parent.data('_children_state')|| 'none' == _parent.css('display')) && row_node.hide();
			
			var _c = _parent.data('_children') || [];
			_c.unshift(row_node);
			_parent.data('_children',_c);//在父节点上标记子节点
			
			row_node.data('_parent',_parent);//在子节点上标记父节点
		}
		
		this._render_row_listener(row_node);
		
		var row = new Row(W.$(row_node), this);
		
		row_node.children('td').each(function(i, e) {
			var td = $(e);
			/**********树处理块*****************/
			(function(){
				if(self.column_tree == i){
					//缩进处理
					var _d = degree,_span,_div;
					for(;_d > 0;_d--){
						_span = $('<span/>'),_div=$('<div/>').addClass('span_expand');
						td.append(_span.addClass('tree-line-vertical').append(_div));
						_div.css({
							'margin-top':_span.height(),
							'width':_span.width()
						});
					}
					
					_span = $('<span/>'),_div=$('<div/>').addClass('span_expand');
					td.append(_span.addClass('tree-line-vertical tree-line-vertical-half').append(_div));
					_div.css({
						'margin-top':_span.height(),
						'width':_span.width()
					});
					
					(!row_data.children /*|| row_data.children.length == 0*/) && (function(){
						var _c = td.find('.tree-line-vertical:last').width('9px');
						is_last && _c.height('15px');
						_c.append($('<span/>').addClass('tree-line-horizotal'));
					})();
					
					row_data.children && (function(){
						var _click_icon = $('<ins/>').addClass('tree-click');
						if(row_data.state == 'open'){
							td.append(_click_icon.addClass('ui-icon tree-bg open'));
							row_data.init = true;
						} 
						
						if(row_data.state != 'open'){
							td.append(_click_icon.addClass('ui-icon tree-bg close'));
						}
						
						_click_icon.click(function(){
							if(row_data.state != 'open'){
								row_data.state = 'open';
								/*****/
								if(self.events["load-children-row"] && !row_data.init){
									row_data.target = row.row.node;
									row_data.degree = degree;
									
									var _loading = $('<tr class="w-grid-row loading"><td colspan="'+row_data.target.prev().children('td').length+'" style="height:8px"/></tr>');
									_loading.width(row_data.target.width());
									row_data.target.after(_loading);
									
									row.row.fire('grid:load-children-row',row_data);
									row_data.init = true;
								}
								/*****/
								_click_icon.addClass('open').removeClass('close');
								self.show_children(row.row.node,row_data);
								row.row.node.data('_arguments',row_data);
							}else{
								row_data.state = 'close';
								_click_icon.addClass('close').removeClass('open');
								self.hide_children(row.row.node);
								row.row.node.data('_arguments',row_data);
							}
						});
						
						
						//加行每次加在父节点下的第一个位置，所以children数据颠倒处理
						var _children = row_data.children,_i = _children.length -1;
						degree++;
						for(;_i >=0;_i--){
							self.add_row(row.row.node,degree,_children[_i],(_i == _children.length -1));
						}
					})();
					
					var _icon = $('<ins class="ui-icon tree-icon"/>');
					
					td.append(_icon);
					row_data.icon  && W.icon.apply(_icon,row_data.icon);
					(!row_data.icon) && _icon.addClass('tree-bg default-icon');
					
					if(row_data.title){
						td.append($('<span>'+ row_data.data[row_data.title] +'</span>').addClass('tree-title'));
						td.append($('<input type="hidden" name="'+td.attr('name')+'"/>'));
					}else{
						td.attr('name') && td.append($('<span name="'+td.attr('name')+'"/>').addClass('tree-title'));
					}
					td.removeAttr('name');
				}
			})();
		});


		row.row.node.data('_arguments',row_data);
		this.render(row_node, { vars: row.vars }).done(function() {
			
			row.data(row_data.data);
			
			
			// 对标注的特殊列进行处理
			row_node.children('td').each(function(i, e) {
				var td = $(e);
				//FIXME 如果想等父节点加载完再加载子节点，则可以把树处理块移到此处
				if (self.column_select == i && !(td.closest('tr').data('_parent') && 'no-children' == self.column_select_style)) {
					// 处理选择列
					td.addClass('w-grid-select').append(
						$('<input type="checkbox" />').change(function(e) {
							self._on_row_select($(this).closest('tr'));
							e.stopPropagation(); 
						})
					);
				}
				
				if (self.column_index == i) {
					// 处理编号列
					td.addClass('w-grid-index');
					W.$(td).data(row_index);
				}
			});
		});
	},
	
	_render_data_accessor: function() {
		var W = this.W, self = this;
		
		// 设定 data getter
		W.data_getter(function() {
			var data = [];
			
			self.tbody.children('tr.w-grid-row').each(function() {
				data.push(W.$(this).data());
			});
			
			return {
				paginator: new GridData(self.paginator ? self.paginator.data() : {}, self.sort_data),
				result: data
			};
		});
		
		// 设定 data setter
		W.data_setter(function(data) {
			var total, result, first;
			
			if (self.paginator && data.paginator) {
				// 绑定 paginator 数据
				self.paginator.data(data.paginator);
				result = data.result;
				total = data.paginator.total;
				first = data.paginator.first;
			} else {
				result = W.is_array(data) ? data : data.result;
				total = result.length;
				first = 1;
			}
			
			if (total === 0) {
				self.empty();
				return;
			} else {
				self.tbody.empty();
			}
			
			// 清除全选
			if (self.column_select_checkbox) {
				self.column_select_checkbox.prop('checked', false);
			}
			
			for (var i = 0; i < result.length; i++) {
				self.add_row('root',0,result[i],(i == result.length-1), first + i);
			}
			self.reset_trbg();
		});
	}
	
});

W.define_widget({
	name: 'treegrid',
	description: '树表格',
	selector: '.w-treegrid',
	onrender: function(node, render_context) {
		var W = this;

		var grid = new widget.TreeGrid(W.$(node), render_context);
		grid.render();
	}
});