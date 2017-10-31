// JavaScript Document
W.define_widget({
	name: 'textTip',
	description: '文本提示',
	selector: '.w-tips',
	onrender: function(node){
		var W = this, elem = W.$(node),attr = W.$(node).widget_attr('data-tips') || {};

		elem.node.addClass('w-textTip-color');
		
		elem.node.bind('click',function(e){
			if(attr.text === elem.data()) {
				elem.data('');
				elem.node.removeClass('w-textTip-color');
			}
		});
		
		elem.node.bind('blur',function(e){
			if(elem.data()===''){ 
				elem.data(attr.text);
				elem.node.addClass('w-textTip-color');	
			}else{
				elem.node.removeClass('w-textTip-color');	
			}
		});
	}
	
});