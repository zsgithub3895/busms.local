// 数据权限对象定义
var auth_obj = {
	site:1,
	page:2,
	deatilPage:3,
	catalog:4,
	targetSystem:5,
	template:6,
	screenLayout:7,
	apkMessage:8,
	headerTheme:9
}

//数据权限对象与后台SESSION KEY的对应关系
var auth_key = {
		site:'SITE_AUTH',
		page:'PAGE_AUTH',
		targetSystem:'TARGETSYSTEM_AUTH',
		template:'TEMPLATE_AUTH'
}