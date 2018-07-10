/*
* @Author: Administrator
* @Date:   2017-09-25 10:53:42
* @Last Modified by:   Administrator
* @Last Modified time: 2018-03-29 11:44:05
*/

$('#editequipModal').on('hidden.bs.modal', function (e) {
  	$("#editequip_form").Validform().resetForm(); 
 	$("#editequipModal .Validform_checktip").html("");
 	map.clearOverlays();
});

$('#localModal').on('hidden.bs.modal', function (e) {
 	map2.clearOverlays();
});

var map = new BMap.Map("equipMap"); 
map.centerAndZoom(new BMap.Point(113.937122, 22.542874), 12);   
setMapEvent(map);
addMapControl(map);
// addMapOverlay(map);

var map2 = new BMap.Map("total_local"); 
map2.centerAndZoom(new BMap.Point(113.834212, 22.6299), 12);   
setMapEvent(map2);
addMapControl(map2);


map.addEventListener("click", function(e) {
    // 创建地理编码服务实例
    var myGeo = new BMap.Geocoder();
    // 根据坐标得到地址描述
    myGeo.getLocation(new BMap.Point(e.point.lng, e.point.lat), function(result) {
        if (result) {
            console.log(e)
            $("#equip_address").val(result.address);
            $("#point_lng").val(e.point.lng);
            $("#point_lat").val(e.point.lat);
        }

    });
});

//获取设备列表
var zoneId=location.search.split("=")[1];
// console.log(zoneId);
var search={
	pageNumber:"1",
	pageSize:"10",
	equipName:"",
	zoneId:""
};
equip_list(true,search.pageNumber);
function equip_list(pag,pageN){
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"get_equipment_list","params":{"pageNumber":"'+pageN+'","pageSize":"'+search.pageSize+'","zone_id":"'+search.zoneId+'","name":"'+search.equipName+'"}}'
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
				equip_page(data.result.rowsCount,data.result.pageSize);
			}
			var list = data.result.items;
			var html="";
			var arr=[];
			for(var i=0;i<list.length;i++){
				arr.push('<tr>');
				arr.push('<td>'+list[i].deviceName+'</td>');
				
				if(Boolean(list[i].devId)){
					arr.push('<td>'+list[i].typeName+'</td>');
				}else{
					arr.push('<td>未绑定</td>');
				}
				arr.push('<td>'+list[i].createdDate+'</td>');
				arr.push('<td>'+list[i].address+'</td>');
				if(Boolean(list[i].devId)){
					arr.push('<td>已绑定</td>');
					arr.push('<td><a title="" href="#" data-target="#editequipModal" data-toggle="modal" onclick="edit_equip('+list[i].equId+',\''+list[i].webMapPicture+'\')"><span>编辑</span></a>&nbsp;&nbsp;<a title="" href="#" onclick="unbind_equip('+list[i].equId+',\''+list[i].devId+'\')"><span>解绑</span></a>&nbsp;&nbsp;<a title="" href="javascript:;" onclick="del_equip('+list[i].equId+')" class=""><span>删除</span></a></td>');
				
				}else{
					arr.push('<td>已解绑</td>');
					arr.push('<td><a title="" href="#" data-target="#editequipModal" data-toggle="modal" onclick="edit_equip('+list[i].equId+',\''+list[i].webMapPicture+'\')"><span>编辑</span></a>&nbsp;&nbsp;<a title="" href="#" data-target="#bindequipModal" data-toggle="modal" onclick="bind_equip('+list[i].equId+')"><span>绑定</span></a>&nbsp;&nbsp;<a title="" href="javascript:;" onclick="del_equip('+list[i].equId+')" class=""><span>删除</span></a></td>');
				
				}
				
				// arr.push('<td><a title="" href="#" data-target="#editequipModal" data-toggle="modal" onclick="edit_equip('+list[i].equId+',\''+list[i].typeName+'\')"><span>编辑</span></a>&nbsp;&nbsp;<a title="" href="#" data-target="#bindequipModal" data-toggle="modal" onclick="bind_equip('+list[i].equId+')"><span>绑定</span></a>&nbsp;&nbsp;<a title="" href="#" onclick="unbind_equip('+list[i].equId+',\''+list[i].devId+'\')"><span>解绑</span></a>&nbsp;&nbsp;<a title="" href="javascript:;" onclick="del_equip('+list[i].equId+')" class=""><span>删除</span></a></td>');
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
	search.equipName=$("#e_name").val();
	equip_list(true,search.pageNumber);

});


