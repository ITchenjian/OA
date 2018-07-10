/*
* @Author: Administrator
* @Date:   2017-09-29 14:06:02
* @Last Modified by:   Administrator
* @Last Modified time: 2018-01-03 15:27:03
*/
//获取区域列表
var search={
	pageNumber:"1",
	pageSize:"10",
	name:"",
	typeCode:"174",
	zoneId:""
};

var scenId=location.search.split("=")[1];
if(scenId){
	$("#addequip").show();
	search.zoneId=scenId;
}else{
	$("#addequip").hide();
	search.zoneId="";
}; 

dev_list(true,search.pageNumber);


$("#search_btn").click(function(event) {
	search.pageNumber="1";
	search.name=$("#dev_name").val();
	dev_list(true,search.pageNumber);

});