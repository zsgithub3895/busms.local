// JavaScript Document
W.define_widget({
	name : "面包屑 secondary navigation scheme",
	description : "辅助和补充的导航方式",
	selector : ".w-sec-nav",
	onrender : (function(){
		
		var Item = function(id,title,node,children){
			
			return {
				id : id,
				title : title,
				children : children,
				node : node,
				data : node.data("data")
			}
		}
		var NAV_HTML = "<ul class='w-sec-nav-wrap'></ul>";
		return function(node){
			var W = this, el = W.$(node), attr = W.$(node).widget_attr('data-sec-nav') || {};	
			var node = $(node);
			var splitStr = attr['split'] || "&gt;";			
			
			var navNode = $(NAV_HTML);
			
			var itemClick = function(){
				el.fire("item:click",Item($(this).attr('nav-item-id'),$(this).text(),node));
			}
			
			var appendItems = function(items){
				for(var i = 0; i < items.length; i++){
					var item = items[i];
					if((typeof items[i]) == "string")
						item = {id:"",title:item};
					appendItem(item);
				}
				node.append(navNode);
			}
			
			var appendItem = function(item){
				if(navNode.children().length > 0)
				 	navNode.append("<li class='nav_item_split'>"+splitStr+"</li>");
				navNode.data("data",item.data);
				navNode.append($("<li nav-item-id='"+item.id+"'>"+item.title+"</li>").click(itemClick));
			}
			el.on("append:item","private",function(e,items){
				appendItems(items);
			});
			
			/**
				data的数据结构
				[
					{title:"",children:[],id:""},
					{title:"",children:[],id:""}
				]
			*/
			W.data_setter(node,function(items){
				navNode.empty();
				appendItems(items);
			});
			
			/**
			el.mixin({
				appendItem: appendItem				
			});**/
		}	
	})()
});