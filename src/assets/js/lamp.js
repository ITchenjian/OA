/*
* @Author: Administrator
* @Date:   2017-10-25 14:33:10
* @Last Modified by:   Administrator
* @Last Modified time: 2018-01-31 15:25:47
*/
$('#editdevModal').on('hidden.bs.modal', function (e) {
  	$("#editdev_form").Validform().resetForm(); 
 	$("#editdevModal .Validform_checktip").html("");
 	map.clearOverlays();
});

$('#localModal').on('hidden.bs.modal', function (e) {
 	map2.clearOverlays();
});

var map = new BMap.Map("devMap"); 
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
            $("#deve_address").val(result.address);
            $("#point_lng").val(e.point.lng);
            $("#point_lat").val(e.point.lat);
        }

    });
});

//获取区域列表
var search={
	pageNumber:"1",
	pageSize:"10",
	typeCode:"178",
	zoneId:"",
	name:""
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

//获取列表
function dev_list(pag,pageN){
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"getOnerankdev","params":{"page_num":"'+pageN+'","page_limit":"'+search.pageSize+'","name":"'+search.name+'","type_code":"'+search.typeCode+'","zone_id":"'+search.zoneId+'","type":"1"}}'
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
				dev_page(data.result.page.rowsCount,data.result.page.pageSize);
			}
			var list = data.result.page.items;
			var html="";
			var arr=[];
			for(var i=0;i<list.length;i++){
				arr.push('<tr>');
				if(list[i].runningStatus==0){
                  	if(list[i].devStatus==""){
                  		arr.push('<td><img src="../../images/senstatus/lamp_'+list[i].runningStatus+'1.png" alt="" width="32"></td>');
                  	}else{
                  		arr.push('<td><img src="../../images/senstatus/lamp_'+list[i].runningStatus+list[i].devStatus+'.png" alt="" width="32"></td>');
                  	}
                  	
                }else{
                  	arr.push('<td><img src="../../images/senstatus/lamp_1.png" alt="" width="32"></td>');
                }

                arr.push('<td>'+list[i].deviceName+'</td>');
				arr.push('<td>'+list[i].typeName+'</td>');
				arr.push('<td>'+list[i].onerankdevDevSn+'</td>');
				arr.push('<td>'+list[i].createdDate+'</td>');
				
				arr.push('<td>'+list[i].devValue+'</td>');

				if(list[i].devStatus==1){
					arr.push('<td>开启</td>');
				}else{
					arr.push('<td>关闭</td>');
				}

				if(Boolean(list[i].associationNumber)){
					arr.push('<td>已关联</td>');
				}else{
					arr.push('<td>未关联</td>');
				}
				arr.push('<td>'+list[i].address+'</td>');
				var type=209;
				switch (type)
				{
					case 209:
					  x="his_lamp.html";
					  break;
				}
				// arr.push('<td><a title="历史数据" href="./'+x+'?wd='+list[i].equId+'"><span class="glyphicon glyphicon-stats" aria-hidden="true"></span></a>&nbsp;&nbsp;<a title="位置信息" href="#" data-target="#editdevModal" data-toggle="modal" onclick="edit_dev('+list[i].equId+')"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></a>&nbsp;&nbsp;<a title="删除" href="javascript:;" onclick="del_dev('+list[i].equId+')" class=""><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a></td>');
				if(list[i].devStatus==1){
					arr.push('<td><a title="" href="javascript:;" onclick="switch_dev(\''+list[i].gwSn+'\',\''+list[i].devStatus+'\','+list[i].onerankdevTerminId+',this)"><span>关闭</span></a>&nbsp;&nbsp;<a title="" href="#" data-target="#editdevModal" data-toggle="modal" onclick="edit_dev('+list[i].equId+','+list[i].gwId+')"><span>查看</span></a>&nbsp;&nbsp;<a title="" href="./'+x+'?wd='+list[i].onerankdevDevSn+'"><span>历史数据</span></a>&nbsp;&nbsp;<a title="" href="javascript:;" onclick="del_dev('+list[i].equId+')" class=""><span>删除</span></a></td>');	
				}else{
					arr.push('<td><a title="" href="javascript:;" onclick="switch_dev(\''+list[i].gwSn+'\',\''+list[i].devStatus+'\','+list[i].onerankdevTerminId+',this)"><span>开起</span></a>&nbsp;&nbsp;<a title="" href="#" data-target="#editdevModal" data-toggle="modal" onclick="edit_dev('+list[i].equId+','+list[i].gwId+')"><span>查看</span></a>&nbsp;&nbsp;<a title="" href="./'+x+'?wd='+list[i].onerankdevDevSn+'"><span>历史数据</span></a>&nbsp;&nbsp;<a title="" href="javascript:;" onclick="del_dev('+list[i].equId+')" class=""><span>删除</span></a></td>');
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


//获取详情数据
function edit_dev(devId,gwId){
	$("#dev_id").val(devId);
	if(devId=="") return;
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"getOnerankdevDetail","params":{"equ_id":"'+devId+'","gw_id":"'+gwId+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var results=data.result.maps;
			var result=data.result.map;
			$("#deves_type").text(results.typeName);
			$("#deves_name").text(results.deviceName);
			// $("#devsVal").text(results.devValue);
			$("#sns").text(results.onerankdevDevSn);
			$("#deves_address").text(results.address);

			switch (results.typeCode)
            {
                case "178":
                  $("#devsVal").html('电流：<span class="fontcolor">'+results.devValue+'A</span>');
                  break;
            }


            if(Boolean(result.onerankdevDevSn)){
				$("#deve_type").text(result.typeName);
				$("#deve_name").text(result.deviceName);
				$("#snid").text(result.onerankdevDevSn);
				$("#deve_address").text(result.address);

				switch (result.typeCode)
	            {
	            	case "178":
	                  $("#devVal").html('电流：<span class="fontcolor">'+result.devValue+'A</span>');
	                  break;
	            	case "209":
	                  $("#devVal").html('电流：<span class="fontcolor">'+result.devValue+'A</span>');
	                  break;
	                case "161":
	                  $("#devVal").html('辐射：<span class="fontcolor">'+result.devValue+'w/m2</span>');
	                  break;
	                case "162":
	                  $("#devVal").html('电导率：<span class="fontcolor">'+result.devValue+'ms/cm</span>');
	                  break;
	                case "163":
	                  $("#devVal").html('温度：<span class="fontcolor">'+result.devValue+'℃</span>');
	                  break;
	                case "164":
	                  $("#devVal").html('湿度：<span class="fontcolor">'+result.devValue+'%</span>');
	                  break;
	                case "165":
	                  $("#devVal").html('PH值：<span class="fontcolor">'+result.devValue+'Ph</span>');
	                  break;
	                case "166":
	                  $("#devVal").html('照度：<span class="fontcolor">'+result.devValue+'lx</span>');
	                  break;
	                case "171":
	                  $("#devVal").html('光照：<span class="fontcolor">'+result.devValue+'lx</span>');
	                  break;
	                case "167":
	                  $("#devVal").html('温度：<span class="fontcolor">'+result.devValue+'℃</span>');
	                  break;
	                case "168":
	                  $("#devVal").html('湿度：<span class="fontcolor">'+result.devValue+'%</span>');
	                  break;
	                case "169":
	                  $("#devVal").html('压力：<span class="fontcolor">'+result.devValue+'hP</span>');
	                  break;
	                case "173":
	                  $("#devVal").html('状态：<span class="fontcolor">'+result.devValue+'</span>');
	                  break;
	                case "170":
	                  $("#devVal").html('状态：<span class="fontcolor">'+result.devValue+'</span>');
	                  break;
	                case "174":
	                  $("#devVal").html('状态：<span class="fontcolor">'+result.devValue+'</span>');
	                  break;
	                case "175":
	                  $("#devVal").html('流量：<span class="fontcolor">'+result.devValue+'m³/h</span>');
	                  break;
	            }
            }else{
            	$("#deve_type").text("");
				$("#deve_name").text("");
				$("#snid").text("");
				$("#deve_address").text("");
				$("#devVal").html("");
            }
			addMapOverlayl(results.latitude, results.longitude, map, results.typeCode);
			setTimeout(function(){
				map.panTo(new BMap.Point(results.longitude,results.latitude),{noAnimation:true});
			}, 200);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
	
}

//删除路灯+传感器等设备
function del_dev(equId){
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
				dev_list(true,search.pageNumber);
				
			},
			error: function (a, b, c) {
				// parent.modal_loading("error");
			 	console.log(c);
			 }
			 
		});
	});
	
	
}

