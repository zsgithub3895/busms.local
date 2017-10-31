(function($){

$.fn.extend({
	preview : function(html){
	
	    var overlayPanel = $('<div style="left:0px;top:0px;position:absolute;width:100%;height:100%;background:#ADADAD;opacity:0.5;z-index: 9109;"></div>'); 
		
	    var viewPanel = $('<div style="border: 1px solid #D6D6D8;position: absolute;z-index: 9110;"><div style="margin:3px;"></div>');

	   // var closePanel = $('<div style="position:absolute;z-index: 9111;"><img alt="关闭" src="images/close.gif"></div>');
  
	    $(html).show();
		$('body').append(overlayPanel).append(viewPanel);//.append(closePanel);
		
		setTimeout(function(e){
			
			viewPanel.children().html(html);
			viewPanel.css({'left':$(window).width()/2-viewPanel.width()/2,'top':$(window).height()/2-viewPanel.height()/2});
			//closePanel.css({'left':viewPanel.offset().left+viewPanel.width()-10,'top':viewPanel.offset().top-10});
	
			//closePanel.bind('click',function(e){
			//	viewPanel.remove();
				//closePanel.remove();
			//	overlayPanel.remove();
			//});
			
			overlayPanel.bind('click',function(e){
				viewPanel.remove();
				//closePanel.remove();
				overlayPanel.remove();
			});
			
			$(viewPanel).draggable();
			
		},120);
    }
});

})(jQuery);