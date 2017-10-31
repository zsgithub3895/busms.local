/**
 * ==校验类型===
 *
 * 长度校验
 * 特殊字符校验
 * 日期校验
 * 正则校验
 * 非空校验
 * 
 * ==校验规则===
 * and  or 
 * + | 
 * +号表示逻辑与的关系
 * |表示逻辑或得关系
 * not_empty+email  不能为空，并且格式为EMAIL，该中表达可以表示为EMAIL。但是如果为空，只会提示EMAIL的格式不正确。
 * not_empty>date  如果不为空，则验证是否是日期
 * 
 * ==验证表达式中使用内置验证规则==
 * 每条验证规则可能会包括验证规则关键字
 * 如果校验规则的值中包含校验关键字，则需要用()把校验规则括起来。
 *  内置校验规则
 *  not_empty 不能为空 not_empty[trim]则表示验证前要先trim掉前后的空格
 *  email 格式是否为EMAIL
 *  regex  使用正则表达式验证，如regex[/xxxx/g]，则是用/xxx/g来进行正则匹配值。
 *  len 长度校验 len len[5,10] 区间，如果单个len[5] 则指定长度为5
 *  date 日期校验，判断值是否为日期格式,date
 *  number 
 *  word 匹配包括下划线的任何单词字符。等价于'[A-Za-z0-9_]'
 *  not_char 不包括哪些字符 not_char[_,+-|]
 *  range 区间 range[10,20] 值在10在20之间。
 *  
 **/
