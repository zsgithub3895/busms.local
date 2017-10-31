/**
 * 搜索框插件
 */
W.define_widget({
	name : "搜索框",
	selector : ".w-search-input",
	onrender : (function(){
		
		Object.defineProperty(W.fn, 'search_input', {
			get: function() {
				return this.expando('widget:search_input');
			}
		});
		
		var WRAP_HTML = "<div class='w-search-input-wrap'><div class='w-search-input-container'></div></div>";
		var SEARCH_HTML = "<span class='icon-search'><img src='images/new/search-icon-gray.png' title='搜索'/></span>";
		var CLEAR_HTML = "<span class='icon-clear'><img src='images/new/icon-close-gray.png' /></span>";
		var TIP_HTML = "<div class='w-search-input-tip'>多个关键字用换行(SHIFT+ENTER)隔开</div>";
		var MENU = "<ul class='w-search-menu'></ul>";
		var MENU_HANDLE = "<span class='w-search-menu-handle'></span>";
		
		return function(node,render_context){
			var W = this, el = W.$(node), node = $(node), attr = W.$(node).widget_attr('data-search-input'), menu_attr = el.widget_attr('data-search-menu');
			var default_opt = {tip:"请输入查询条件",trigger:"keyup",auto:1};
			if(node.is('textarea')){
				default_opt.trigger = 'enter';
			}
			attr = $.extend(default_opt, attr || {});
			
			var wrap = $(WRAP_HTML);
			var searchHandle = $(SEARCH_HTML);
			var clearHandle = $(CLEAR_HTML);
			var menuHandle ;
			var menu;
			node.wrap(wrap);
			
			el = W.$(node.parent().parent());
			render_context.alter(el);
			
			var parentNode = node.parent();
			parentNode.append(searchHandle);
			
			parentNode.append(clearHandle);
			var menu_select_value;
			if(menu_attr){
				menuHandle = $(MENU_HANDLE);
				node.css('padding-left','28px');
				menu = $(MENU);
				parentNode.append(menuHandle);
				parentNode.append(menu);
				menuHandle.popmenu({menuSelector:menu});
				$.each(menu_attr,function(i,n){
					if(menu_select_value == undefined){
						menu_select_value = n;
						menu.append("<li value='"+n+"' class='selected'>"+i+"</li>");
					}else{
						menu.append("<li value='"+n+"' >"+i+"</li>");
					}
						
				});
				$("li", menu).click(function(){
					menu_select_value = $(this).attr('value');
					$(this).addClass('selected').siblings('.selected').removeClass('selected');
					menu.hide();
				});
			}else{
				node.css('padding-left','18px');
			}
			
			searchHandle.click(function(){search();});
			clearHandle.click(function(){reset();search();});
			
			reset();
			function reset(){
				node.val("");
				showClear();
				check();
			}
			function showClear(){
				if(node.val() != attr.tip && node.val() != ""){
					clearHandle.show();
				}else
					clearHandle.hide();
			}
			function check(){
				if($.trim(node.val()) == ""){
					node.val(attr.tip);
					node.addClass("default-style");
				}else{
					node.removeClass("default-style");
				}
			}
			function getVal(){
				if($.trim(node.val())==attr.tip)
					return "";
				var keyword = node.val();
				//取出回车换行和多余的空格
				keyword = keyword.replace(/\r/g,"\n");
				keyword = keyword.replace(/\n{1,}/g,"\n");
				keyword = $.trim(keyword);
				return [keyword,menu_select_value];
			}
			var changeTimeout;
			node.click(function(){
				if($.trim(node.val()) == attr.tip){
					node.val(""); 	
					node.removeClass("default-style");
				}		
				
			});
			
			function search(){
				var val = getVal();
				if(node.attr("data-validate-exp")){
					var result = W.$(node).validate();
					if(!result.flag){
						return;
					}
				}
				if(changeTimeout){
					clearTimeout(changeTimeout); changeTimeout = 0;
				}					
				changeTimeout = setTimeout(function(){
					el.fire("search",val[0], val[1]);					
					changeTimeout = 0;
				},200);
			}
			
			//如果是textarea，则设置高度随内容自适应
			
			if(node.is('textarea') && attr.expandHeight){
				 var oHeight = node.outerHeight();
				 var tip = $(TIP_HTML);
				 var clickExpand = false;
				 node.wrap('<div class="w-search-textarea-wrap"></div>');
				   node.dblclick(function(){
					   expand();					   
				   });
				   node.blur(function(){
						deExpend();   
				   });
				   node.click(function(){expand()});
				   if(attr.expandTip)
					   tip.html(attr.expandTip);
				   node.after(tip);
				   function expand(){
					   if(clickExpand)
						   return;
					   node.addClass('expand').animate({height:attr.expandHeight+"px"},400,function(){ tip.show();});
					   clickExpand = true;
				   }
				   function deExpend(){
					   $(node).height(oHeight);
				   	   $(node).removeClass("expand");
					   clickExpand = false;
					   tip.hide();
				   }
				   if(attr.trigger == "enter"){
					node.keydown(function(e){
						if(e.keyCode == 13){
							if(!e.shiftKey){
								deExpend();
								return false;
							}
						}
					});
				}
			}
			
			// 设定 data getter
			el.data_getter(function() {
				return getVal();
			});
			
			node.blur(check);			
			if(attr.auto){
				if(attr.trigger == "enter"){
					node.keydown(function(e){
						showClear();
						if(e.keyCode == 13){
							if(!e.shiftKey){
								search();
								return false;
							}
						}
					});
				}else{
					node[attr.trigger](function(){
						showClear();
						search();
					});
				}
			}	
			el.expando('widgets:search_input', {reset : reset});
			el.data_setter(function(data) {
				node.val(data);
			});
		}
	})()
});
