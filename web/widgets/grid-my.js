// JavaScript Document
(function(){
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
function pageing(page, pageSize, totalCount, showSize){
	showSize = showSize || 10;
	var totalPage = Math.ceil(totalCount/pageSize);
	var startPage = page - Math.floor(showSize/2);
	if(startPage < 1)
		startPage = 1;
	var endPage = startPage + showSize - 1;
	if(endPage > totalPage){
		endPage = totalPage;
		startPage = endPage - showSize + 1;
		if(startPage < 1)
			startPage = 1;
	}
	var prePage = page - 1;
	var nextPage = page + 1;
	if(prePage == 0)
		prePage = 1;
	var nextPage = page + 1;
	if(nextPage >= totalPage)
		nextPage = totalPage;
	var startNum = (page - 1) * pageSize + 1;
	var endNum = startNum + pageSize;
	if(endNum > totalCount)
		endNum = totalCount;
	return {
		page : page,
		pageSize : pageSize,
		totalCount : totalCount,
		startPage : startPage,
		endPage : endPage,
		startNum : startNum,
		endNum : endNum,
		prePage : prePage,
		nextPage : nextPage
	}
}
var adjustPage = function(page,total,pageSize,tPageSize){
		page = parseInt(page);
		total = parseInt(total);
		pageSize = parseInt(pageSize);
		tPageSize = parseInt(tPageSize);
		if(pageSize < 1 ){
			pageSize = 10;
		}
		if(pageSize == tPageSize)
			return page;
		var first = pageSize * (page - 1) + 1;
		var tPageCount = (total + tPageSize - 1 ) / tPageSize;
		var _page = Math.floor((first + tPageSize - 1) / tPageSize);
		if(!_page)
			_page = 1;
		if(_page > tPageCount)
			_page = tPageCount;
		if(_page < 1)
			_page = 1;
		return _page;
	}
widget.NewGrid = W.Class('NewGrid', widget.Grid, {
	NewGrid: function(W, render_context) {
		this.Grid(W,render_context);
	},
	FOOT_HTML : '<tbody class="w-grid-toolbar">'+
							'<tr>'+
								'<td colspan="8"></td>'+
							'</tr>'+
						'</tbody>',
	PAGINATOR_HTML : '<table class="w-paginator"><tbody><tr ><td colspan="11">'+
			'<div class="w-paginator-area">'+
			'<ul class="w-paginator-pages w-paginator-item">'+
				
			'</ul>'+
			'<div class="w-grid-toolbar-split w-paginator-item"></div>'+
			'<div class="w-paginator-pagesize w-paginator-item">'+
				' <input type="text"  name="pageSize" maxlength="3"  title="输入完成，回车确认" value="10"/> 条/页'+
				//'<div class="w-paginator-down w-paginator-pagesize-show"><span class="pagesize-show">10</span>'+
					//'<ul class="w-paginator-pagesize-list"><li>20</li><li>30</li><li class="w-paginator-pagesize-input"><input type="text" /></li></ul>'+
				//'</div> 条/页'+
			'</div>'+
			'<div class="w-grid-toolbar-split w-paginator-item"></div>'+
			'<div class="w-paginator-item w-paginator-current-item"> <span name="first">0</span> - <span name="last">0</span>/<span name="total">0</span> </div>'+
			'<ul class="w-paginator-pre-next"><li class="pre-btn"></li><li class="next-btn"></li></ul>'+
			'</div>'+
			'</td></tr><tr style="display:none">' +		
			'<td class="w-paginator-icon"><div class="ui-corner-all"><span class="ui-icon ui-icon-seek-first"></span></div></td>' + 
			'<td class="w-paginator-icon"><div class="ui-corner-all"><span class="ui-icon ui-icon-seek-prev"></span></div></td>' +
			'<td class="w-paginator-separator"><span></span></td>' +
			'<td>第 <input type="text" name="currentPage" value="1" /> 页 / 共 <span name="totalPage">0</span> 页</td>' +
			'<td class="w-paginator-separator"><span></span></td>' +
			'<td class="w-paginator-icon"><div class="ui-corner-all"><span class="ui-icon ui-icon-seek-next"></span></div></td>' + 
			'<td class="w-paginator-icon"><div class="ui-corner-all"><span class="ui-icon ui-icon-seek-end"></span></div></td>' +
			'<td class="w-paginator-separator"><span></span></td>' +
			'<td>每页 <select><option value="10">10</option><option value="20">20</option><option value="30">30</option><option value="50">50</option></select></td>' +
			'<td class="w-paginator-separator"><span></span></td>' +
			'<td>当前显示，总数</td>' +
			'</tbody></tr></table>',
	EMPTY_HTML : '<tr><td style="text-align:center;padding:20px">没有符合查询条件的记录</td></tr>',
	
	/** 渲染表头 */
	_render_thead: function() {
		var thead = this.thead = this.table.find('.w-grid-thead:not(thead)');
		thead.replaceWith($("<thead class='w-grid-thead' />").append(thead.children()));
		this.inherited();
	},
	
	_render_paginator : function(){
		// 创建 paginator
		var paginator_node, current_page, total_page, current_pagesize = 10;
		this.paginator_node = paginator_node = $(this.PAGINATOR_HTML);
		var attr = this.options;	
		var self = this;
		if(attr.pageSize){
			paginator_node.find('*[name="pageSize"]').val(attr.pageSize);
		}
		//旧的分页，目前还是可用，只不过隐藏掉了
		current_page = paginator_node.find('*[name="currentPage"]');
		total_page = paginator_node.find('*[name="totalPage"]');
		paginator_node.find('td.w-paginator-icon div').hover(function() { $(this).addClass('ui-state-hover'); }, function() { $(this).removeClass('ui-state-hover'); });
		
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
		paginator_node.find('input[type="text"]').change(function(){
			current_page.val(1);
		});
		
		// 操作 paginator 将触发 grid:refresh 事件
		
		paginator_node.change(function(e) {
			e.stopPropagation();
			self.W.grid.refresh();
		});
		
		this.paginator = W.$(paginator_node);
	},
	_page_show : function(pData){
			var paginator_node = this.paginator.node;
			var pagesArea = paginator_node.find('.w-paginator-pages');
			pagesArea.empty();
			var showPage=5;
  			 if(pData.currentPage>0&&pData.currentPage<=99){
  				 showPage=5;
  			 }
  			 else if(pData.currentPage>99&&pData.currentPage<=999){
      				 showPage=3;
  			 }
			var pageInfo = pageing(pData.currentPage,pData.pageSize,pData.total,showPage);
			//var moveFirst = $('<li class="w-paginator-move-btn"><img src="images/new/move-first.png" /></li>');
			//pagesArea.append(moveFirst);
			//var movePre = $('<li class="w-paginator-move-btn"><img src="images/new/move-pre.png" /></li>');
			//pagesArea.append(movePre);
			//添加第一页
			if(pageInfo.startPage > 1){
				pagesArea.append(genPageLi(1,"1..."));
			}
			for(var i = pageInfo.startPage ; i <= pageInfo.endPage; i++){
				var li = genPageLi(i);
				if(i == pData.currentPage){
					li.addClass("w-paginator-pages-current");
				}
				pagesArea.append(li);
			}
			//添加最后一页
			if(pageInfo.endPage < pData.totalPage){
				pagesArea.append(genPageLi(pData.totalPage,"..."+pData.totalPage));
			}
		
			var pagesizeArea = paginator_node.find('.w-paginator-pagesize');
			var pageSizeInput = $('input', pagesizeArea);
			pageSizeInput.val(pData.pageSize);
			
			//上一页 下一页
			var preBtn = paginator_node.find('.pre-btn');
			var nextBtn = paginator_node.find('.next-btn');
			preBtn.unbind("click");
			nextBtn.unbind("click");
			preBtn.click(function(){
				goPage(pageInfo.prePage);	
			});
			nextBtn.click(function(){
				goPage(pageInfo.nextPage);	
			});
			function genPagesizeLi(pagesize){
				var li = $("<li>"+pagesize+"</li>");
				return li;
			}
			
			function goPage(page){
				
				paginator_node.find('*[name="currentPage"]').val(page);
				paginator_node.change();
			}
			
			function genPageLi(page, text){
				if(!text)
					text = page;
				var li = $("<li>"+text+"</li>");
				li.click(function(){
					goPage(page);
				});
				return li;
			}
			
			
			
	},
	_render_data_accessor: function() {
		var W = this.W, self = this;
		
		// 设定 data getter
		W.data_getter(function() {
			var data = [];
			
			self.tbody.find('tr').each(function() {
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
				self._page_show(data.paginator);
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
		});
	},
	_render_toolkit: function() {
		if (this.action_bar || this.paginator) {
			var toolkit = $('<div />').addClass('w-grid-toolbar');
	
			this.action_bar && toolkit.append(this.action_bar);
			this.paginator_node && toolkit.append(this.paginator_node);
			
			this.container.prepend(toolkit);
		}
	},
	
})
W.define_widget({
	name: 'grid',
	description: '表格',
	selector: '.w-grid',
	onrender: function(node, render_context) {
		var W = this;
		var grid = new widget.NewGrid(W.$(node), render_context);
		grid.render();
	}
});

})()