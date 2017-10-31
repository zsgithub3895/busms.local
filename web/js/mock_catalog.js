var catalogIsAlreadyCreated = false ;

var contentSetProfile = {};
var catalogNormalInfo={};
var catalogPolicy = {};
var catalogSelContInfo={};
var catalogSortInfo={};

var pageIsAlreadyCreated = false ;
var pageInfo = {};
var pageContent = {};
var pagePolicy = {};
var authList = [];
var pageDetialInfo = {};
var templateCategory = {};

//===============编排结果返回信息================//
var arrange_info_codes = ['1000','1001','1002','1003'];
var arrange_info = {'1000':"已被编入",'1001':"未被编入, 原因:在该栏目(或目录)中已经存在",'1002':"未被编入, 原因:资产格式或者子内容格式不匹配",'1003':"已经被移除" };

//===============内容管理全局变量================//

//富文本
var richContent = '';

var ContentAsset = function(){	
	this.iptvMovies = [];
	this.pictures = [];
	this.castRoles = [];
	this.fileList = [];
	this.physicalChannel = {};
	this.assetValidateStatus = false ;
	this.contentIPTVProgram = [];
	this.contentRSSeriesProgram = [];
	this.segments = [];
	this.ipIds = [];
	this.phonescopeIds = [];
	this.service_contents_delete = [];
	this.service_contents = [];
	this.movieProperty = [];
	this.suiteVersionDelIds = [];
	this.uaAddition = [];
	this.uaGroup = [];
};

ContentAsset.prototype.init = function(){
	this.iptvMovies = [];
	this.pictures = [];
	this.castRoles = [];
	this.fileList = [];
	this.physicalChannel = {};
	this.assetValidateStatus = false ;
	this.contentIPTVProgram = [];
	this.contentRSSeriesProgram = [];
	this.segments = [];
	this.ipIds = [];
	this.phonescopeIds = [];
	this.service_contents_delete = [];
	this.service_contents = [];
	this.movieProperty = [];
	this.suiteVersionDelIds = [];
	this.uaAddition = [];
	this.uaGroup = [];
};

var contentAsset = new ContentAsset();

//===============内容管理全局变量================//

//匹配http或者rtsp格式
var urlMatchHttp = /^http:\/\/.*$/;
var urlMatchRtsp = /^rtsp:\/\/.*$/;
var urlMatchPath = /^\/.+$/;


function extend(des, src, override){
    if(src instanceof Array){
        for(var i = 0, len = src.length; i < len; i++)
             extend(des, src[i], override);
    }
    for( var i in src){
        if(override || !(i in des)){
            des[i] = src[i];
        }
    } 
    return des;
}

var indexRule = [{id:5,name:'分类内容规则'}];

W.mock.get("indexRule/index",function(){
	return indexRule ;
});


//为数组添加remove方法
Array.prototype.remove = function(from, to) {   
    var rest = this.slice((to || from) + 1 || this.length);   
    this.length = from < 0 ? this.length + from : from;   
    return this.push.apply(this, rest);   
};  

//保存当前用户的信息
var currentUser = {};

//内容分类根信息
//============ ROOT BEGIN================//
var resource = new Array(
		{id:0,title:'所有分类',state:'closed',data:{treeCode:9999,type:0}},
		{id:-1,title:'所有频道',state:'closed',data:{treeCode:9998,type:1} },
		{id:-2,title:'所有节目单',state:'closed',data:{treeCode:9997,type:2}},
		{id:-3,title:'所有演员',state:'closed',data:{treeCode:9995,type:5} },
		{id:-4,title:'所有导演',state:'closed',data:{treeCode:9996,type:4} },
		{id:-5,title:'所有产地',state:'closed',data:{treeCode:9994,type:6} },
		{id:-6,title:'所有关键字',state:'closed',data:{treeCode:9993,type:7} }
	);


W.mock.get('ROOT',function(){
return resource ;
});

var resourceAll = new Array(
		{id:0,title:'所有分类',state:'closed',data:{treeCode:9999} },
		{id:-1,title:'所有频道',state:'closed',data:{treeCode:9998} },
		{id:-2,title:'所有节目单',state:'closed',data:{treeCode:9997}}
	);

W.mock.get('ALLROOT',function(){
	return resourceAll ;
	});

var resourceCatalog = new Array({id:-1,title:'所有目录',state:'closed',data:{treeCode:9999}});
W.mock.get('CatalogRoot',function(){
	return resourceCatalog;
});

var allScreenSite = new Array({id:99999999,title:'所有三屏站点',state:'closed',data:{treeCode:9999,type:'ScreenSiteRoot'}});
W.mock.get('ScreenSiteRoot',function(){
	return allScreenSite;
});


var contentresource = new Array({
id:0,title:'所有分类',state:'closed',data:{treeCode:9999}
});

W.mock.get('ContentROOT',function(){
return contentresource ;
});

var channelresource = new Array({
id:-1,title:'所有频道',state:'closed',data:{treeCode:9998}
});

W.mock.get('ChannelROOT',function(){
return channelresource ;
});

var scheduleresource = new Array({
	id:-2,title:'所有节目单',state:'closed',data:{treeCode:9997}
	});

	W.mock.get('ScheduleROOT',function(){
	return scheduleresource ;
	});
var actorresource = new Array({
	id:-3,title:'所有演员',state:'closed',data:{treeCode:9995}
	});

	W.mock.get('ActorROOT',function(){
	return actorresource ;
	});
var directorresource = new Array({
	id:-4,title:'所有导演',state:'closed',data:{treeCode:9996}
	});

	W.mock.get('DirectorROOT',function(){
	return directorresource ;
	});	
var regionresource = new Array({
		id:-5,title:'所有产地',state:'closed',data:{treeCode:9994}
	});
	
	W.mock.get('RegionROOT',function(){
		return regionresource ;
	});	
var keywordresource = new Array({
		id:-6,title:'所有关键字',state:'closed',data:{treeCode:9993}
	});
	
	W.mock.get('KeywordROOT',function(){
		return keywordresource ;
	});	
//============ ROOT END================//

//============ 《",'》特殊字符转义 =============//
//var regexMatcherMarks = function(str){
//	var patrn1 = /\"/g;
//	var patrn2 = /\'/g;
//	var matcher = function(s,p,to){
//		return s.replace(p,to);
//	};
//	var value = matcher(matcher(str,patrn2,"\\\'"),patrn1,"\\\"");
//	return value;
//};
	
	var resourceCatalog = new Array({id:-1,title:'所有栏目',state:'closed',data:{treeCode:9999}});
	W.mock.get('pageRoot',function(){
		return resourceCatalog;
	});
	