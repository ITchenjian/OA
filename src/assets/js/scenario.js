/*
* @Author: Administrator
* @Date:   2017-12-27 16:27:09
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-26 17:29:30
*/
jQuery.support.cors = true;
$('#editscenModal').on('hidden.bs.modal', function (e) {
  	$("#editscen_form").Validform().resetForm(); 
 	$("#editscenModal .Validform_checktip").html("");
});
//获取区域列表
var search={
	pageNumber:"1",
	pageSize:"10",
	zoneName:""
};
addscen_list(true,search.pageNumber);
function addscen_list(pag,pageN){
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_getScene","params":{"page_num":"'+pageN+'","page_limit":"'+search.pageSize+'","scene_name":"'+search.zoneName+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;

			//翻页
			if(pag){
				scen_page(data.result.rowsCount,data.result.pageSize);
			}
			var list = data.result.items;
			var html="";
			var arr=[];
			for(var i=0;i<list.length;i++){
				arr.push('<tr>');
				arr.push('<td>'+list[i].sceneName+'</td>');
				/*if(Boolean(list[i].areaDes)){
					arr.push('<td>'+list[i].areaDes.slice(0, 20)+'</td>');
				}else{
					arr.push('<td>暂无描述</td>');
				}*/
				
				arr.push('<td>'+list[i].createdDate+'</td>');

				var strTypeName=list[i].devName.substring(0,list[i].devName.length-1);
				if(strTypeName.length>20){
					strTypeName=strTypeName.substring(0,20)+"...";
				}
				arr.push('<td>'+strTypeName+'</td>');
				/*if(Boolean(list[i].gwDevnumber)){
					arr.push('<td>'+list[i].gwDevnumber+'</td>');
				}else{
					arr.push('<td>0</td>');
				}*/
				
				arr.push('<td><a title="" href="./scentype.html?wd='+list[i].sceneId+'&scenname='+list[i].sceneName+'"><span>查看</span></a>&nbsp;&nbsp;<a title="" href="#" data-target="#editscenModal" data-toggle="modal" onclick="edit_scen('+list[i].sceneId+')"><span>编辑</span></a>&nbsp;&nbsp;<a title="删除" href="javascript:;" onclick="del_scen('+list[i].sceneId+')" class=""><span>删除</span></a></td>');
				arr.push('</tr>');
			}
			html=arr.join("");
			$("#tbody").html(html);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
}

$("#search_btn").click(function(event) {
	search.pageNumber="1";
	search.zoneName=$("#a_name").val();
	addscen_list(true,search.pageNumber);

});


//编辑场景获取数据
function edit_scen(areaId){
	$("#scen_id").val(areaId);
	if(areaId=="") return;
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_getBeforeScene","params":{"zone_id":"'+areaId+'"}}'
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
			$("#scenaname").val(result.sceneName);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
	
}

//删除场景
function del_scen(areaId){
	parent.layer.confirm('您确定删除该场景？', 
	{
	  btn: ['确定','取消']
	}, function(index){
		parent.layer.close(index);
		$.ajax({
			url:get_api_url(),
			async:true,
			cache:false,
			// timeout:2000,
			type:"post",
			dataType:"json",
			data: {
		    	params:'{"api_name":"delete_area_level","params":{"zone_id":"'+areaId+'"}}'
		    },
			contentType:"application/x-www-form-urlencoded;charset=utf-8", 
			beforeSend:function(xhr){
				// parent.modal_loading("正在获取数据！");
				
			},
			success:function(data,status,xhr){
				addscen_list(true,search.pageNumber);
				
			},
			error: function (a, b, c) {
				// parent.modal_loading("error");
			 	console.log(c);
			 }
			 
		});
	});
	
	
}

//添加、编辑完成提交数据
$("#edit_true").click(function(event) {
	if(!sceninfo) return;
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_add_areaLevel","params":{"zone_id":"'+$("#scen_id").val()+'","zone_name":"'+$("#scenaname").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			addscen_list(true,search.pageNumber);

			
			
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
	sceninfo=false;
	$("#editscenModal").modal('hide');
});
