(function($){
var UI = window.UI = {};
var zIndex = 1000;
UI.zIndex = function(){
	return zIndex++;
};
/**
 * overlay
 * */
(function(){
	var HTML = "<div class='html-ui-overlay'></div>";
	var overlay = $(HTML);
	var overlay_init ;
	var zIndexStack = [];
	UI.Overlay = {
		show : function(){
			if(!overlay_init){
				$("body").append(overlay);
			}
			var zIndex = UI.zIndex();	
			zIndexStack.push(zIndex);
			overlay.css("z-index",zIndex).fadeIn(100);
		},
		hide : function(){
			zIndexStack.pop();			
			if(zIndexStack.length == 0){
				overlay.fadeOut(200);
				return;
			}
			overlay.css("z-index",zIndexStack[zIndexStack.length-1]);
		}
	}
})();
/**
 * dialog
 * */
(function(){
	var HTML = '<div class="html-ui-dialog">'+
		'<div class="dialog-wrap"></div>'+
		'<div class="dialog-head">'+
	    	'<div class="dialog-icon"></div>'+
	    	'<div class="dialog-title"></div>'+
	        '<div class="dialog-close"></div>'+
	    '</div>    '+
	    '<div class="dialog-content-wrap">'+
	    	'<div class="dialog-main">'+
	    		'<div class="dialog-content">'+
	            	'<div class="content-head"></div>'+
	                '<div class="content-body"></div>'+
	             '</div>'+
	            '<div class="dialog-btns"></div>'+
	    	'</div>'+
	    '</div>'+
	'</div>';
	
	var position = function(node,pos,offset){
		offset = offset || {x:0,y:0};
		var width = $(window).width();
		var height = $(window).height();
		if(pos == "br"){
			var top = height - node.height() + parseInt(offset.y || 0);
			var left = width - node.width() + parseInt(offset.x || 0);
			node.css({top:top,left:left});
		}
	}

	var Dialog = function(){
		this.dialog = $(HTML);
		this.dialogMain = this.dialog.find('.dialog-main');
		this.icon = this.dialog.find(".dialog-icon");
		this.title = this.dialog.find(".dialog-title");
		this.closeBtn = this.dialog.find(".dialog-close");
		this.content = this.dialog.find(".dialog-content");
		this.btns = this.dialog.find(".dialog-btns");
		this.head = this.dialog.find(".dialog-head");
		this.contentHeader = this.dialog.find(".content-head");
		this.contentBody = this.dialog.find(".content-body");
		this.dialog.draggable({handle:this.dialog.find(".dialog-head"),containment:"parent"});	
		this.init();
		this.resize();
		var _this = this;
		$(window).resize(function(){
			_this.resize();
		});
	}
	
	Dialog.prototype.resize = function(){
		var max_height = $(window).height();
		var max_width = $(window).width();
		this.dialog.css("max-height",max_height);
		this.dialog.css("max-width",max_width);
	}
	
	Dialog.prototype.init = function(){
		this.btns.hide();	
		this.icon.hide();
		var _this = this;
		this.closeBtn.click(function(){
			if(_this.closeBtnAction)
				_this.closeBtnAction();
			else
				_this.remove();
		});
	}
	
	Dialog.prototype.bind = function(name,action){
		if(name == 'close'){
			this.closeBtnAction = action;
		}
	};
	
	Dialog.prototype.html = function(html){
		var html = $(html);
		this.contentBody.empty().append(html);
		$("body").append(this.dialog.css("left","-1000000px"));	
		this.body_height = html.height();	
	};
	
	Dialog.prototype.show = function(options){
		options = $.extend({
			modal : true,
			postion : "center",
			offset : {x:0,y:0}
		}, options || {});
		this.options = options;
		if(options.modal == true)
			UI.Overlay.show();
		var height = this._show_height ? this._show_height : 300;
		this.dialog.height(height);
			
		this.dialog.show();		
		this.dialog.css("z-index",UI.zIndex());	
		this.btns.show();
		this.dialog.css("position","absolute");
		this.dialog.fadeIn(150);
		this.dialog.resizable();
		this.position(options);
		return this;
	}
	Dialog.prototype.position = function(options){
		var pos = options.position;
		var offset = options.offset;
		var offsetX = (offset.x || 0);
		var offsetY = (offset.y || 0);
		if(pos == "center"){
			$.floatCenter({who:this.dialog});
		}else{// bottom right
			
			position(this.dialog,pos,options.offset);
		}
	}
	Dialog.prototype.setIcon = function(icon){
		this.icon.empty().append("<img src='"+icon+"' />").show();
		return this;
	}
	Dialog.prototype.button = function(btns,type){/** type == undefined 时，btns自己构造，否则，传入的btns是已有的jquery对象 */
		this.btns.empty();
		if(!btns){
			return;
		}
		this.dialogMain.addClass("has-btns");
		this.btns.show();
		if(type){
			this.btns.append(btns);
		}else{
			$.each(btns,function(name,action){
				this.btns.append($("<input type='button' value='"+name+"' />").click(action));
			});
		}
		return this;
	}
	Dialog.prototype.header = function(text){
		if(!text || text == "hide")
			this.contentHeader.hide();
		else{
			this.contentHeader.html(text);
			this.dialogMain.addClass('has-header');
		}
	}
	Dialog.prototype.addButton = function(b,action){
		var btn = b;
		if(typeof b == 'string'){
			btn = $("<input type='button' value='"+b+"' />");
		}
		if(action)
			b.click(action);
		if(!this.dialogMain.hasClass("has-btns")){
			this.dialogMain.addClass("has-btns");
		}
		this.btns.append(btn);
		return btn;
	}
	Dialog.prototype.beforeClose = function(fn){
		this.beforeCloseFn = fn;
	}
	Dialog.prototype.remove = function(){
		if(this.beforeCloseFn){
			if(!this.beforeCloseFn())
				return; 
		}
		var _this = this;
		setTimeout(function(){
			_this.dialog.remove();
		},50);
		if(this.options.modal == true)
			UI.Overlay.hide();
	}
	Dialog.prototype.setTitle = function(title){
		this.title.html(title);
		return this;
	}
	Dialog.prototype.size = function(size){
		if(size){
			if(size.width)
				this.dialog.width(size.width);
			if(size.height){
				this._show_height = size.height;
				this.dialog.height(size.height);
			}
				
		}
		return this;
	}
	UI.Dialog = function(node){
		if(!node){
			return new Dialog(); 
		}
		if(node.data("UI.Dialog")){
			return node.data("UI.Dialog");
		}else{
			var dialog = new Dialog();
			node.data("UI.Dialog",dialog);
			return dialog;
		}
	}
})();

})(jQuery);