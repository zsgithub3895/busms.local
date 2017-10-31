(W.define_widget || W.widget)((function() {
	var initialized = false;
	var privileges = {};
	
	W.extend({
		AccessControl: {
			init: function(continuation) {
				if (initialized) {
					W.warn('访问权限控制已初始化');
				}
				
				W.get('current-user/privilege-codes').done(function(codes) {
					W.each(codes, function(code) {
						privileges[code] = true;
					});
					
					initialized = true;
					
					if (continuation !== undefined) continuation();
				});
			},
			
			has_privilege: function(privileges_required) {
				privileges_required = W.Array(privileges_required);
				for (var i = 0; i < privileges_required.length; i++) {
					var privilege = privileges_required[i];
					if (!privileges[privilege]) return false;
				}
				return true;
			}
		}
	});
	
	return {
		type: 'precede',
		name: 'p:access-control',
		description: '访问权限控制',
		selector:'[data-access]',
		onrender: function(node) {
			var W = this, e = W.$(node);
			
			if (!initialized) {
				W.error("访问权限控制未初始化，在登录后调用W.AccessControl.init()方法进行初始化");
				return;
			}
			
			var attr = e.widget_attr('data-access');
			var privileges_required = W.map((attr.privilege || '').split(','), ''.trim);
			
			// 权限检查是否失败标志
			var failed = false;
			for (var i = 0; i < privileges_required.length; i++) {
				var privilege = privileges_required[i];
				if (!privileges[privilege]) {
					failed = true;
					break;
				}
			}
			
			if (failed) {
				switch (attr.method || 'remove') {
					case 'disable': {
						e.attr('disabled', true);
						break;
					} 
					case 'hide': {
						e.hide();
						break;
					}
					case 'mark': {
						e.add_class('w-forbidden');
						break;
					}
					case 'remove': {
						e.destroy();
						break;
					}
				}
			}
		}
	};
})());
