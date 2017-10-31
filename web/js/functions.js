// JavaScript Document
//字符串截取
function str_cut(str,len,hasDot){
	var newLength = 0;
	var newStr = "";
	var chineseRegex = /[^\x00-\xff]/g;
	var singleChar = "";
	var strLength = str.replace(chineseRegex,"**").length;
	for(var i = 0;i < strLength;i++)
	{
	singleChar = str.charAt(i).toString();
	if(singleChar.match(chineseRegex) != null)
	{
	newLength += 2;
	}
	else
	{
	newLength++;
	}
	if(newLength > len)
	{
	break;
	}
	newStr += singleChar;
	}
	
	if(hasDot && strLength > len)
	{
	newStr += "...";
	}
	return newStr; 
}