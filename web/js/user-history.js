/**
 * 记录用户的操作历史
 **/
$(function(){
	//操作历史
	var footHistory = {};
	footHistory["content"] = {};
	footHistory["page"] = {};
	var footHistory_length = 2;
	var cookieKey = "footHistory";
	
	var init = function(){
		//var his_str = $.cookie(cookieKey);
		var his_str = window.localStorage.getItem(cookieKey);
		if(his_str){
			footHistory = $.evalJSON(his_str);
		}
	}
	init();
	var saveCookie = function(){
		window.localStorage.setItem(cookieKey,$.toJSON(footHistory));
	}
	
	//foot的结构{name,url}
	var record = function(his, type){
		var url = window.location.href;
		if(footHistory[type][his.id]){
			delete footHistory[type][his.id];
		}
		var historyAry = getFootHistoryAry(type);
		historyAry.reverse();
		if(historyAry.length >= footHistory_length){
			historyAry = historyAry.slice(0,footHistory_length-1);
		}
		//his.url = url;
		his.type = type;
		historyAry.unshift(his);
		footHistory[type] = restoreFootHistory(historyAry);
		saveCookie();
		//W.fire("footHistory:refresh",historyAry);
	};
	var get = function(type){
		return getFootHistoryAry(type);
	};
	
	var getFootHistoryAry = function(type){
		var ary = [];
		var flag = false;
		$.each(footHistory[type],function(i,n){
			if(i == "undefined"){
				flag = true;
				return;
			}
			ary.unshift(n);
		});
		if(flag){
			restoreFootHistory(ary);
		}
		return ary;
	}
	var restoreFootHistory = function(ary){
		var tmp = {};
		$.each(ary,function(i,n){
			tmp[n.id] = n;
		});
		return tmp;
	}
	
	var go = function(url){
		var hash = getHash(url);
		if(hash == "")
			return;
		var _hash = unescape(hash);
		var state = $.evalJSON(_hash);
		W.history.replace(state);
		//history.replaceState(state,'','#'+hash);
		
	}
	
	function getHash(url){
		var index = url.indexOf('#');
		if(index == -1)
			return "";
		return url.substring(index+1,url.length);
	}
	
	window.FootHistory = {
		record : record,
	     get : get,
	     go : go
	};
})