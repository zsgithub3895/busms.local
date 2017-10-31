// JavaScript Document
W.define_widget({
	name: 'text-cut',
	description: '截取字符串',
	selector: '.text-cut',
	onrender: (function(){
			
		var defaultLength = 10, panel  = $('<div></div>');
		
		return function(node){
			
			var W = this, elem = W.$(node) ,showText = elem.data(),attr = W.$(node).widget_attr('data-trim') || {};  

		  if(attr.length) 
			  defaultLength = attr.length;
	
		  if(!showText){	
			W.data_setter(node, function(value, parent) {
				var v = String(value);
				showText = v ;
				if (v.length > defaultLength) {					
					elem.data(v.substring(0, defaultLength) + '...', parent, true);
				} else {
					elem.data(value, parent, true);
				}
				$(node).attr('title', v);
			});
		  }else{
			  if (showText.length > defaultLength) {
					elem.data(showText.substring(0, defaultLength) + '...', parent, true);
				} else {
					elem.data(showText);
				}
			  $(node).attr('title', v);
		  }
			
			/**
			elem.node.bind('mouseover',function(e){				
				$('body').append(panel);				
				panel.addClass('text-cut-panel');
				W.$(panel).data(showText);	
				panel.css({'width':$(this).width()});
				panel.css({'left':$(this).offset().left,'top':$(this).offset().top+$(this).height()+5});
				panel.slideDown(500);
			});
			
			elem.node.bind('mouseout',function(e){				
				panel.remove();
			});**/
		};
    	
	})()
	
});