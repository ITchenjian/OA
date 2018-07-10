/*
* @Author: Administrator
* @Date:   2018-03-23 15:53:19
* @Last Modified by:   Administrator
* @Last Modified time: 2018-03-26 18:23:49
*/
var locationSearch=location.search;

var senTypeId=locationSearch.split("&")[0].split("=")[1];
var curPage=locationSearch.split("&")[1].split("=")[1];
console.log(senTypeId);

getSetDate(senTypeId);
function getSetDate(eqsetId){
	if(!Boolean(eqsetId)) return;
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"beforeModificationDevType","params":{"id":"'+eqsetId+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result=data.result;
			$("#sentype").val(result.typeName);
			$("#sensorid").val(result.id);
			
			$("#sencode").val(result.typeCode);
			$("#control").val(result.controlClass);

		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});

}


/*提交*/
$("#trueset_btn").click(function(){

	/*调用接口*/
	$("#setdata").ajaxSubmit({
		url : get_api_set(),
        type : 'POST',  
        dataType : "json",  
        clearForm: false,  
        success : function(data) {
        	console.log(data)
        	if(data.code==130){
		        window.parent.location.href="../../index.html";
		        return;
		    }else if (data.code!=100){
		    	// console.log(data.code)
            	parent.layer.msg('设置失败', { time: 1000});
            };
            window.location.href="./sensortype.html?curPage="+curPage;
        }  
	});
    return false;
});

