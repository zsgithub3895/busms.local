// JavaScript Document
(function(){
widget.MyPopupExtern =  W.Class('MyPopupExtern', widget.Extern, {
	MyPopupExtern: function(target) {
		this.target = target;
		this._rendered = false;
		this._width = 600;
		this.dialog = UI.Dialog(target);
		this.path = undefined;
		var self = this;
		this.button_bar = {
			append : function(node){
				var btn = self.dialog.addButton($(node).text().replace(/[<>]/g,""));
				var _class = $(node).attr("class");
				btn.addClass(_class);
				return btn;
			}	
		};
	},
	
	render: function(content, header, footer, nav, aside) {
		if(header.length > 0){
			this.dialog.header(header.html());
			header.remove();
			header.length = 0;
		}else{
			this.dialog.header();
		}		
		var buttons = this.target.find('input:button.w-window-button');
		if(buttons.size() > 0)
			this.dialog.button(buttons,1);
		this._rendered = true;
		return buttons.toArray();		
	},
	
	title: function(value) {
		if (this._rendered) {
			this.dialog.setTitle(value);
		} else {
			this._title = value;
		}
	},
	
	html : function(html){
		this.dialog.html(html);
	},
	
	show : function(){
		
		var meta = this.meta;
		var width = parseInt(meta.width);
		var height = parseInt(meta.height);
		if(meta.unique == "true"){
			unique_w[this.path] = 1;
		}
		if (isNaN(width) || width < 20) {
			width = this._width;
		}
		if(meta.title)
			this.dialog.setTitle(this._title || meta.title);
		if(meta.icon)
			this.dialog.setIcon(this._icon || meta.icon);
		this.dialog.size({width:width,height:height}).show({modal:meta.modal,position:meta.position || "center",offset:{x:meta.offsetX,y:meta.offsetY}});
	},
	
	icon : function(value){
		if(this._rendered){
			this.dialog.setIcon(value);
		}else{
			this._icon = value;
		}
	},
	
	meta : function(meta){
		this.meta = meta;
		if(!meta.height){
			meta.height = 450;
		}
	},
	
	size : function(width, height){
		if(this._rendered){
			this.dialog.size({width:width,height:height});
		}else{
			this._size = {width : width, height : height};
		}
	},
	
	buttons : function(buttons){
		this.dialog.button(buttons,1);
	},
	width: function(value) {
		if (this._rendered) {
			dialog.size({width:width});
		} else {
			this._width = value;
		}
	}	
});
var unique_w = {};
window.W.default_popup_handler = function(path, handler) {
	if(unique_w[path])
		return;
	
	var popup_id = W.unique_id(),
		popup_container = $('<div />').attr('id', W.layout.actual_id(popup_id));
	
	W.node.append(popup_container);
	
	var extern = new widget.MyPopupExtern(popup_container);
	var dialog = extern.dialog;
	
	var popup = W.$(popup_id);
	
	popup.on('close', function(e) {
		dialog.remove();
		popup.clean();		
		delete unique_w[path];
		if (handler) {
			try {
				handler.apply(null, e.args);
			} catch (e) {
				W.error(e);
			}
		}
		e.stopPropagation();
	});
	
	dialog.bind("close",function(){
		popup.fire("close");
	});
	
	popup.on('meta', function(e, key, value) {
		var fn = extern[key];
		if(fn){
			fn.call(extern, value);
		}
		e.stopPropagation();
	});
	
	var options = {};
	options.path = path[0];
	options.args = path.slice(1);
	options.extern = extern;
	extern.html(popup_container);
	extern.path = path[0];
	// 载入子窗口，并在载入完成后重新定位弹出框使其居中显示
	popup.load(options).done(function(){
		extern.show();	
	});
};	
})();