//编辑获取数据
function edit_equip(equId,mapMark){
	$("#area_id").val(zoneId);
	$("#equip_id").val(equId);
	if(equId=="") return;
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"get_equipment_detail","params":{"equ_id":"'+equId+'"}}'
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
			$("#equip_name").val(result.deviceName);
			$("#equip_address").val(result.address);
			$("#point_lng").val(result.longitude);
			$("#point_lat").val(result.latitude);
			$("#equip_id").val(result.equId);
			$("#equip_remarks").val(result.remarks);
			
			addMapOverlayl(result.latitude, result.longitude, map, mapMark);
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

//删除设备
function del_equip(equId){
	parent.layer.confirm('您确定删除该设备？', 
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
		    	params:'{"api_name":"deleteEquipment","params":{"equ_id":"'+equId+'"}}'
		    },
			contentType:"application/x-www-form-urlencoded;charset=utf-8", 
			beforeSend:function(xhr){
				// parent.modal_loading("正在获取数据！");
				
			},
			success:function(data,status,xhr){
				equip_list(true,search.pageNumber);
				
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
	if(!equipinfo) return;
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"addOrModifyEquipment","params":{"equ_id":"'+$("#equip_id").val()+'","zone_id":"'+$("#area_id").val()+'","devName":"'+$("#equip_name").val()+'","address":"'+$("#equip_address").val()+'","longitude":"'+$("#point_lng").val()+'","latitude":"'+$("#point_lat").val()+'","remarks":"'+$("#equip_remarks").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			equip_list(true,search.pageNumber);

			
			
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});

	equipinfo=false;
	$("#editequipModal").modal('hide');
});


//获取设备数据
function bind_equip(equId){
	$("#equ_id").val(equId);
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_get_unbinding_dev","params":{"equ_id":"'+equId+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
			
		},
		success:function(data,status,xhr){
			jump_index(data);
			if(data.code!=100) return;
			var result=data.result;
			var arr=[];
			var html="";
			
			for(var i=0;i<result.typelist.length;i++){
				// if(result.typelist[i].typeCode=="176"||result.typelist[i].typeCode=="177") continue;
				arr.push('<div class="panel-default">');
				arr.push('<div class="panel-heading">');
				arr.push('<span>'+result.typelist[i].typeName+'</span>');
				arr.push('</div>');
				// arr.push('<div class="panel-body">');
				arr.push('<ul class="list-group">');

				for(var j=0;j<result.oneranklist.length;j++){
					if(result.oneranklist[j].onerankdevType==result.typelist[i].typeCode){
						arr.push('<li class="list-group-item">');
						for(var k=0;k<result.gatewayList.length;k++){
							if(result.oneranklist[j].gatewayId==result.gatewayList[k].gwId){
								arr.push('<input id="'+result.oneranklist[j].devId+'" type="radio" name="equtype" value="'+result.oneranklist[j].onerankdevDevSn+'-'+result.oneranklist[j].gatewayId+'"><span>网关名称：'+result.gatewayList[k].gwName+'，设备ID：'+result.oneranklist[j].onerankdevTerminId+'，设备SN：'+result.oneranklist[j].onerankdevDevSn+'</span>');
							}
						}
						

						// arr.push('<button type="button" class="btnj btn btn-default del" onclick="delbind('+space_id+','+result.oneranklist[j].onerankdevSn+')">解绑</button>');
						// arr.push('<button type="button" class="btnj btn btn-default del" onclick="delbind('+space_id+',\''+result.oneranklist[j].devId+'\',this)">解绑</button>');
						arr.push('</li>');
					}
				}
				
				arr.push('</ul>');
				// arr.push('</div>');
				arr.push('</div>');
			}
			html=arr.join("");
			$("#bindlist").html(html);
			if(Boolean(result.list[0])){
				$("#"+result.list[0].devId).prop("checked",true);
			}
			

			// equip_list(true,search.pageNumber);
			
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
	
}
//绑定设备
$("#bind_true").click(function(event) {
	var choose=$('input[name="equtype"]:checked').val().split("-");
	console.log(choose);
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_binding_dev","params":{"equ_id":"'+$("#equ_id").val()+'","onerankdevSn":"'+choose[0]+'","gatewayId":"'+choose[1]+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
			
		},
		success:function(data,status,xhr){
			jump_index(data);
			if(data.code!=100) return;
			var result=data.result;

			equip_list(true,search.pageNumber);
			
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});

	$("#bindequipModal").modal('hide');
});

