widget.SelectMultiple = W.Class('SelectMultiple', widget.Base, {
	SelectMultiple: function(W, render_context) {
		this.Base(W, render_context);
//		this.vars = W.extend(Object.create(W.layout.vars), { select: this });
	},
	
	features: {
		'column': false,	// 单列模式
		'row': false		// 单行模式
	},
	
	mixin_name: 'select',

	options: {
		maxHeight: 175, /* max height of the checkbox container (scroll) in pixels */
		checkAllText: '全选',
		unCheckAllText: '全不选',
		noneSelectedText: '',
		selectedList: 0,
		position: 'bottom'
	},
	
	options_attr_name: 'data-select-multiple',
	
	_render: function() {
		var W = this.W, self = this, options = this.options, features = this.features;
		
		var ORIGINAL = "original";
		
		var collapse = true, single;
        
        if (features['row']) {
        	collapse = false;
        	single = true;
        } else if (features['column']) {
        	collapse = false;
        	single = false;
        }
        
		var $select = $original = $(this.node), 
			$options, $header, $labels, 
			html = [], 
			isDisabled = this._disabled = $select.is(':disabled'),
			name = $select.attr('name'),
			id = $select.attr('id') || W.layout.actual_id(W.unique_id());
		
        if (options.from && $select.children().length >= options.from) {
        	collapse = true;
        }
	
		html.push('<a id="'+ id +'" name="' + name + '" class="ui-multiselect ui-widget-content ui-corner-all-3' + (isDisabled ? ' ui-state-disabled' : '') + '">');
		html.push('<input readonly="readonly" type="text" class="" value="'+ options.noneSelectedText +'" /><span class="ui-icon ui-icon-triangle-1-s"></span></a>');
		html.push('<div class="ui-multiselect-options ui-widget ui-widget-content ui-corner-all">');
	
		if (collapse) {
			html.push('<div class="ui-widget-header ui-helper-clearfix ui-corner-all ui-multiselect-header">');
			html.push('<ul class="ui-helper-reset">');
			html.push('<li><a class="ui-multiselect-all" href=""><span class="ui-icon ui-icon-check"></span>' + options.checkAllText + '</a></li>');
			html.push('<li><a class="ui-multiselect-none" href=""><span class="ui-icon ui-icon-closethick"></span>' + options.unCheckAllText + '</a></li>');
			html.push('<li class="ui-multiselect-close"><a href="" class="ui-multiselect-close ui-icon ui-icon-circle-close"></a></li>');
			html.push('</ul>');
			html.push('</div>');
		}
		
		var option_html = Array();
		var _generateOptions = function(_select,rerender){
			// build options
			option_html.push('<ul class="ui-multiselect-checkboxes ui-helper-reset">');
			/* 
			If this select is disabled, remove the actual disabled attribute and let themeroller's .ui-state-disabled class handle it.
			This is a workaround for jQuery bug #6211 where options in webkit inherit the select's disabled property.  This
			won't achieve the same level of 'disabled' behavior (the checkboxes will still be present in form submission), 
			but it at least gives you a way to emulate the UI. 
			 */
			if (isDisabled) {
				$select.removeAttr("disabled");
			}
			
			var firstOptGroup = true;
			
			_select.find('option').each(function(i) {
				var $this = $(this), 
				title = $this.html(), 
				value = this.value, 
				inputID = this.id || W.layout.actual_id("ui-multiselect-" + id + "-option-" + i), 
				$parent = $this.parent(), 
				hasOptGroup = $parent.is('optgroup'), 
				isDisabled = $this.is(':disabled'), 
				labelClasses = ['ui-corner-all'];
				
				if (hasOptGroup) {
					if (!$parent.hasClass('ui-multiselect-optgroup-processed')) {
						$parent.addClass('ui-multiselect-optgroup-processed');
						
						var label = $parent.attr('label');
						
						if (features['row']) {
							if (!firstOptGroup) {
								option_html.push('<br style="clear:both" />');
							} else {
								firstOptGroup = false;
							}
							
							if (label) {
								option_html.push('<li class="ui-multiselect-optgroup-label"><a href="#">' + label + '</a></li>');
							}
						} else {
							option_html.push('<li class="ui-multiselect-optgroup-label"><a href="#">' + (label || '') + '</a></li>');
						}
					}
				}
				
				if (value.length > 0) {
					if (isDisabled) {
						labelClasses.push('ui-state-disabled');
					}
					option_html.push('<li class="' + (isDisabled ? 'ui-multiselect-disabled' : '') +'">');
					option_html.push('<label for="' + inputID+'" class="' + labelClasses.join(' ') + '"><input id="' + inputID + '" type="checkbox" value="' + value + '" title="' + title + '"');
					if ($this.is(':selected') /* 向后兼容性 */ || Boolean(options.optionChecked)) {
						option_html.push(' checked="checked"');
					}
					if (isDisabled) {
						option_html.push(' disabled="disabled"');
					}
					option_html.push(' />' + title + '</label></li>');
				}
			});
			option_html.push('</ul>');
			if(!rerender){
				html.push(option_html.join(''));
			}
		}
		_generateOptions($select);
		
	    html.push('</div>');
		// append the new control to the DOM; cache queries
		$select  = $select.after( html.join('') ).next('a.ui-multiselect');
		$options = $select.next('div.ui-multiselect-options');
		$header  = $options.find('div.ui-multiselect-header');
		$labels  = $options.find('label').not('.ui-state-disabled');
		
	    if (!collapse) {
	    	this.alter($options);
	    	
	        $select.remove();
	        
	        $options.removeClass("ui-multiselect-options ui-widget ui-widget-content ui-corner-all")
	        		.addClass("ui-multiselect-tile");

	        $options.bind({
	        	rerender: function(){
	    			var _select = arguments[1];
	    			option_html=[];
	    			//重新生成options
	    			_generateOptions($(_select),true);
	    			//记录值
	    			var _val = [];
	    			$options.find('input').each(function(){
	    				if(this.checked)
	    					_val.push(this.value);
	    			});
	    			//替换options
	    			$($options.children()[0]).after(option_html.join(''));
	    			$($options.children()[0]).remove();
	    			//初始化值
	    			$options.find('input').each(function(){
	    				if(W.in_array(_val, this.value) != -1){
	    					this.checked = true;
	    				}else{
	    					this.checked = false;
	    				}
	    			});
	    			//单行样式
	    			if (single) {
	    	            $options.find("li").addClass("float");
	    	        } 
	    			$labels  = $options.find('label').not('.ui-state-disabled');
	    			_bindlabelEvents();
	    		}
	        });
	        
	        if (single) {
	            $options.find("li").addClass("float");
	        }
	    } else {
	    	this.alter($select);
	    }
	   
	    // build header links
    	if (collapse) {
    		$header.find('a').click(function(e){
    			var $this = $(this);
    			
    			// close link
    			if ($this.hasClass('ui-multiselect-close')) {
    				$options.trigger('close');
    			} else {
    				// check all / uncheck all
    				var checkAll = $this.hasClass('ui-multiselect-all');
    				if (checkAll) {
    					$options.trigger('toggleChecked', [true]);
    				} else {
    					$options.trigger('toggleChecked', [false]);
    				}
    			}
    			
    			e.preventDefault();
    		});
    	}
    	
    	var updateSelected = function() {
    		var $inputs = $labels.find('input'),
    		$checked = $inputs.filter(':checked'),
    		value = '',
    		numChecked = $checked.length;
    		
    		if (numChecked === 0) {
    			value = options.noneSelectedText;
    		} else {
    			value = self._selected_text(numChecked, $inputs.length, $checked.get());
    		}
    		
    		$select.find('input').val(value);
    		$select.trigger('change');
    		return value;
    	};
    	
    	var updateReverseSelected = function(){
    		var vals = $select.find('input').val().split(', ');
    		var options = [];
    		$labels.find('input').not(':disabled').each(function(){
    			options.push(this.title);
    			if(W.in_array(vals, this.title) != -1){
    				this.checked = true;
    			}else{
    				this.checked = false;
    			}
    		});
    		vals = $.grep(vals,function(cur){
    			return W.in_array(options,cur) != -1;
    		});
    		
    		$select.find('input').val(vals.join(', '));
    	}
    	
    	// the select box events
    	$select.bind({
    		click: function() { $options.trigger('toggle'); },
    		keypress: function(e) {
    			switch (e.keyCode) {
    			case 27: // esc
    			case 38: // up
    				$options.trigger('close');
    				break;
    			case 40: // down
    			case 0: // space
    				$options.trigger('toggle');
    				break;
    			}
    		},
    		mouseenter: function() {
    			if (!$select.hasClass('ui-state-disabled') && !collapse) {
    				$(this).addClass('ui-state-hover');
    			}
    		},
    		mouseleave: function(){
    			$(this).removeClass('ui-state-hover');
    		},
    		focus: function(){
    			if (!$select.hasClass('ui-state-disabled')) {
    				$(this).addClass('ui-state-focus');
    			}
    		},
    		blur: function(){
    			$(this).removeClass('ui-state-focus');
    		},
    		rerender: function(){
    			var _select = arguments[1];
    			option_html=[];
    			//重新生成options
    			_generateOptions($(_select),true);
    			//替换options
    			$($select.next().children()[1]).remove();
    			$($select.next().children()[0]).after(option_html.join(''));
    			
    			$labels  = $options.find('label').not('.ui-state-disabled');
    			updateReverseSelected();
    			_bindlabelEvents();
    		}
    	});
    	
    	// bind custom events to the options div
    	$options.bind({
    		'close': function(e, others){
    			others = others || false;
    			
    			// hides all other options but the one clicked
    			if (others === true) {
    				$('div.ui-multiselect-options')
    				.filter(':visible')
    				.hide()
    				.prev('a.ui-multiselect')
    				.removeClass('ui-state-active')
    				.trigger('mouseout');
    				
    				// hides the clicked options
    			} else {
    				$select.removeClass('ui-state-active').trigger('mouseout');
    				$options.hide();
    			}
    		},
    		'open': function(e, closeOthers) {
    			
    			// bail if this widget is disabled
    			if($select.hasClass('ui-state-disabled')){
    				return;
    			}
    			
    			// use position() if inside ui-widget-content, because offset() won't cut it.
    			var offset = $select.offset(),
    			$container = $options.find('ul:last'), 
    			top, width;
    			
    			// calling select is active
    			$select.addClass('ui-state-active');
    			
    			// hide all other options
    			if(closeOthers || typeof closeOthers === 'undefined'){
    				$options.trigger('close', [true]);
    			}
    			
    			// calculate positioning
    			if (options.position === 'middle') {
    				top = ( offset.top+($select.height()/2)-($options.outerHeight()/2) );
    			} else if (options.position === 'top') {
    				top = (offset.top-$options.outerHeight());
    			} else {
    				top = (offset.top+$select.outerHeight());
    			}
    			
    			// calculate the width of the options menu
    			width = $select.width()-parseInt($options.css('padding-left'),10)-parseInt($options.css('padding-right'),10);
    			
    			// select the first option
    			$labels.filter('label:first').trigger('mouseenter').trigger('focus');
    			
    			// show the options div + position it
    			$options.css({ 
    				position: 'fixed',
    				top: top+'px',
    				left: offset.left+'px',
    				width: width+'px'
    			}).show();
    			
    			// set the scroll of the checkbox container
    			$container.scrollTop(0);
    			
    			// set the height of the checkbox container
    			if (options.maxHeight) {
    				$container.css('height', options.maxHeight);
    			}
    		},
    		'toggle': function(){
    			$options.trigger( $(this).is(':hidden') ? 'open' : 'close' );
    		},
    		'traverse': function(e, start, keycode){
    			var $start = $(start), 
    			moveToLast = (keycode === 38 || keycode === 37) ? true : false,
    					
    					// select the first li that isn't an optgroup label / disabled
    					$next = $start.parent()[moveToLast ? 'prevAll' : 'nextAll']('li:not(.ui-multiselect-disabled, .ui-multiselect-optgroup-label)')[ moveToLast ? 'last' : 'first']();
    			
    			// if at the first/last element
    			if(!$next.length){
    				var $container = $options.find("ul:last");
    				
    				// move to the first/last
    				$options.find('label')[ moveToLast ? 'last' : 'first' ]().trigger('mouseover');
    				
    				// set scroll position
    				$container.scrollTop( moveToLast ? $container.height() : 0 );
    				
    			} else {
    				$next.find('label').trigger('mouseenter');
    			}
    		},
    		'toggleChecked': function(e, flag, group){
    			var $inputs = (group && group.length) ? group : $labels.find('input');
    			$inputs.not(':disabled').prop('checked', (flag ? 'checked' : ''));
    			updateSelected();
    		}
    	})
    	.find('li.ui-multiselect-optgroup-label a')
    	.click(function(e){
    		// optgroup label toggle support
    		var $checkboxes = $(this).parent().nextUntil('li.ui-multiselect-optgroup-label').find('input');
    		
    		$options.trigger('toggleChecked', [ ($checkboxes.filter(':checked').length === $checkboxes.length) ? false : true, $checkboxes]);
    		e.preventDefault();
    	});	
	    var _bindlabelEvents = function(){	
	    	// labels/checkbox events
	    	$labels.bind({
	    		mouseenter: function() {
	    			$labels.removeClass('ui-state-hover');
	    			if (collapse) {
	    				$(this).addClass('ui-state-hover').find('input').focus();
	    			}
	    		},
	    		keyup: function(e) {
	    			switch(e.keyCode) {
	    			case 27: // esc
	    				$options.trigger('close');
	    				break;
	    				
	    			case 38: // up
	    			case 40: // down
	    			case 37: // left
	    			case 39: // right
	    				$options.trigger('traverse', [this, e.keyCode]);
	    				break;
	    				
	    			case 13: // enter
	    				e.preventDefault();
	    				$(this).click();
	    				break;
	    			}
	    		}
	    	})
	    	.find('input')
	    	.bind('click', function(e) {
	    		updateSelected();
	    	});
	    }//end bind
	    _bindlabelEvents();
		// detach the original input element
		W.$(this.node).expando(ORIGINAL, $original.detach());
		// update the number of selected elements when the page initially loads, and use that as the defaultValue.  necessary for form resets when options are pre-selected.
	//	$select.find('input')[0].defaultValue = updateSelected();
		
		W.data_getter(this.node, function() {
			var data = [];
			$labels.find('input').each(function() {
				if ($(this).prop('checked')) {
					data.push($(this).attr('value'));
				}
			});
			return data;
		});
		
		W.data_setter(this.node, function(data) {
			$labels.find('input').each(function() {
				if (data && (W.in_array(data, $(this).attr('value')) != -1)) {
					$(this).prop('checked', true);
				} else {
					$(this).prop('checked', false);
				}
			});
			updateSelected();
		});
	},
	
	_selected_text: function(numChecked, numTotal, checkedInputs){
		return checkedInputs.map(function(e) { return e.title; }).join(', ');
	}
});

