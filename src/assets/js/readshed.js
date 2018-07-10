/*
* @Author: Administrator
* @Date:   2017-10-17 12:08:42
* @Last Modified by:   Administrator
* @Last Modified time: 2018-01-09 13:57:54
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
	zoneName:"",
	type:"1"
};
readshed_list(true,search.pageNumber);
function readshed_list(pag,pageN){
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_get_area_level_list","params":{"pageNumber":"'+pageN+'","pageSize":"'+search.pageSize+'","zone_name":"'+search.zoneName+'","type":"'+search.type+'"}}'
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
				readshed_page(data.result.rowsCount,data.result.pageSize);
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
				arr.push('<td>'+list[i].address+'</td>');
				if(Boolean(list[i].gwDevnumber)){
					arr.push('<td>'+list[i].gwDevnumber+'</td>');
				}else{
					arr.push('<td>0</td>');
				}
				
				arr.push('<td><a title="读卡器设置" href="./readcard.html?wd='+list[i].sceneId+'"><span>读卡器设置</span></a>&nbsp;&nbsp;<a title="编辑" href="#" data-target="#editareaModal" data-toggle="modal" onclick="edit_area('+list[i].sceneId+')"><span>编辑</span></a>&nbsp;&nbsp;<a title="删除" href="javascript:;" onclick="del_area('+list[i].sceneId+')" class=""><span>删除</span></a></td>');
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
	readshed_list(true,search.pageNumber);

});


//编辑大棚获取数据
function edit_area(areaId){
	$("#area_id").val(areaId);
	if(areaId=="") return;
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
			$("#area_name").val(result.sceneName);
			$("#area_address").val(result.address);
			$("#area_des").val(result.sceneDes);
			$("#point_lng").val(result.longitude);
			$("#point_lat").val(result.latitude);
			$("#area_id").val(result.sceneId);
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

//删除大棚
function del_area(areaId){
	parent.layer.confirm('您确定删除该大棚？', 
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
				readshed_list(true,search.pageNumber);
				
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
	    	params:'{"api_name":"web_add_areaLevel","params":{"zone_id":"'+$("#area_id").val()+'","zone_name":"'+$("#area_name").val()+'","address":"'+$("#area_address").val()+'","point_lng":"'+$("#point_lng").val()+'","point_lat":"'+$("#point_lat").val()+'","area_des":"","type":"'+search.type+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			readshed_list(true,search.pageNumber);

			
			
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
	areainfo=false;
	$("#editareaModal").modal('hide');
});
