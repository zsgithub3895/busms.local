// JavaScript Document
W.define_widget({
	name: 'wizard-steps',
	description: '向导',
	selector: '.w-wizard-steps',
	type : 'decorative',
	onrender: (function(){
		return function(node){
			var W = this, elem = W.$(node), node = $(node);	
			node.addClass("wizard-steps");
			var wizards = node.find("li");
			var maxLength = wizards.length;
			var index = 0;
			var focusIndex,zIndex = 20;
			$.each(wizards,function(i,step){
				step = $(step);
				step.html("<span>"+step.html()+"</span>");
				if(i == 0){
					step.addClass("wizard-step-first");
				}else
				if(i == maxLength - 1){
					step.addClass("wizard-step-last");
				}else{
					step.addClass("wizard-step-center");
				}
				step.css("z-index",--zIndex);
			})
		}			
	})()
	
});
/**
W.define_widget({
	name: 'wizard-steps',
	description: '向导',
	selector: '.w-wizard-steps',
	onrender: (function(){
		
		Object.defineProperty(W.fn, 'wizard_steps', {
			get: function() {
				return this.expando('widget:wizard_steps');
			}
		});
				
		return function(node){
			var W = this, elem = W.$(node), node = $(node);	
			node.addClass("wizard-steps");
			var wizards = node.find("step");
			var maxLength = wizards.length;
			var index = 0;
			var focusIndex,zIndex = 20;
			$.each(wizards,function(i,step){
				step = $(step);
				var stepNode = $("<div />").append("<span>"+step.text()+"</span>");
				if(i == 0){
					stepNode.addClass("wizard-step-first");
				}else
				if(i == maxLength - 1){
					stepNode.addClass("wizard-step-last");
				}else{
					stepNode.addClass("wizard-step-center");
				}
				stepNode.css("z-index",--zIndex);
				step.remove();
				node.append(stepNode);
			})
			function go(i){
				if(i >= maxLength)
					i = maxLength;
				if(i <= 0)
					i = 0;
				$("div.step-active",node).removeClass("step-active");
				$("div:eq("+i+")",node).addClass("step-active");
			}
			go(0);
			elem.expando('widget:wizard_steps', {
				next : function(){
					go(++index);
				},
				pre : function(){
					go(--index);
				},
				go : go
			});
		}			
	})()
	
});**/