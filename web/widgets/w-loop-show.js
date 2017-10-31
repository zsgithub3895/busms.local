Object.defineProperty(W.fn, 'loop_show', {
	get: function() {
		return this.expando('widget:loop_show');
	}
});
W.define_widget({
	name : "循环显示",
	selector : ".w-loop-show",
	onrender : function(node,render_context){
		var W = this, el = W.$(node),node = $(node);
		var loopBodyDef = node.find(".loop-body");
		loopBodyDef.detach();
		node.empty();
		var loop_add = function(data,parent){
			var loopBody = loopBodyDef.clone(true);
			node.append(loopBody);
			W.render_inner(loopBody[0]);	
			W.render(loopBody.children().toArray());
			W.$(loopBody).data(data,parent);			
		}
		W.data_setter(node, function(data,clear) {
			if(clear){
				node.empty();
			}				
			for (var i = 0; i < data.length; i++) {
				loop_add(data[i], data);
			}
		});
		W.$(node).expando('widgets:loop_show',{
			add : function(data, parent) {
				loop_add(data, parent);
			},
			clear : function(){
				node.empty();
			}
		});
	}
});