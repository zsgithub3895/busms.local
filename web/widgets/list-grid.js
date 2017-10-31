W.define_widget({
	name: 'list grid',
	description: '列表表格',
	selector: '.w-list-grid',
	onrender: (function() {
		var FOOT_HTML = '<tfoot><tr><td class=""></td></tr></tfoot>';	
		
		Object.defineProperty(W.fn, 'list_grid', {
			get: function() {
				return this.expando('widget:list_grid');
			}
		});
		
		var PAGINATOR_HTML = 		
			'<table cellspacing="0" cellpadding="0" style="margin-right:0px"><tbody><tr>' +		
			'<td style="padding:2px 5px"><input type="hidden" name="totalPage" />显示下<span style="cursor:pointer" id="showMoreHandler"><span name="total">0</span>条中的<span name="nextFirst">0</span> - <span name="nextLast">0</span>条 </span> <span class="arrow_down_single"></span><select name="currentPage" style="display:none"><option value="1">1</option></select><input type="hidden" name="pageSize" value="10" /></td>' +
			'</tr></tbody></table>';
		
		var DEFAULT_TBODY_HTML = 
			'<tr><td style="text-align:left;padding:5px">没有记录</td></tr>';
		
		var GridData = function(paginator_data, sort_data) {
			W.extend(this, paginator_data, sort_data, {
				toString: function() {
					var arr = [];
					arr.push(paginator_data.currentPage);
					arr.push(paginator_data.pageSize);
					if (sort_data.order_by) {
						arr.push(sort_data.order_by);
						arr.push(sort_data.order);
					}
					return arr.join('-');
				},
				
				validate: function() {
					return !isNaN(paginator_data.currentPage || 1);
				}
			});
		};
		
		var DEFAULT_EVENTS = {
			"edit-row": true,
			"enter-row": false,
			"leave-row": false,
			"refresh": true,
			"select-row": true,
			"update-row": true
		};
		
		return function(grid,render_context) {
			var W = this, table, attr = W.$(grid).widget_attr('data-grid') || {},el = W.$(grid);
			
			
			
			var events = W.extend({}, DEFAULT_EVENTS, W.widget_switch(attr.events));
			
			var container;
			if (W.node_name(grid) === 'table') {
				table = $(grid);
			} else {
				container = $(grid);
				container.addClass("w-grid-container");
				table = container.find('>table');
				
				// 构建表格动作按钮
				var buttons = container.children('button');
				if (buttons.length) {
					var action_bar = $('<div class="w-grid-action-bar ui-state-default" />');
					action_bar.append(buttons);
					W.render_inner(action_bar);
					$(grid).prepend(action_bar);
				}
			}
			
			if (attr.title) {
				// 根据 title 属性，创建表格标题
				if (!container) {
					table.wrap('<div class="ui-widget-panel w-grid-container" />');
					container = table.parent(); 
				}
				
				var header = $('<div />').addClass('w-panel-header ui-widget-header').text(attr.title);
				var status = "show";
				header.bind('click dblclick', function() {
					switch (status) {
						case "show": {
							status = null;
							$(this).next().hide('blind', {}, 300, function() { status = "hide"; });
							break;
						}
						case "hide": {
							status = null;
							$(this).next().show('blind', {}, 300, function() { status = "show"; });
							break;
						}
					}
				});
				table.before(header);
			} else {
				if (!container) table.addClass('ui-widget-panel');
			}
			
			var head = table.find('thead'), row_def = table.find('tbody tr:first'), colspan = table.find('tbody td').length;
			
			// 查询信息
			var stored_query_data = {};
			
			// 排序信息
			var sort_data = {};
			
			var grid_sortable = $(grid).hasClass('w-grid-sortable');
			
			// 将 grid 定义行 detach
			row_def.detach();
			
			// 设置 table 和 thead 的样式
			table.addClass('ui-widget ui-widget-content');
			head.find('tr').addClass('ui-widget-header');
			
			// 处理表头
			head.find('th').each(function(i, e) {
				var th = $(e);
				if (th.hasClass('w-grid-select')) {
					// 处理全选列
					row_def.find('td:nth-child(' + (i + 1) + ')').addClass('w-grid-select');
					th.append($('<input type="checkbox" />').change(function() {
						var checked = $(this).prop('checked');
						table.find('.w-list-grid-tbody td:nth-child(' + (i + 1) + ') input:checkbox').prop('checked', checked);
					}));
				}
				
				th.wrapInner('<div />');
				
				if (i !== colspan - 1) {
					// 表头调整大小
					(function(th) {
						var th_next = th.next();
						var table_width, th_width, th_next_width;
						
						var RESIZE_HANDLER = function(e, ui) {
							var delta = ui.size.width - ui.originalSize.width;
							
							th_next.width(th_next_width - delta);
							th.width(th_width + delta);
							
							if (e.type === 'resizestop') {
								th.find('>div').css('width', 'auto');
							}
						};
						
						th.find('>div').resizable({
							handles: 'e',
							minWidth: 25,
							resize: RESIZE_HANDLER,
							start: function(event, ui) {
								table_width = table.width();
								th_width = th.width();
								th_next_width = th_next.width();
								
								$(this).resizable('option', 'maxWidth', th_width + th_next_width - 26);
							},
							stop: RESIZE_HANDLER
						});
					})(th);
				}
				
				if (th.hasClass('w-sortable')) {
					// 处理可排序列
					
					// 创建排序图标
					var icon = $('<span class="ui-icon" />');
					
					th.find('>div').append(icon.hide());
					
					// 单击表头后排序处理
					th.click((function(th, icon) {
						var column_name = th.attr('data-sortable');
						sort_data.order_by = column_name;
						
						switch (th.data('order')) {
						case 'asc': {
							sort_data.order = 'desc';
							icon.removeClass('ui-icon-carat-1-n').addClass('ui-icon-carat-1-s');
							break;
						}
						case 'desc':
						default: {
							sort_data.order = 'asc';
							icon.removeClass('ui-icon-carat-1-s').addClass('ui-icon-carat-1-n');
							break;
						}
						}
						
						th.data('order', sort_data.order);
						
						th.siblings('.w-sortable').data('order', 'none').find('.ui-icon').hide();
						icon.show();
						
						W.$(grid).refresh();
					}).curry(th, icon));
				}
			});
			
			// 创建当记录为空时 tbody 的内容
			var default_tbody = $(DEFAULT_TBODY_HTML);
			default_tbody.find('td').attr('colspan', colspan);
			table.find('tbody').addClass('w-list-grid-tbody').empty().append(default_tbody);
			
			var paginator, current_page, total_page,page_select;
			if (attr.paginator !== 'false') {
				// 创建 tfoot
				var foot = $(FOOT_HTML);
				foot.find('td').attr('colspan', colspan);
				head.after(foot);
				
				// 创建 paginator
				paginator = $(PAGINATOR_HTML);
				paginator.hide();
				current_page = paginator.find('*[name="currentPage"]');
				total_page = paginator.find('*[name="totalPage"]');
				var gridData = W.data();
				
				
				var seek_timeout, seek_interval;
				
				// 操作 paginator 将触发 grid:refresh 事件
				paginator.change(function(e) {
					e.stopPropagation();
					W.$(grid).refresh();
				});
				
				paginator.find("#showMoreHandler").click(function(){
					if(total_page.val() == current_page.val())
						return;
					current_page.val(parseInt(current_page.val())+1);
					paginator.change();
				});
				
				// 渲染 paginator
				foot.find('td').append(paginator);			
			}
			
			// 默认监听同 window 的 form:query 事件
			W.$(table).on('form:query', function(e, query_data) {			
				stored_query_data = query_data;
				if (current_page) current_page.val(1);
				W.$(grid).refresh();
			});
			
			var tbody = table.children('tbody');
			
			var add_row = function(data, parent,index) {
				var row = row_def.clone(true);
				row.addClass('w-row-with-data').show();			
				row.find('td.w-grid-select').append($('<input type="checkbox"/>').change(function(e) {
					e.stopPropagation();
				}));

				row.find('td.w-grid-index').html(index+row.find('td.w-grid-index').html());
				row.find('td.w-grid-index').css('text-align','left');
				
				tbody.append(row);
				
				W.render_inner(row[0]);
				
				var listRow = {
						remove : function(){
							el.fire("list:remove-row",W.$(row).data());
							row.remove();
						},
						update : function(data){
							W.$(row).data(data, parent);
						},
						data : function(){
							return W.$(row).data();
						},
						unSelect : function(){
							
						}
						
					}
				
				var rowCheckbox = row.find('input[type="checkbox"]');
				var rowRadio = row.find('input[type="radio"]');
				
				W.$(row).on('mouseenter', function() {
					this.node.addClass('row-hover');
					this.fire('grid:enter-row', this.data());
				}).on('mouseleave', function() {
					this.node.removeClass('row-hover');
					this.fire('grid:leave-row', this.data());
				}).on('change', function() {
					this.fire('grid:update-row', this.data());
				}).on('dblclick', function() {
					this.fire('grid:edit-row', this.data(),this);
				});
				
				if(rowCheckbox.size() > 0){//多选模式
					row.click(function(e){	
						if(!rowCheckbox.prop("checked")){//选中
							row.addClass('row-highlight');
							rowCheckbox.prop("checked",true);
							el.fire('grid:select-row', W.$(row).data());
						}else{
							row.removeClass('row-highlight');
							rowCheckbox.prop("checked",false);
							el.fire('grid:unselect-row', W.$(row).data());
						}
						e.stopPropagation();
					});
					rowCheckbox.click(function(e){
						if($(this).prop("checked")){//选中
							row.addClass('row-highlight');
							$(this).prop("checked",true);
							el.fire('grid:select-row', W.$(row).data());
						}else{
							row.removeClass('row-highlight');
							$(this).prop("checked",false);
							el.fire('grid:unselect-row', W.$(row).data());
						}
						e.stopPropagation();
					});
				}else
				if(rowRadio.size() > 0){//单选模式
					row.click(function(){						
						rowRadio.click();
					});
					rowRadio.click(function(e){
						tbody.find('tr.row-highlight').removeClass('row-highlight');
						$(this).addClass('row-highlight');
						el.fire('grid:select-row', W.$(row).data(),listRow);
						e.stopPropagation();
					});
				}else{
					row.click(function(){						
						tbody.find('tr.row-highlight').removeClass('row-highlight');
						row.addClass('row-highlight');
						el.fire('grid:select-row', W.$(row).data(),listRow);
					});
				}
				
				W.$(row).render(row.toArray()).done(function() {
                    this.data(data, parent);
				 });
			};
			
			// 设定 data getter
			W.data_getter(grid, function() {
				var data = [];
				$(grid).find('tbody.w-list-grid-tbody tr.w-row-with-data').each(function() {
					data.push(W.$(this).data());
				});
				return {
					paginator: new GridData(paginator ? W.$(paginator).data() : {}, sort_data),
					result: data
				};
			});
			
			var index = 1;
			// 设定 data setter
			W.data_setter(grid, function(data,clear) {
				var total, result;
				
				if (paginator) {
					// 绑定 paginator 数据					
					var first=data.paginator.first,last=data.paginator.last;
					if(last <  data.paginator.total){
						if(last+data.paginator.pageSize > data.paginator.total){
							last = data.paginator.total;
						}else{
							last += data.paginator.pageSize;
						}
						first += data.paginator.pageSize;
					}else{
						last = data.paginator.total;
						first = last - data.paginator.pageSize;
						if(first < 1)
							first = 1;
					}
					
					data.paginator.nextFirst = first;
					data.paginator.nextLast = last;
					
					W.$(paginator).data(data.paginator);
					current_page.empty();					
					for(var i=1; i<=data.paginator.totalPage; i++){
						current_page.append("<option value='"+i+"'>"+i+"</option>");
					}
					if(data.paginator.totalPage == 0)
						current_page.append("<option value='"+1+"'>"+1+"</option>");
					current_page.val(data.paginator.currentPage);
					total_page.val(data.paginator.totalPage);
					
					result = data.result;
					total = data.paginator.total;	
					if(data.paginator.total > data.paginator.pageSize * data.paginator.currentPage)
						paginator.show();
					else
						paginator.hide();
				} else {
					result = W.is_array(data) ? data : data.result;
					total = result.length;
				}
				if(clear || tbody.text() == "没有记录"){
					index=1;
					tbody.empty();
				}
					
				
				if (total === 0) {
					tbody.append(default_tbody.clone());
					return;
				}
				
				// 清除全选
				head.find('th.w-grid-select > input[type="checkbox"]').prop('checked', false);
				
				for (var i = 0; i < result.length; i++) {
					add_row(result[i], result, index++);
				}
			});
			
			
			
			W.$(grid).expando('widget:list_grid', {
				add_row: function(data, parent) {
					tbody.children(':not(.w-row-with-data)').remove();
					add_row(data, parent);
				},
				
				refresh: function() {
					var grid_data = new GridData(paginator ? W.$(paginator).data() : {}, sort_data);
					if (grid_data.validate()) {
						events["refresh"] && W.$(grid).fire('grid:refresh', stored_query_data, grid_data);
					}
				},
				
				select_row: function(func) {
					W.$(grid).node.find('tbody.w-list-grid-tbody tr.w-row-with-data').each(function() {
						var row = W.$(this), row_data = row.data();
						var checkbox = $(this).find('td.w-grid-select input:checkbox'), checked = checkbox.prop('checked');
						checkbox.prop('checked', func.call(row_data, checked));
					});
				},
				
				selected_rows: function(func) {
					var data = [];
					W.$(grid).node.find('tbody.w-list-grid-tbody tr.w-row-with-data td.w-grid-select input:checked').closest('tr').each(function() {
						data.push(W.$(this).data());
					});
					if (func) {
						if (typeof func === "string") {
							var tmp = [];
							$.each(data,function(i,n){
								tmp.push(n[func]);								
							});
							data = tmp;
						} else {
							data = W.map(data, func);
						}
					}
					return data;
				},
				unselect_rows: function(){
					W.$(grid).node.find('tbody.w-list-grid-tbodys tr.row-highlight').each(function() {
						$(this).removeClass("row-highlight");
						$(this).find("input").prop("checked",false);
					});
				}
			});
			
			
		};
	})()
});