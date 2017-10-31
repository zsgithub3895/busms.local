W.define_widget({
	name : "window change listener",
	description : '页面改变监听器',
	selector : '.w-change-listener',
	onready : function(node){
		var W = this,elem = W.$(node);
		W.fire("switch","close-confirm", function(){
			return elem.change();
		});
	},
	onrender : function(node){
		var W = this,elem = W.$(node), node = $(node),attr = W.$(node).widget_attr('data-change-listener') || {};
		if(attr.disable == 'true'){
			return;
		}
		var change = {};
		
		W.on("w:change",function(e,key){
			if(!key)
				key = "default";
			change[key] = true;
		});
		W.on("w:cancel-change",function(e,key){
			if(key == "default")
				return;
			delete change[key];
		});
		elem.mixin({
			change : function(){
				if(attr.disable)
					return false;
				var flag = false;
				$.each(change,function(i,e){
					flag = true;
					return false;
				});
				return flag;
			}
		});
	}
})
W.define_widget({
	name : "window change listener unit",
	description : '页面改变监听单元',
	selector : '.w-change-listen-unit',
	onrender : function(node){
		var W = this,elem = W.$(node), node = $(node),attr = W.$(node).widget_attr('data-change-listen-unit') || {};
		var event = attr.event || 'change';
		var key = attr.key || 'default';
		node[event](function(e){
			W.fire("w:change",key);	
		});
	}
})