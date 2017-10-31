var DataBinder = (function(){//只能绑定当前W的变量的值。	
	
	var refresh = (function(){
		
		var refreshNodes = function(dataBinder,nodes,val){
			$.each(nodes,function(i,node){
				var W = dataBinder.W.$(node);
				W.data(val);
			});
		}
		
		return function(dataBinder,path){			
			if(path){
				var val = getValueByPath(dataBinder.W,path);
				var nodes = dataBinder.bindedNodes(path);
				refreshNodes(dataBinder,nodes,val);
			}else{
				dataBinds = dataBinder.dataBinds;
				$.each(dataBinds,function(path,nodes){
					var val = getValueByPath(dataBinder.W,path);
					refreshNodes(dataBinder,nodes,val);
				});
			}
		}
	})();
	
	var getValueByPath = function(W,path){			
		return (new Function(" return this."+path)).call(W);
	}
	//根据W对象获取当前页面的data-bind Pathes。
	
	function DataBinder(W){
		this.W = W;
		this.dataBinds = {};
	}
	var P = DataBinder.prototype;
	P.bindPath = function(path,node){
		if(!this.dataBinds[path]){
			this.dataBinds[path] = [];
		}
		this.dataBinds[path].push(node);
	}
	P.bindedNodes = function(path){
		return this.dataBinds[path];
	}
	P.refresh = function(path){
		refresh(this,path);			
	}
	
	var getDataBinder = function(W){
		var dataBinder ;
		if(W.node.data("data-binder")){
			dataBinder = W.node.data("data-binder");
		}else{
			dataBinder = new DataBinder(W);
			W.node.data("data-binder",dataBinder);
		}
		return dataBinder;
	}
	
	return function(W){
		var nodes = W.node.find("[data-bind]");
		if(nodes.size() == 0){
			return;
		}
		var dataBinder = getDataBinder(W);
		$.each(nodes,function(i,node){
			node = $(node);
			var path = node.attr("data-bind");
			path = $.trim(path);
			if(path == "")
				return;
			dataBinder.bindPath(path,node);
		});		
		return dataBinder;
	}
})();
/**
W.define_widget({
	name: 'data-bind',
	description: '数据绑定',
	selector: '[data-bind]',
	onrender:(function(){//只能绑定当前W的变量的值。	
		
		var refresh = (function(){
			
			var refreshNodes = function(nodes,val){
				$.each(nodes,function(i,node){
					var W = dataBinder.W.$(node);
					W.data(val);
				});
			}
			
			return function(dataBinder,path){			
				if(path){
					var val = getValueByPath(dataBinder.W,path);
					var nodes = dataBinder.bindedNodes(path);
					refreshNodes(nodes,val);
				}else{
					dataBinds = dataBinder.dataBinds;
					$.each(dataBinds,function(path,nodes){
						var val = getValueByPath(dataBinder.W,path);
						refreshNodes(nodes,val);
					});
				}
			}
		})();
		
		var getValueByPath = function(W,path){			
			return (new Function(" return this."+path)).call(W);
		}
		//根据W对象获取当前页面的data-bind Pathes。
		
		function DataBinder(W){
			this.W = W;
			this.dataBinds = {};
			this.init();
		}
		var P = DataBinder.prototype;
		P.bindPath = function(path,node){
			if(!this.dataBinds[path]){
				this.dataBinds[path] = [];
			}
			this.dataBinds[path].push(node);
		}
		P.bindedNodes = function(path){
			return this.dataBinds[path];
		}
		P.init = function(){
			var _this = this;
			W.extend(W, {
				refresh : function(path){
					refresh(_this,path);
				}
			});					
		}
		
		var getDataBinder = function(W){
			var dataBinder ;
			if(W.node.data("data-binder")){
				dataBinder = W.node.data("data-binder");
			}else{
				dataBinder = new DataBinder(W);
				W.node.data("data-binder",dataBinder);
			}
			return dataBinder;
		}
		
		return function(node){
			var W = this, el = W.$(node),attr = W.$(node).widget_attr('data-bind') || {}
			var dataPath = attr['path'];
			var dataBinder = getDataBinder(W);
			dataBinder.bindPath(dataPath,node);
		}
	})()
})
**/