W.define_widget({
	name : "validator",
	description : '校验器',
	selector : '*[data-validate-exp]',
	type : 'decorative',
	onrender : (function(){
		
		Object.defineProperty(W.fn, 'validator', {
			get: function() {
				return this.expando('widget:validator');
			}
		});
		
		var operators = "+|()!";
		var operatorMapping = {
				'+' : "&&",
				'|' : "||",
				'(' : '(',
				")" : ')',
				"!" : '!'
		};
		var validators = {
				'not_empty' : function(val,result){
					if(($.isArray(val) && val.length > 0) || $.trim(val).length > 0)
						return true;
					result.message = "不能为空";
					return false;
				},
				'empty' : function(val){
					if($.trim(val).length == 0)
						return true;
					return false;
				},
				'email' : function(val,result){
					var email_regex = /^[a-z]([a-z0-9]*[-_.]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i; 
					if(email_regex.test(val))
						return true;
					result.message = "email格式不正确";
					return false;
				},
				'regex' : function(val,result,regex){
					if(regex.test(val))
						return true;
					result.message = "输入格式不正确";
					return false;
				},
				len : function(val,result,min_len,max_len){
					val = $.trim(val);
					if(!max_len){
						if(val.length == min_len)
							return true;
						result.message = "长度不正确，长度只能为" + min_len;
					}else{
						if(val.length >= min_len && val.length <= max_len)
							return true;
						result.message = "长度不正确，长度应在" + min_len +"和" + max_len+"之间";
					}
					return false;
				},
				range : function(val,result,min,max){
					var message = "";
					if(max == undefined || max == '>'){
						if(val >= min)
							return true;
						message = "值必须大于等于" + min;
					}else
					if(min == "<"){
						if(val <= max)
							return true;
					}else					
					if(val>=min && val <=max)
						return true;
					result.message = "值不正确，值应在" + min +"和" + max+"之间";
					return false;
				},
				date : function(val,result,format){
					//判断日期是否正确，根据format判断，如果format不存在，则只判断是否正确
					// yyyy-MM-dd HH:mm:ss
					var rex = format.replace(/\-/g,"\-");
					rex = format.replace("yyyy","([1-9]\d{3})");
					rex = format.replace("MM","(0\d|1[0-2])");
					rex = format.replace("dd","([0-2]\d|3[0,1])");
					rex = format.replace("HH","([0-1]\d|2[0-3])");
					rex = format.replace("mm","([0-5]\d)");
					rex = format.replace("ss","([0-5]\d)");
					rex = "^" + rex + "$";
					rex = new RegExp(rex);
					var dates = val.match(rex);
					if(dates.length == 0){
						result.message = "日期格式不正确";
						return false;
					}
					
					var year = dates[0];
					var month = dates[1];
					var day = dates[2];
					
					return false;
				},
				word : function(val,result){
					var regex = /^[A-Za-z0-9_\-]*$/;
					if(regex.test(val))
						return true;
					result.message = "只能是字母、数字、下划线或中划线的组合。";
					return false;
				},
				words : function(val,result){
					var regex = /^[A-Za-z0-9_\-\s]*$/;
					if(regex.test(val))
						return true;
					result.message = "只能是字母、数字、下划线、中划线或空格的组合。";
					return false;
				},
				expword : function(val,result){
					var regex = /^[A-Za-z0-9_\-\#]*$/;
					if(regex.test(val))
						return true;
					result.message = "只能是字母、数字、下划线、中划线、#的组合。";
					return false;
				},
				not_char : function(val,result,chars){
					if(!chars)
						return true;
					for(var i=0; i<chars.length; i++){
						if(val.indexOf(chars[i]) != -1){
							result.message = "不能包含" + chars[i];
							return false;
						}
					}
					return true;
				},
				number : function(val,result){
					if(!isNaN(val))
						return true;
					result.message = "只能输入数字";
					return false;
				},				
				ip : function(val,result){
					var regex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
					if(regex.test(val))
						return true;
					result.message = "ip格式输入不正确";
					return false;
				},
				url : function(val,result){
					if(val == ""){
						return true;
					}
					val = val.toLocaleLowerCase();
					var strRegex = "^((https|http|ftp|rtsp|mms)?://)"  
        				 + "?(([0-9a-z_!~\*'\(\)\.&=\+\$%\-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@  
        				 + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184  
        				 + "|" // 允许IP和DOMAIN（域名） 
        				 + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.  
        				 + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名  
       				 + "[a-z]{2,6})" // first level domain- .com or .museum  
       				 + "(:[0-9]{1,4})?" // 端口- :80  
       				 + "((/?)|" // a slash isn't required if there is no file name  
	     				 + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+/?))$";
					var re=new RegExp(strRegex); 
					if(re.test(val))
						return true;
					result.message = "url格式不正确";
					return false;
				},
				urlV6 : function(val,result){
					var urlHttp = /^((https|http|ftp|rtsp|mms)?:\/\/)(([0-9a-z_!~\*'\(\)\.&=\+\$%\-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?/;
					if(val == ""){
						return true;
					}
					var s1 = "";
					var s2 = "";
					var tmp = "";
					if(val.indexOf("@")>0){
						tmp = val.substring(val.indexOf("@")+1);
					}else{
						tmp = val.substring(val.indexOf("/")+2);
					}
					if(urlHttp.test(val) && tmp!=""){
						if(tmp.indexOf("/") == -1){
							s1 = tmp;
						}else{
							s1 = tmp.substring(0,tmp.indexOf("/"));
							s2 = tmp.substring(tmp.indexOf("/"));
						}
						var strRegex1 = /^(\[)?((([0-9A-Fa-f]{1,4}:){7}(([0-9A-Fa-f]{1,4})|:))|(([0-9A-Fa-f]{1,4}:){6}(:|((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})|(:[0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}:){5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){4}(:[0-9A-Fa-f]{1,4}){0,1}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){3}(:[0-9A-Fa-f]{1,4}){0,2}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){2}(:[0-9A-Fa-f]{1,4}){0,3}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:)(:[0-9A-Fa-f]{1,4}){0,4}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(:(:[0-9A-Fa-f]{1,4}){0,5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})))(%.+)?(])?(:\d{0,5})?$/
						var strRegex2 = /((\/)[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+\$,%#-]+\/?))$/
						var re1=new RegExp(strRegex1); 
						var re2=new RegExp(strRegex2); 
						if(s2 != ""){
							if(re1.test(s1) && re2.test(s2)){
								return true;
							}
						}else{
							if(re1.test(s1)){
								return true;
							}
						}
					}
					result.message = "url格式不正确";
					return false;
				},
				BlockPosition : function(val,result){
					var regex = /^[0-9]+\*[0-9]+$/;
					if(regex.test(val)){
						return true;
					}
					result.message = "坐标格式不正确";
					return false;
				},
				ratio : function(val,result){
					var regex = /^[0-9]+\*[0-9]+$/;
					if(regex.test(val)){
						return true;
					}
					result.message = "分辨率格式不正确";
					return false;
				},
				spratio : function(val,result){
					var regex = /^[0-9]+\*[0-9]+$/;
					if(regex.test(val) || $.trim(val).length == 0){
						return true;
					}
					result.message = "分辨率格式不正确";
					return false;
				},
				mustselect : function(val,result){
					if($.trim(val.replace("请选择","")).length > 0)
						return true;
					result.message = "必须选择";
					return false;
				},
		};
		var parse_exp = function(exp){
			/**
			 * exp like  empty|len[20,30]|(not_char[_,+-|])
			 * */
			var exp_fn_stack = [];
			var index = 0;
			var arg_stack = [];
			for(var i = 0; i < exp.length; i++){
				var char = exp[i];
				if(operators.indexOf(char) == -1){//如果该字符是普通字符
					index++;
					if(char == "["){//匹配参数
						if(arg_stack.length == 0){
							arg_stack.push(char);
						}
					}
					if(char == "]"){//如果char为]
						if(arg_stack.length > 0 && (i == exp.length-1 || operators.indexOf(exp[i+1]) != -1)){//如果存在[ 并且该char后面紧接字符为操作符，则说明是参数关闭符
							arg_stack = [];
						}
					}
					if(i < exp.length-1)
						continue;
				}
				//是操作符号
				//如果该操作符不在参数内，判断条件为arg_stack是否为空，如果不为空，则说明，该符号是某个验证器的参数，当普通符号处理
				if(arg_stack.length > 0){
					index++;
					continue;
				}
				if(index > 0){
					var begin = i-index;
					var end = i;
					if(i == exp.length-1){
						begin++;
						end++;
					}
					exp_fn_stack.push(exp.substring(begin,end));
					index = 0;
				}
				if(i < exp.length-1)
					exp_fn_stack.push(char);
			}
			return build_validate_fn(exp_fn_stack);
		}
		
		var build_validate_fn = function(exp_fn_stack){
			var fn_str = "";
			for(var i = 0; i<exp_fn_stack.length; i++){
				var str = exp_fn_stack[i];
				if(str.length == 1 && operators.indexOf(str) != -1){
					fn_str += operatorMapping[str];
				}else{
					fn_str += get_validate_fn(str);
				}
			}
			var fn_pre = "var validate_fn = function(val){var result = {};\n" +
					"var flag = "+fn_str+";";
			var fn_suf = "\n result.flag = flag;" +
					"\nreturn result;}";
			var fn_total_str = fn_pre + fn_suf;
			eval(fn_total_str);
			return validate_fn;
		}
		
		var get_validate_fn = function(str){
			var validators_str = "validators.";
			if(str.indexOf("[") == -1)
				return validators_str+str+"(val,result)";
			var arg_index = str.indexOf("[");
			var pre = str.substring(0,arg_index);
			var arg_str = "val,result,"+str.substring(arg_index+1,str.length-1)+"";
			return validators_str+pre+"("+arg_str+")";
		}
		
		return function(node){
			  var elem= W.$(node), node = $(node);
			  var exp = node.attr('data-validate-exp');
			  var validate_fn = parse_exp(exp);
			 W.$(node).data_validator(function(value, callback){
				 var result = validate_fn(value);
				 if(result.flag){
					 return true;
				 }
				 return result.message;
			 });
		}
		
	})()
});
