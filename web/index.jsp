<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://www.onewaveinc.com/bumblebee" prefix="bumblebee" %>
<%@ taglib uri="http://www.onewaveinc.com/security" prefix="security" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

<title></title>
<security:sso />
<bumblebee:imports />
<LINK REL="SHORTCUT ICON" type="image/x-icon" HREF="images/new/favicon.ico" />
<link href="css/navigationcom.css" rel="stylesheet" type="text/css" />
<link href="css/jquery-layout-css.css" rel="stylesheet" type="text/css" />
<link href="css/page-style.css" rel="stylesheet" type="text/css" />
<link href="css/quirk.css" rel="stylesheet" type="text/css" />
<link href="css/html.ui.css" rel="stylesheet" type="text/css" />
<link href="css/custom.css" rel="stylesheet" type="text/css" />
<link href="css/style.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="css/welcome.css">
<link href="css/codemirror.css" rel="stylesheet" type="text/css" />
<link href="js/xheditor_skin/default/iframe.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="js/xheditor_skin/default/ui.css"  type="text/css" />
<link href="css/login.css" rel="stylesheet" type="text/css" />
<script language="javascript" src="js/compatible-extends.js"></script>
<script type="text/javascript" src="js/jquery.layout.js"></script>
<script language="javascript" src="js/my-jquery-plugin.js"></script>
<script language="javascript" src="js/functions.js"></script>
<script language="javascript" src="js/html.ui.js"></script>
<script language="javascript" src="js/mock.js"></script>
<script language="javascript" src="js/xheditor.js"></script>
<script language="javascript" src="js/picture-preview.js"></script>
<script language="javascript" src="js/jquery.cookie.js"></script>
<script language="javascript" src="js/functions.js"></script>
<script type="text/javascript" src="js/user-history.js"></script>
<script language="javascript" src="js/constants.js"></script>
<script language="javascript" src="js/codemirror.js"></script>
<script language="javascript" src="js/xml.js"></script>
<script language="javascript" src="js/javascript.js"></script>
<script language="javascript" src="js/htmlmixed.js"></script>
<script language="javascript" src="js/css.js"></script>
<!-- <script type="text/javascript" src="js/personalization.js"></script> -->
<script language="javascript" src="js/echarts.min.js"></script>
<script type="text/javascript">
// 设置title
$.ajax({
	url: 'systemTitle.txt',
	dataType: 'text',
	success: function(data) {
		$("title").html(data); 
	}
});

W.main(function() {
	var init = function(){
			W.show('layouts/popup', {main:'pages/layouts/main'}).done(function() {
				W.on('status-code:401', function() {
					W.popup('login');
				});
	
				W.on('status-code:403', function() {
					W.alert('没有权限执行操作');
				});
			});
	}
	W.on("main:init", "public" ,function(){
		W.AccessControl.init(init);
	});
	W.on("main:initAfer", "public" ,function(){
		if (typeof SSOLogin != 'undefined') {
			return SSOLogin();
		}	
		W.AccessControl.init(init);
	});
	W.allow('login/test', 'get').done({
		success: function() {
			W.get('login/test').done(function(logged) {
				if (logged) {
					if (typeof SSOLogin != 'undefined') {
						return SSOLogin();
					}
					W.AccessControl.init(function(){
						W.load("pages/layouts/main");
					});
				} else {
					W.$("loginDiv").show('login-new');
				}
			});
		}
	});
});

</script>
</head>
<body>
<div id="w--loginDiv"></div>
</body>
</html>