/*添加设备*/
$("#addequip").click(function(event) {
	add_equip();
});
function add_equip(){
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_getDevTypeByOnerankdev","params":{"devType":"'+search.typeCode+'","sceneId":"'+search.zoneId+'","type":"1"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;

			var list = data.result;
			var html='<option value="">请选择</option>';
			var arr=[];
			for(var i=0;i<list.length;i++){
				arr.push('<option value="'+list[i].equId+'">'+list[i].deviceName+'</option>');
				
			}
			html+=arr.join("");
			$("#equipname").html(html);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
}
$("#equipname").change(function(event) {
	if(this.value==""){
		$("#gatename").val("");
		$("#gateId").val("");
		$("#sn").val("");
		$("#equipadress").val("");
		return;
	};
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_getEquipmentDetail","params":{"equ_id":"'+$("#equipname").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;

			var list = data.result;
			$("#gatename").val(list.gwName);
			$("#gateId").val(list.gwId);
			$("#sn").val(list.onerankdevSn);
			$("#equipadress").val(list.address);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});

$("#add_true").click(function(event) {
	// if(!addmaginfo) return;
	if($("#equipname").val()=="") return;
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_addEquAndScene","params":{"scene_id":"'+search.zoneId+'","equ_id":"'+$("#equipname").val()+'","gatewayId":"'+$("#gateId").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			dev_list(true,search.pageNumber);

		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
	// addmaginfo=false;
	$("#addequipModal").modal('hide');
});


