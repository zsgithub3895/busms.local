// JavaScript Document
(function($) {
	//取消事件冒泡
	$.extend({
		cancelBubble:function(event){
				if($.browser.msie){
					window.event.cancelBubble=true;			
				}else{
					event.stopPropagation();	
				}
		},
		//取出数组中的元素
		getInArray:function(array,fn){
			for(var i=0 ;i<array.length; i++){
				if(fn(array[i]))
					return array[i];
			}
		},
		arrayToMap : function(array, keyFn){
			var map = {};
			for(var i=0; i<array.length; i++){
				map[keyFn(array[i])] = array[i];
			}
			return map;
		},
		filterArray:function(array,fn){
			var tmp = [];
			for(var i=0; i<array.length; i++){
				if(fn(array[i]))
					tmp.push(array[i]);
			}
			return tmp;
		}
	});
	
	//将目标剧中显示
	$.extend({
		floatCenter:function(options){
			options = $.extend({
				who:"",
				target:window,
				offset:{x:0,y:0},
				resizeCenter:false
			}, options || {});
			localCenter();
			if(options.resizeCenter)
				$(target).resize(localCenter);
			function localCenter(){
				var whoH = $(options.who).outerHeight();
				var whoW = $(options.who).outerWidth();	
				var targetH = options.target==window?$(options.target).height():$(options.target).innerHeight();				
				var targetW = options.target==window?$(options.target).width():$(options.target).innerWidth();					
				var targetOffset = options.target==window?{left:0,top:0}:$(options.target).offset();
				var startLeft = targetOffset.left + targetW/2 - whoW/2 + options.offset.x;
				var startTop = targetOffset.top + targetH/2 - whoH/2  + options.offset.y;
				if(options.target != window){
					var position = $(options.target).css("position");
					if(position == "absolute" || position == "relative"){
						startTop = (targetH-whoH)/2 + options.offset.y;
						startLeft = (targetW-whoW)/2 + options.offset.x;
					}
				}
				if(options.target == window)
					startTop += $(window).scrollTop();
				$(options.who).css("position","absolute");				
				$(options.who).css({top:startTop,left:startLeft});
			}
		}
	});	
	$.fn.extend({
		popmenu : function(options){
			options = $.extend({
				menuSelector:"",
				hideTimeOut:200,
				showTime:0,
				hideTime:0,
				showType:"slideDown",
				hideType:"slideUp",
				event:"click",
				offset:[0,0],
				position:"absolute"
			},options ||{});
			var hideTimeout = null;
			var me = $(this);
			initEvent();
			var showStatus = 0;
			function initEvent(){
				$(options.menuSelector).mouseover(function(){
														 window.clearTimeout(hideTimeout);										
												});
				$(options.menuSelector).find(".stop_bubble").click(function(e){
																	$.cancelBubble(e);			
																});
				//$(options.menuSelector).click(hidePopmenu);
				$(options.menuSelector).mouseout(function(){
												hideTimeout = window.setTimeout(hidePopmenu,options.hideTimeOut);					   
											});
				me[options.event](function(){		
											window.clearTimeout(hideTimeout);
											showPopmenu();
										});
				$(me).mouseleave(function(){hideTimeout = window.setTimeout(hidePopmenu,options.hideTimeOut);});
			}
			function showPopmenu(){
				if(showStatus == 0){
					position();
					$(options.menuSelector)[options.showType](options.showTime,function(){showStatus = 1;});
				}
			}
			function hidePopmenu(){
				if(showStatus == 1)
					$(options.menuSelector)[options.hideType](options.hideTime,function(){showStatus = 0;});
			}	
			function position(){
				var pos;
				if(options.position == "absolute"){
					 pos = me.offset();
				}else{
					pos = me.position();
				}
				var top = pos.top + me.outerHeight()+options.offset[0];
				var left = pos.left + options.offset[0];
				$(options.menuSelector).css({top:top,left:left});
			}
		}
	});
	
})(jQuery);