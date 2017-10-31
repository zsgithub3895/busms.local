// JavaScript Document
W.define_widget({
	name: '初始值设置',
	description: '初始值设置',
	selector: '*[init-value]',
	onrender: function(node){
		var W = this;
		var value = node.attr("init-value");
		W.$(node).data(value);
		return;		
	}
	
});