//开启关闭
function switch_dev(gwsn,val,devId,that){
	// console.log(gwsn,val);
	var stateCode=val;
	if(stateCode==1){
		stateCode="2";
	}else{
		stateCode="1";
	};
	$.ajax({
		url:get_api_urlo(),
		async:true,
		type:"post",
		dataType:"json",
		data:{
			params:'{"api_name":"control_street_lamp","params":{"gateway":"'+gwsn+'","type":"'+stateCode+'","dev_id":"'+devId+'"}}'
		},
		
		contentType:"application/x-www-form-urlencoded;charset=utf-8",
		success:function(data,status,xhr){
			jump_index(data);
			if(data.code!=100) return parent.layer.msg(data.msg, { time: 1000});
			if(stateCode==2){
				parent.layer.msg('已关闭', { time: 1000});
			}else if(stateCode==1){
				parent.layer.msg('已开启', { time: 1000});
			}
			dev_list(true,search.pageNumber);
		},
		error: function (a, b, c) {
		 	console.log(a);
		}
		 
	});
}


/*位置总览*/
$("#allLocal").click(function(event) {
	addMapOverlay_watch(map2);
});



function addMapOverlay_watch(map) {
    $.ajax({
        url :  get_api_urle(),
        type : "POST",
        dataType : "json",
        data: {
	    	params:'{"api_name":"getOnerankdev","params":{"page_num":"0","page_limit":"0","type_code":"'+search.typeCode+'","zone_id":"'+search.zoneId+'","type":"1"}}'
	    },
        contentType : "application/x-www-form-urlencoded;charset=utf-8",
        success : function(data) //data是返回数据处理后的结果 
        {

            if(data.code!=100) return;
            
            var markers = data.result.page.items;
            
            for (var index = 0; index < markers.length; index++) {
                var point = new BMap.Point(
                        markers[index].longitude,
                        markers[index].latitude);
                var marker = new BMap.Marker(
                        point,
                        {
                            icon : new BMap.Icon(
                                    "../../images/icon.png",
                                    new BMap.Size(26, 36),
                                    {
                                        imageOffset : new BMap.Size(-702,0)
                                    })
                        });
                var label = new BMap.Label(markers[index].deviceName, {
                    offset : new BMap.Size(25, 5)
                });
                var opts = {
                    width : 200,
                    title : markers[index].deviceName,
                    enableMessage : false
                };
                var infoWindow = new BMap.InfoWindow(markers[index].address, opts);
                // marker.setLabel(label);
                
                addClickHandler(marker, infoWindow,markers[index].deviceName,markers[index].equId);
                console.log(marker);
                map.addOverlay(marker);

            };
        }
    });

}
