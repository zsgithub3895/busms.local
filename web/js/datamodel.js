/**
 * 缓存的DataModel 
 */
var Map = function(){
	this.items = {};
	this.size=0;
	this.keys = new LinkSet();
};
Map.prototype.put = function(key,value){
	key = key+"";	
	if(this.items[key] == undefined){		
		this.size++;
		this.keys.add(key);
	}
	this.items[key] = value;	
};
Map.prototype.get = function(key){
	return this.items[key];
};
Map.prototype.remove = function(key){
	if(this.items[key+""]){
		delete this.items[key+""];
		this.size--;
		this.keys.remove(key);
	}	
};
Map.prototype.clear = function(){
	this.items = {};
	this.size=0;
	this.keys = new LinkSet();
}
Map.prototype.keys = function(){
	return this.keys;
}
Map.prototype.moveKey = function(key,index){
	this.keys.move(key,index);
}
Map.prototype.values = function(){
	var values = [];
	var vls = this.keys.values();
	for(var i = 0 ; i<vls.length; i++){
		values.push(this.items[vls[i]]);
	}
	return values;
}

/** 链式Set */
var LinkSet = function(){
	this.items = [];
}
LinkSet.prototype.add = function(el,index){
	if(this.items.indexOf(el) == -1){
		if(index){
			for(var i = this.items.length+1; i>index;){
				this.items[i] = this.items[i--];	
			}
			this.items[index] = el;
		}else{
			this.items.push(el);
		}
	}
}
LinkSet.prototype.remove = function(el){
	delete this.items[this.items.indexOf(el)];
}
LinkSet.prototype.clear = function(){
	this.items = [];
}
LinkSet.prototype.index = function(el){
	return this.items.indexOf(el);
}
LinkSet.prototype.move = function(el,index){
	if(this.items.indexOf(el) == -1)
		return;
	var _index = this.items.indexOf(el);
	if(_index > index){
		for(var i = _index; i>index;i--){
			this.items[i] = this.items[i-1];	
		}
	}else{
		for(var i = _index; i<index;i++){
			this.items[i] = this.items[i+1];	
		}
	}
	this.items[index] = el;
}
LinkSet.prototype.values = function(){
	return this.items;
}


var TreeMap = function(idKey,childrenKey){
	idKey = idKey?idKey:"id";
	childrenKey = childrenKey?childrenKey:"children";
	this.items = new Map();
	this.allItems = new Map();
}
TreeMap.prototype.put = function(key,value){
	this.items.put(key,value);
	this.allItems.put(key,value);
	this.putChildren(value);
}
TreeMap.prototype.putChildren = function(value){
	var children = value[this.childrenKey];
	if(!children)
		return;
	var child = children.pop();
	if(child){
		this.addItems.put(child[this.idKey],child);
		if(child[this.childrenKey])
			children.push(child[this.childrenKey]);
	}
}
TreeMap.prototype.get = function(key){
	return this.allItems.get(key);
}
TreeMap.prototype.keys = function(al){
	if(al)
		return this.allItems.keys();
	return this.items.keys();
}
TreeMap.prototype.values = function(al){
	if(al)
		return this.allItems.values();
	return this.items.values();
}


/** 场合缓存 */
var SceneCache = new Map();

	
var serviceRegionPolicyCache = new Map();	

