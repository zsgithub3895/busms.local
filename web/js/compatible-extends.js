(function(){
W.extend({
	refresh: function() {
		if (this.grid) {
			W.warn('过期的方法W.refresh()，应使用W.grid.refresh()');
			return this.grid.refresh();
		} 
		if(this.list_grid) {
			W.warn('过期的方法W.refresh()，应使用W.list_grid.refresh()');
			return this.list_grid.refresh();
		}
		if(this.simple_list) {
			W.warn('过期的方法W.refresh()，应使用W.simple_list.refresh()');
			return this.simple_list.refresh();
		}
		if(this.tree){
			W.warn('过期的方法W.refresh()，应使用W.tree.refresh()');
			return this.tree.refresh();
		}
		return this.fire('refresh');
		
	},
	select_row: function(func) {
		if(this.grid){
			W.warn("过期的方法W.select_row()，应使用W.grid.select_row()");
			return this.grid.select_row(func);
		}
		if(this.list_grid){
			W.warn("过期的方法W.select_row()，应使用W.list_grid.select_row()");
			return this.list_grid.select_row(func);
		}
		if(this.simple_list){
			W.warn("过期的方法W.select_row()，应使用W.simple_list.select_row()");
			return this.simple_list.select_row(func);
		}
	},
	
	selected_rows: function(func) {
		if(this.grid){
			W.warn("过期的方法W.selected_rows()，应使用W.grid.selected_rows()");
			return this.grid.selected_rows(func);
		}
		if(this.list_grid){
			W.warn("过期的方法W.selected_rows()，应使用W.list_grid.selected_rows()");
			return this.list_grid.selected_rows(func);
		}
		if(this.simple_list){
			W.warn("过期的方法W.selected_rows()，应使用W.simple_list.selected_rows()");
			return this.simple_list.selected_rows(func);
		}
	},
	
	'disabled' : function(){
		if(this['select_multiple']){
			W.warn("过期的方法W.disabled()，应使用W.select_multiple.disabled()");
			return this['select_multiple'].disabled();
		}
	},
	'is' : function(key){
		if(this['select_multiple']){
			W.warn("过期的方法W.is()，应使用W.select_multiple.is()");
			return this['select_multiple'].is(key);
		}	
	},
	'notify' : function(notice_fn){
		if(this['validator']){
			W.warn("过期的方法W.notify()，应使用W.validator.notify()");
			return this['validator'].notify(notice_fn);
		}	
	},
	'add' : function(data, parent){
		if(this.loop_show){
			W.warn('过期的方法W.add()，应使用W.loop_show.add()');
			return this.loop_show.add(data, parent);
		}
	},
	'clear' : function(){
		if(this.loop_show){
			W.warn('过期的方法W.clear()，应使用W.loop_show.clear()');
			return this.loop_show.clear();
		}
	},
	'reset' : function(){
		if(this.search_input){
			W.warn('过期的方法W.reset()，应使用W.search_input.reset()');
			return this.search_input.reset();	
		}	
	},
	'next' : function(){
		W.warn('过期的方法W.next()，应使用W.wizard_steps.next()');
		return this.wizard_steps.next();
	},
	'pre' : function(){
		W.warn('过期的方法W.pre()，应使用W.wizard_steps.pre()');
		return this.wizard_steps.pre();
	},
	'go' : function(i){
		W.warn('过期的方法W.go()，应使用W.wizard_steps.go()');
		return this.wizard_steps.go(i);
	},
	'add_row' : function(data,type){
		if(this.simple_list){
			W.warn('过期的方法W.add_row()，应使用W.simple_list.add_row()');
			return this.simple_list.add_row(data,type);
		}
	},
	'data_edited' : function(){
		if(this.simple_list){
			W.warn('过期的方法W.data_edited()，应使用W.simple_list.data_edited()');
			return this.simple_list.data_edited();
		}
	},
	'unselect_rows' : function(){
		if(this.simple_list){
			W.warn('过期的方法W.unselect_rows()，应使用W.simple_list.unselect_rows()');
			return this.simple_list.unselect_rows();
		}
	}
});	
})()