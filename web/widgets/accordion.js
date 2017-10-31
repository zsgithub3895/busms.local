// JavaScript Document
W.define_widget({
	name: 'accordion',
	description: '手风琴',
	selector: '.w-accordion-1',
	onrender: function(node,render_context){
		node = $(node);
		var W = this, attr = node.attr('data-accordion') || "{}";
		var option = $.evalJSON(attr);
		option.autoHeight = false;
		node.accordion(option);
		render_context.render(node.children().toArray());
		return;
		var head = node.find(">h3");
		var content = head.next();
		
		head.addClass("ui-accordion-header").addClass("ui-state-default").addClass("ui-helper-reset")
			.toggleClass("ui-state-active").toggleClass("ui-state-default");
		content.addClass("ui-accordion-content").addClass(" ui-helper-reset")
			.addClass("ui-widget-content").addClass("ui-corner-bottom")
			.toggleClass("ui-accordion-content-active");
		head.find("> span").addClass("accordion-icon").addClass("ui-icon")
			.toggleClass("accordion-icon").toggleClass("accordion-icon-active");
		head.click(function() {
			$(this).next().toggle();
			return false;
		});
				
	}
	
});