//解绑设备
function unbind_equip(equId,onerankdevId){
	if(!Boolean(onerankdevId)||onerankdevId=="null") return parent.layer.alert("未绑定设备，无需解绑");
	

	parent.layer.confirm('您确定解绑该设备？', 
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
		    	params:'{"api_name":"web_relieve_binding_dev","params":{"equ_id":"'+equId+'","onerankdevId":"'+onerankdevId+'"}}'
		    },
			contentType:"application/x-www-form-urlencoded;charset=utf-8", 
			beforeSend:function(xhr){
				// parent.modal_loading("正在获取数据！");
				
			},
			success:function(data,status,xhr){
				equip_list(true,search.pageNumber);
				
			},
			error: function (a, b, c) {
				// parent.modal_loading("error");
			 	console.log(c);
			 }
			 
		});
	});


}

/*位置总览*/
$("#allLocal").click(function(event) {
	addMapOverlay_equip(map2);

});


function addMapOverlay_equip(map) {
    $.ajax({
        url :  get_api_url(),
        type : "POST",
        dataType : "json",
        data: {
	    	params:'{"api_name":"get_equipment_list","params":{"pageNumber":"0","pageSize":"0","zone_id":"'+search.zoneId+'"}}'
	    },
        contentType : "application/x-www-form-urlencoded;charset=utf-8",
        success : function(data) //data是返回数据处理后的结果 
        {

            if(data.code!=100) return;
            
            var markers = data.result.items;
            
            for (var index = 0; index < markers.length; index++) {

            	var type=markers[index].typeCode;
				
				var indexNum=0;

                var point = new BMap.Point(
                        markers[index].longitude,
                        markers[index].latitude);
                var marker = new BMap.Marker(
                        point,
                        {
                            icon : new BMap.Icon(
                                    markers[index].webMapPicture?markers[index].webMapPicture:"../../images/mark.png",
                                    new BMap.Size(26, 36),
                                    {
                                        imageOffset : new BMap.Size(0,0)
                                    })
                        });
                var label = new BMap.Label(markers[index].deviceName, {
                    offset : new BMap.Size(25, 5)
                });
                var opts = {
                    width : 200,
                    // title : markers[index].deviceName,
                    title : markers[index].typeName ? markers[index].typeName :"未绑设备",
                    enableMessage : false
                };
                var infoWindow = new BMap.InfoWindow(markers[index].address, opts);
                // marker.setLabel(label);
                marker.setZIndex(indexNum);//覆盖物分类
                addClickHandler(marker, infoWindow,markers[index].deviceName,markers[index].equId);
                map.addOverlay(marker);

            };
        }
    });

}

/*显示目标设备(覆盖物)*/
function chkMap(val,type) {
	console.log(val)
	var alloverlays=map2.getOverlays();
	for(var i=0;i<alloverlays.length;i++){
		if(alloverlays[i].zIndex||alloverlays[i].zIndex==0){
			if(val){
				if(type==alloverlays[i].zIndex){
					alloverlays[i].show();
				}else if(type==100){
					alloverlays[i].show();
				}
				
			}else{
				if(type==alloverlays[i].zIndex){
					alloverlays[i].hide();
				}else if(type==100){
					alloverlays[i].hide();
				}
			}
		}
	}
}