//close each select when clicking on any other element/anywhere else on the page
$(document).bind('mousedown', function(e){
	var $target = $(e.target);

	if(!$target.closest('div.ui-multiselect-options').length && !$target.parent().hasClass('ui-multiselect')){
		$('div.ui-multiselect-options').trigger('close', [true]);
	}
});

W.define_widget({
	name: 'select-multiple',
	description: '多选框',
	selector: 'select[multiple].w-select-multiple',
	onrender: function(node, render_context) {
		var W = this;

		var select = new widget.SelectMultiple(W.$(node), render_context);
		select.render();
	}
});


W._import('js/jquery.localisation-min.js');
W._import('js/jquery.scrollTo-min.js');
W._import('js/ui.multiselect.js');

W.define_widget({
	name: 'multi-select-transfer',
	description: '多选选择变形',
	selector: 'select[multiple].w-multi-select-transfer',
	onrender: (function() {
		var DEFAULT_OPTIONS = {
			sortable: false,
			doubleClickable: false
		}
		return function(node) {
			var W = this, elem = W.$(node), attr = elem.widget_attr('data-multi-select-transfer') || {};
			
			var options = W.extend({}, DEFAULT_OPTIONS);
			
			options.searchable = W.widget_switch(attr.feature || attr.features).search;
			
			$(node).multiselect(options);
			
			$(node).bind({
				rerender:function(){
					$(node).multiselect('populateLists',$(node).find('option'));
				}
			});
			
			W.data_getter(node, function() {
				var data = [];
				$(node).children().each(function(){
					if(this.selected) data.push(this.value);
				});
				return data;
			});
			
			W.data_setter(node, function(data) {
				data = (data == '' ? [] : W.Array(data));
				$(node).children().each(function(){
					this.selected = false;
					if(W.in_array(data, this.value) != -1) this.selected = true;
				});
				$(node).multiselect('populateLists',$(node).find('option'));
			});
		};
	})()
});

