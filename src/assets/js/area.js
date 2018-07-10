/*
* @Author: Administrator
* @Date:   2017-09-25 10:53:42
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-26 08:58:47
*/

$('#editareaModal').on('hidden.bs.modal', function (e) {
  	$("#editarea_form").Validform().resetForm(); 
 	$("#editareaModal .Validform_checktip").html("");
 	map.clearOverlays();
});

var map = new BMap.Map("areaMap"); 
map.centerAndZoom(new BMap.Point(113.946896, 22.546078), 12);   
setMapEvent(map);
addMapControl(map);
// addMapOverlay(map);



map.addEventListener("click", function(e) {
    // 创建地理编码服务实例
    var myGeo = new BMap.Geocoder();
    // 根据坐标得到地址描述
    myGeo.getLocation(new BMap.Point(e.point.lng, e.point.lat), function(result) {
        if (result) {
            console.log(e)
            $("#area_address").val(result.address);
            $("#point_lng").val(e.point.lng);
            $("#point_lat").val(e.point.lat);
        }

    });
});

//获取区域列表
var search={
	pageNumber:"1",
	pageSize:"10",
	zoneName:""
};
area_list(true,search.pageNumber);
function area_list(pag,pageN){
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_get_area_level_list","params":{"type":"0","pageNumber":"'+pageN+'","pageSize":"'+search.pageSize+'","zone_name":"'+search.zoneName+'"}}'
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
				area_page(data.result.rowsCount,data.result.pageSize);
			}
			var list = data.result.items;
			var html="";
			var arr=[];
			for(var i=0;i<list.length;i++){
				arr.push('<tr>');
				arr.push('<td>'+list[i].zoneName+'</td>');
				/*if(list[i].type==1){
					arr.push('<td>大棚</td>');
				}else{
					arr.push('<td>普通</td>');
				};*/
				if(Boolean(list[i].areaDes)){
					arr.push('<td>'+list[i].areaDes.slice(0, 20)+'</td>');
				}else{
					arr.push('<td>暂无描述</td>');
				};
				
				arr.push('<td>'+list[i].createdDate+'</td>');
				arr.push('<td>'+list[i].address+'</td>');
				if(Boolean(list[i].gwDevnumber)){
					arr.push('<td>'+list[i].gwDevnumber+'</td>');
				}else{
					arr.push('<td>0</td>');
				}
				if(list[i].type==0){
					arr.push('<td><a title="设备详情" href="./equipinfo.html?wd='+list[i].zoneId+'"><span class="glyphicon glyphicon-th" aria-hidden="true"></span></a>&nbsp;&nbsp;<a title="编辑" href="#" data-target="#editareaModal" data-toggle="modal" onclick="edit_area('+list[i].zoneId+')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>&nbsp;&nbsp;<a title="选择设备类型" href="#" data-target="#homedisModal" data-toggle="modal" onclick="chose_equ('+list[i].zoneId+')"><span class="glyphicon glyphicon-check" aria-hidden="true"></span></a>&nbsp;&nbsp<a title="删除" href="javascript:;" onclick="del_area('+list[i].zoneId+')" class=""><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a></td>');
				}else if(list[i].type==1){
					arr.push('<td><a title="读卡器设置" href="./readcard.html?wd='+list[i].zoneId+'"><span class="glyphicon glyphicon-th" aria-hidden="true"></span></a>&nbsp;&nbsp;<a title="编辑" href="#" data-target="#editareaModal" data-toggle="modal" onclick="edit_area('+list[i].zoneId+')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>&nbsp;&nbsp;<a title="删除" href="javascript:;" onclick="del_area('+list[i].zoneId+')" class=""><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a></td>');
				}
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
	search.zoneName=$("#a_name").val();
	area_list(true,search.pageNumber);

});


//编辑区域获取数据
function edit_area(areaId){
	$("#area_id").val(areaId);
	if(areaId==""){
		$("#area_type").removeAttr("disabled");
		return ;
	};
	$('#area_type').attr("disabled","disabled"); 
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_get_area_level_info","params":{"zone_id":"'+areaId+'"}}'
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
			$("#area_name").val(result.zoneName);
			$("#area_address").val(result.address);
			$("#area_des").val(result.areaDes);
			$("#point_lng").val(result.longitude);
			$("#point_lat").val(result.latitude);
			$("#area_id").val(result.zoneId);
			$("#area_type").val(result.type);
			addMapOverlayl(result.latitude, result.longitude, map);
			setTimeout(function(){
				map.panTo(new BMap.Point(result.longitude,result.latitude),{noAnimation:true});
			}, 200);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
	
}
//选择显示设备获取设备
function chose_equ(areaId){
	$("#area_id_equ").val(areaId);
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"getDevType","params":{"pageNumber":"0","pageSize":"0"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;

			var list = data.result.items;
			var html="";
			var arr=[];
			for(var i=0;i<list.length;i++){
				arr.push('<li class="list-group-item" data-id="">');
				arr.push('<input type="checkbox" id="'+list[i].id+'">');
				arr.push('<label for="'+list[i].id+'">'+list[i].typeName+'</label>');
				arr.push('</li>');
			}
			html=arr.join("");
			$("#equtype_menu").html(html);
			chose_equip(areaId);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
	
};

function chose_equip(areaId){
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"getHomePage","params":{"zone_id":"'+areaId+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			var result=data.result;
			if(data.code!=100) return;
			console.log(result[0].devTypeId);
			for(var i=0;i<result.length;i++){
				$("#"+result[i].devTypeId).prop("checked","checked");
			}
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
}

//选择设备确定
$("#chose_true").click(function(){
	var arrid=[];
	var arrname=[];
	for(var i=0;i<$("#equtype_menu input").length;i++){
		var chk=$("#equtype_menu input").eq(i).prop("checked");
		if(chk){
			arrid.push($("#equtype_menu input").eq(i).attr("id"));
			arrname.push($("#equtype_menu input").eq(i).attr("data-name"));
		}
	}
	console.log(arrid);
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"modifyOrAdd","params":{"zone_id":"'+$("#area_id_equ").val()+'","dev_type":"'+arrid+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
	$("#homedisModal").modal('hide');
});


//删除区域
function del_area(areaId){
	parent.layer.confirm('您确定删除该区域？', 
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
				area_list(true,search.pageNumber);
				
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
	if(!areainfo) return;
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_add_areaLevel","params":{"zone_id":"'+$("#area_id").val()+'","type":"'+$("#area_type").val()+'","zone_name":"'+$("#area_name").val()+'","address":"'+$("#area_address").val()+'","point_lng":"'+$("#point_lng").val()+'","point_lat":"'+$("#point_lat").val()+'","area_des":"'+$("#area_des").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			area_list(true,search.pageNumber);

			
			
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
	areainfo=false;
	$("#editareaModal").modal('hide');
});
