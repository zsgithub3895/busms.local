// JavaScript Document
W.define_widget({
	name: 'richBox',
	description: '副文本',
	selector: '.rich-editbox',
	onrender: (function(){
		
	  var plungin = {
			Picture:{c:'uploadPicture',t:'上传图片',e:function(){
		       W.fire('file:upload',this);
			}}
		}; 
	  
	   return function(node){
		  var tools = 'Cut,Copy,Paste,Pastetext,Blocktag,Fontface,FontSize,Bold,Italic,Underline,Strikethrough,FontColor,BackColor,SelectAll,Removeformat,Align,List,'+
           'Outdent,Indent,Link,Unlink,Hr,Img,/,Emot,Table,Source,Preview,Print,Fullscreen,About';
		  var defaultSkin = 'default' ;	
		   
		  var W = this,elem = W.$(node),attr = elem.widget_attr('data-richBox') || {};  
		  if(attr.tools)  
			  tools = attr.tools ;
		  if(attr.skin)  
			  defaultSkin = attr.skin ;
		  
		  var getEditor = function(elem){
			  var editor = elem.node.xheditor({plugins:plungin,tools:tools,skin:defaultSkin,upImgUrl:'rest/file/upFile',upImgExt:'jpg,jpeg,gif,png',html5Upload:true}); 
			  W.render(editor);
			  return editor ;
		  };
		  
		  elem.data_getter(function() {
			   var editor = getEditor(elem); 
			   return editor.getSource(); 
		  });
		  
		  elem.data_setter(function(data) {
			 var editor = getEditor(elem);
			 editor.setSource(data);
			 editor.focus();
		  });
		  
	   };
	   
		 
	 })()
});