widget.MyWizard = W.Class('MyWizard', widget.Wizard, {
	MyWizard: function(W, render_context) {
		this.Wizard(W,render_context);
	},
	_render_step : function(step){
		$(step).wrapInner("<span>");
	}
});
LAYOUTS['wizard'] = function(node, render_context, options) {
	var W = this;
	
	var wizard = new widget.MyWizard(W.$(node), render_context);
	wizard.render();
};