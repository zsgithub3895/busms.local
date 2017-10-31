W.define_widget({
	name: 'date-picker',
	description: '日期选择',
	selector: 'input.w-date-picker',
	onrender: (function() {
		$.datepicker.setDefaults({
			changeMonth: true,
			changeYear: true,
			dateFormat: 'yy-mm-dd',
			dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
			monthNamesShort: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月']
		});
		
		var pad = function(val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};
		
		var PATTERNS = [{
			pattern: /^(\d{4}-\d{2}-\d{2})$/,
			getter: function(v) { return v; },
			setter: function(m) { return m[0]; }
		}, {
			pattern: /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/,
			getter: function(v) { return v + ' 00:00:00'; },
			setter: function(m) { return m[1]; }
		}, {
			pattern: /^\d+$/,
			getter: function(v) { 
				return Date.parse(v + 'T00:00:00+08:00');
			},
			setter: function(m) {
				var date = new Date(parseInt(m[0]));
				return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
			}
		}];
		
		var DEFAULT_PATTERN = PATTERNS[0];
		
		return function(node) {	
			var attr =  W.$(node).attr('data-datepicker') || "{}";
			var dateFormat = attr.dateFormat;
			var options = {
					showAnim: 'fadeIn'
			};
			if(dateFormat){
				options.dateFormat = dateFormat;
			}
			$(node).datepicker(options);			
			
			var pattern = DEFAULT_PATTERN;
			
			W.data_getter(node, function() {
				return pattern.getter($(node).val());
			});
			
			W.data_setter(node, function(value) {
				if (value === '' || value === null) {
					$(node).val('');
					return;
				}
				
				for (var i = 0; i < PATTERNS.length; i++) {
					var p = PATTERNS[i];
					var m = p.pattern.exec(value);
					if (m) {
						pattern = p;
						$(node).val(p.setter(m));
						return;
					}
				}
				W.error("不支持的日期格式: " + value);
			});
		};
	})()
});