W.define_widget({
	name : "简单列表控件",
	selector : ".w-simple-list",
	onrender : (function(){
		
		
		var DEFAULT_TBODY_HTML = 
			'<tr class="default-html"><td style="text-align:center;padding:5px"></td></tr>';	
		var DEAULT_NO_DATA_TIP = "";
		
		Object.defineProperty(W.fn, 'simple_list', {
			get: function() {
				return this.expando('widget:simple_list');
			}
		});
		
		
		return function(node,render_context){
			var W = this, el = W.$(node),node = $(node),attr = el.widget_attr("data-simple-list") || {};
			var table,container;
			
			var noDataTip = attr.noDataTip || DEAULT_NO_DATA_TIP;
			
			var container;
			if (W.node_name(node) === 'table') {
				table = node;
			} else {
				container = node;
				//container.addClass("ui-widget-panel w-grid-container");
				table = container.find('>table');
			}
			
			if (!container) {
				table.wrap('<div class="ui-widget-panel w-grid-container" />');
				table.addClass('ui-widget-panel');
				container = table.parent();
			}
			
			table.addClass('ui-widget');
			
			var row_def = table.find('tbody:first tr:first'), colspan = table.find('tbody:first td').length,head = table.find('thead'), row_edit_def = table.find('tbody:first tr.row-editor');
			
			// 创建当记录为空时 tbody 的内容
			var default_tbody = $(DEFAULT_TBODY_HTML);
			default_tbody.find('td').addClass("notice").html(noDataTip);
			default_tbody.find('td').attr('colspan', colspan);
			row_def.detach();
			table.find('tbody').addClass('w-simple-list-tbody').empty().append(default_tbody);
			head.find('tr').addClass('ui-widget-header');
			
			var tbody = table.children('tbody');
			
			var row_index = 1;
			
			if($.trim(head.text()).length == 0){
				head.hide();
			}else{
				// 处理表头
				head.find('th').each(function(i, e) {
					var th = $(e);
									
					if (th.hasClass('w-list-select')) {
						if (W.column_select !== undefined) {
							W.error('重复定义选择列');
						} else {
							W.column_select = i;

							// 全选框
							var checkbox = W.column_select_checkbox = $('<input type="checkbox" style="margin-top:4px"/>');
							checkbox.change(function() {
								var checked = $(this).prop('checked');
								tbody.find('td:nth-child(' + (W.column_select + 1) + ') input:checkbox').prop('checked', checked);
							});
							th.append(checkbox);
						}
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
			}
			
			var moveUp = function(row){
				var prev = row.prev();
				if(prev.size() != 0){//如果不是第一个
					prev.before(row);
					W.fire("list:swap-rows",W.$(row),W.$(prev));
				}
				showMoveHandle()
			}
			var moveDown = function(row){
				var next = row.next();
				if(next.size() != 0){//如果存在下一个
					next.after(row);
					W.fire("list:swap-rows",W.$(row),W.$(next));
				}
				showMoveHandle();
			}
			function showMoveHandle(){
				$(node).find(".row-moveup:not(:first)").show();
				$(node).find(".row-movedown:not(:last)").show();
				$(node).find(".row-moveup:first").hide();
				$(node).find(".row-movedown:last").hide();
			}
			
			var get_add_row = function(data, parent, type) {
				var row ;				
				if(!type){
					row = row_def.clone(true);
				}else{
					row = row_edit_def.clone(true);
				}
				row.addClass('w-row-with-data').show();		
				
				row.find('.row-index').html(row_index++);				
				
				var listRow = {
					remove : function(){
						el.fire("list:remove-row",W.$(row).data());
						row.remove();
					},
					update : function(data){
						W.$(row).data(data);
					},
					data : function(){
						return W.$(row).data();
					},
					unSelect : function(){
						
					},
					node :function(){
						return W.$(row).node;
					}
					
				}
				row.find('.row-delete').click(function(e){
					listRow.remove();
					e.stopPropagation();					
				});
				row.find('.row-moveup').click(function(e){
					moveUp(row);
					e.stopPropagation();	
				});
				row.find(".row-movedown").click(function(e){
					moveDown(row);
					e.stopPropagation();	
				});
				row.find('.row-confirm-delete').click(function(e){
					el.fire("list:confirm-remove-row", listRow);
					e.stopPropagation();	
				});
				row.find('.row-select-btn').click(function(e){
					el.fire("list:row-select-bybtn", listRow,$(this).attr('id'));
					e.stopPropagation();	
				});
				row.find(".row-handle").click(function(e){
					var handleValue = $(this).attr('handle-value');
					el.fire('list:handle-select-row', W.$(row).data(),W.$(row),handleValue);	
					e.stopPropagation();
				});
				
				var rowCheckbox = row.find('input[type="checkbox"]');
				var rowRadio = row.find('input[type="radio"]');
				
				W.$(row).on('mouseenter', function() {
					this.node.addClass('ui-state-hover');
				}).on('mouseleave', function() {
					this.node.removeClass('ui-state-hover');
				}).on('change', function() {
					this.fire('list:update-row', this.data());
				}).on('dblclick', function() {
					this.fire('list:edit-row', this.data(),listRow);
				});				
				
				if(rowCheckbox.size() > 0){//多选模式
					row.click(function(e){	
						if(!rowCheckbox.prop("checked")){//选中
							row.addClass('ui-state-highlight');
							rowCheckbox.prop("checked",true);
							el.fire('list:select-row', W.$(row).data());
						}else{
							row.removeClass('ui-state-highlight');
							rowCheckbox.prop("checked",false);
							el.fire('list:unselect-row', W.$(row).data());
						}
						e.stopPropagation();
					});
					rowCheckbox.click(function(e){
						if($(this).prop("checked")){//选中
							row.addClass('ui-state-highlight');
							$(this).prop("checked",true);
							el.fire('list:select-row', W.$(row).data());
						}else{
							row.removeClass('ui-state-highlight');
							$(this).prop("checked",false);
							el.fire('list:unselect-row', W.$(row).data());
						}
						e.stopPropagation();
					});
				}else
				if(rowRadio.size() > 0){//单选模式
					row.click(function(){						
						rowRadio.click();
					});
					rowRadio.click(function(e){
						tbody.find('tr.ui-state-highlight').removeClass('ui-state-highlight');
						row.addClass('ui-state-highlight');
						listRow.unSelect = function(){
							row.removeClass("ui-state-highlight");
							rowRadio.prop("checked",false);
							el.fire('list:unselect-row',W.$(row).data(),listRow);
						}
						el.fire('list:select-row', W.$(row).data(),listRow);						
						e.stopPropagation();
					});
				}else{
					row.click(function(){						
						tbody.find('tr.ui-state-highlight').removeClass('ui-state-highlight');
						row.addClass('ui-state-highlight');
						el.fire('list:select-row', W.$(row).data(),listRow);
					});
				}				
				
				return row;
					
			};
			
			var add_row = function(data, parent, type) {
				var row = get_add_row(data, parent, type);		
				if(row.hasClass('row-editable')){
					var editable_handle = row.find('.row-edit-handle');
					function row_edit_show(){
						var data = W.$(row).data();
						var edit_row = get_add_row(data, parent, 'edit');							
						row.replaceWith(edit_row);
						W.render(edit_row.toArray()).done(function(){
							W.$(edit_row).data(data);
						});
						row = edit_row;	
						row.find(".row-edit-save").click(function(){
							W.$(node).validate().done(function(data){
								W.fire('row-save',W.$(row).data());
							});						
						});
						
					}
					if(editable_handle.size() > 0){
						editable_handle.click(row_edit_show);
					}else{
						row.one('click',row_edit_show);
					}
					
				}
				row.find(".row-edit-save").click(function(){
					W.$(node).validate().done(function(data){
						W.fire('row-save',W.$(row).data());
					});						
				});
				 W.$(row).render(row.toArray()).done(function() {
                     this.data(data);
				 });
				tbody.append(row);
			};
			
			var validate = function(){
				var row_flag = true;
				$(node).find('tbody.w-simple-list-tbody').each(function() {					
					var row = $(this);	
					row.find("*[data-validate-exp]").each(function(){
						var result = W.$(this).validator.validate();
						if(!result.flag){
							row_flag = false;
							return false;	
						}
					});
					if(!row_flag){
						row.addClass('row-validate-error');
						return false;
					}
				});
				return row_flag;
			}
			
			
			
			// 设定 data getter
			W.data_getter(node, function() {
				var data = [];
				$(node).find('tbody.w-simple-list-tbody tr.w-row-with-data').each(function() {					
					data.push(W.$(this).data());
				});
				return data;
			});
			
			W.data_setter(node, function(data,clear) {
				if(clear){
					row_index=1;
					tbody.empty().append(default_tbody);
				}
					
				for (var i = 0; i < data.length; i++) {
					tbody.find(".default-html").remove();
					add_row(data[i], data);
				}
				$(node).find(".row-moveup:first").hide();
				$(node).find(".row-movedown:last").hide();
			});
			
			W.$(node).expando('widget:simple_list',{
				add_row: function(data, type) {
					tbody.children(':not(.w-row-with-data)').remove();
					add_row(data,{}, type);
				},
				data_edited : function(){
					var data = [];
					$(node).find('tbody.w-simple-list-tbody tr.row-editor').each(function() {					
						data.push(W.$(this).data());
					});
					return data;
				},
				validate : function(){
					var W = el, chain = W.Chain(), token = chain.next_token();
					W.later(function() {
						if(validate()){
							chain.yield(token, 'success', W.data());
						}else{
							chain.yield(token, 'error');
						}						
					});
					return chain;
				},
				select_row: function(func) {
					W.$(grid).node.find('tbody.w-simple-list-tbody tr.w-row-with-data').each(function() {
						var row = W.$(this), row_data = row.data();
						var checkbox = $(this).find('td.w-list-checkbox input:checkbox'), checked = checkbox.prop('checked');
						checkbox.prop('checked', func.call(row_data, checked));
						var radio = $(this).find('td.w-list-radio input:checkbox'), checked = radio.prop('checked');
						radio.prop('checked', func.call(row_data, checked));
					});
				},
				
				row_select : function(index){
					 W.$(grid).node.find("tbody.w-simple-list-tbody tr.w-row-with-data:eq("+index+")").click();
				},
				
				selected_rows: function(func) {
				
					var data = [];
					tbody.find('tbody.w-simple-list-tbody tr.w-row-with-data  input:checked').closest('tr').each(function() {
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
				unselect_rows: function(){
					W.$(grid).node.find('tbody.w-simple-list-tbody tr.ui-state-highlight').each(function() {
						$(this).removeClass("ui-state-highlight");
						$(this).find("input").prop("checked",false);
					});
				}
			});
		}
	})()
});