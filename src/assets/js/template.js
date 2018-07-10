/*
* @Author: Administrator
* @Date:   2018-03-20 09:32:30
* @Last Modified by:   Administrator
* @Last Modified time: 2018-05-03 15:58:23
*/
var userId=sessionStorage.getItem("user_id");
var locationSearch=location.search;
// console.log(locationSearch);
//获取区域列表
var search={
	pageNumber:"1",
	pageSize:"10",
	name:"",
	typeCode:"",
	zoneId:""
}; 

//添加设备（show/hide）
if(locationSearch.indexOf("scenId")==-1){
	//只有typeCode
	$("#addequip").hide();
	search.typeCode=locationSearch.split("=")[1];

}else{
	//typeCode和zoneId都有
	$("#addequip").show();
	search.typeCode=locationSearch.split("&")[0].split("=")[1];
	search.zoneId=locationSearch.split("&")[1].split("=")[1];
}

//列表渲染
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

				/*if(list[i].runningStatus==0){
					if(list[i].devStatus==""){
						arr.push('<td><img src="../../images/senstatus/sun_'+list[i].runningStatus+'1.png" alt="" width="32"></td>');
					}else{
						arr.push('<td><img src="../../images/senstatus/sun_'+list[i].runningStatus+list[i].devStatus+'.png" alt="" width="32"></td>');
					}
					
				}else{
					arr.push('<td><img src="../../images/senstatus/sun_1.png" alt="" width="32"></td>');
				}*/
	            
	            


				if(list[i].runningStatus==0){
					if(list[i].devStatus==""){
						arr.push('<td><div class="type_'+list[i].runningStatus+'1"><img src="'+(list[i].webStatePicture ? list[i].webStatePicture : "../../images/senstatus/blank.png")+'" alt="" width="32"></div></td>');
					}else{
						arr.push('<td><div class="type_'+list[i].runningStatus+list[i].devStatus+'"><img src="'+(list[i].webStatePicture ? list[i].webStatePicture : "../../images/senstatus/blank.png")+'" alt="" width="32"></div></td>');
					}
					
				}else{
					arr.push('<td><div class="type_1"><img src="'+(list[i].webStatePicture ? list[i].webStatePicture : "../../images/senstatus/blank.png")+'" alt="" width="32"></div></td>');
				}


	            // arr.push('<td><div class="type_00"><img src="../../images/senstatus/dioxide.png" alt="" width="32"></div></td>');   

				arr.push('<td>'+list[i].deviceName+'</td>');
				arr.push('<td>'+list[i].typeName+'</td>');
				arr.push('<td>'+list[i].onerankdevDevSn+'</td>');
				arr.push('<td>'+list[i].createdDate+'</td>');

				if(list[i].controlClass==1){
					arr.push('<td>'+(list[i].devValue=='0.0'||list[i].devValue=='0'?'开':'关')+'</td>');
				}else{
					if(list[i].typeCode=="173"){
						arr.push('<td>'+(list[i].devValue=='1.0'?'正常':'异常')+'</td>');
					}else if(list[i].typeCode=="85"){
						arr.push('<td>'+(list[i].devValue=='1.0'?'有人':'无人')+'</td>');
					}else{
						var devValue=list[i].devValue.split(":")[1]
						arr.push('<td>'+(devValue?devValue:'')+'</td>');
					}
					
				}
				
				
				if(Boolean(list[i].associationNumber)){
					arr.push('<td>已关联</td>');
				}else{
					arr.push('<td>未关联</td>');
				}
				
				arr.push('<td>'+list[i].address+'</td>');
				var type=list[i].typeCode;
				var x="template_hisdata.html";
				
				//是否存在开关
				if(list[i].controlClass==1){
					if(list[i].devValue=="1"||list[i].devValue==""){
						arr.push('<td>');
						arr.push('<a title="" href="javascript:;" onclick="switch_dev(\''+list[i].gwSn+'\',\''+list[i].devValue+'\','+list[i].onerankdevTerminId+',this)"><span>开起</span></a>&nbsp;&nbsp;');
						arr.push('<a title="" href="#" data-target="#editdevModal" data-toggle="modal" onclick="edit_dev('+list[i].equId+','+list[i].gwId+')"><span>查看</span></a>&nbsp;&nbsp;');
						arr.push('<a title="" href="./'+x+'?typeCode='+list[i].typeCode+'&devSn='+list[i].onerankdevDevSn+'"><span>历史数据</span></a>&nbsp;&nbsp;');
						arr.push('<a title="" href="javascript:;" onclick="del_dev('+list[i].equId+')" class=""><span>删除</span></a>');
						arr.push('</td>');
					}else if(list[i].devValue=="0"||list[i].devValue=="0.0"){
						arr.push('<td>');
						arr.push('<a title="" href="javascript:;" onclick="switch_dev(\''+list[i].gwSn+'\',\''+list[i].devValue+'\','+list[i].onerankdevTerminId+',this)"><span>关闭</span></a>&nbsp;&nbsp;');
						arr.push('<a title="" href="#" data-target="#editdevModal" data-toggle="modal" onclick="edit_dev('+list[i].equId+','+list[i].gwId+')"><span>查看</span></a>&nbsp;&nbsp;');
						arr.push('<a title="" href="./'+x+'?typeCode='+list[i].typeCode+'&devSn='+list[i].onerankdevDevSn+'"><span>历史数据</span></a>&nbsp;&nbsp;');
						arr.push('<a title="" href="javascript:;" onclick="del_dev('+list[i].equId+')" class=""><span>删除</span></a>');
						arr.push('</td>');
					}
				}else{
					arr.push('<td>');
					arr.push('<a title="" href="#" data-target="#editdevModal" data-toggle="modal" onclick="edit_dev('+list[i].equId+','+list[i].gwId+')"><span>查看</span></a>&nbsp;&nbsp;');
					arr.push('<a title="" href="./'+x+'?typeCode='+list[i].typeCode+'&devSn='+list[i].onerankdevDevSn+'"><span>历史数据</span></a>&nbsp;&nbsp;');
					arr.push('<a title="" href="javascript:;" onclick="del_dev('+list[i].equId+')" class=""><span>删除</span></a>');
					arr.push('</td>');
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
	if(!userId) window.parent.location.href="../../index.html";
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
			params:'{"api_name":"getOnerankdevDetail","params":{"equ_id":"'+devId+'","gw_id":"'+gwId+'","user_id":"'+userId+'"}}'
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

			if(results.controlClass==1){
				$("#devsVal").html('<span class="fontcolor">设备数据：'+(results.list[0]=='1'||results.list[0]==''?'关':'开')+'</span>');
			}else{
				if(results.typeCode=="173"){
					$("#devsVal").html('<span class="fontcolor">设备数据：'+(results.list[0]=='1.0'?'正常':'异常')+'</span>');
				}else if(results.typeCode=="85"){
					$("#devsVal").html('<span class="fontcolor">设备数据：'+(results.list[0]=='1.0'?'有人':'无人')+'</span>');
				}else{
					var devshtmls="";
					var devsValArrs=[];
					var addCounts=results.list.length%4==0?4:3;
					for(var n=0; n<results.list.length;n+=addCounts){
						devsValArrs.push(results.list.slice(n,n+addCounts));
					}
					var strArrs=[];
					for(var m=0;m<devsValArrs.length;m++){
						var strDatas='';
						for(var k=0;k<devsValArrs[m].length;k++){
							var devsValkeys=devsValArrs[m][k].split(":");
							// console.log(devsValkeys)
							var devsValhtmls='<span>'+devsValkeys[0]+'：</span><span class="fontcolor">'+devsValkeys[1]+'</span>';

							strDatas+=devsValhtmls+"&nbsp;&nbsp;&nbsp;"
						}
						strArrs.push('<div style="line-height:24px;">'+strDatas+'</div>');
					}
					devshtmls=strArrs.join("");
					
					$("#devsVal").html(devshtmls);
				}
			}

            if(Boolean(result)&&Boolean(result.onerankdevDevSn)){
				$("#deve_type").text(result.typeName);
				$("#deve_name").text(result.deviceName);
				$("#snid").text(result.onerankdevDevSn);
				$("#deve_address").text(result.address);

				if(result.controlClass==1){
					$("#devVal").html('<span class="fontcolor">设备数据：'+(result.list[0]=='1'||result.list[0]==''?'关':'开')+'</span>');
				}else{
					if(result.typeCode=="173"){
						$("#devVal").html('<span class="fontcolor">设备数据：'+(result.list[0]=='1.0'?'正常':'异常')+'</span>');
					}else if(result.typeCode=="85"){
						$("#devVal").html('<span class="fontcolor">设备数据：'+(result.list[0]=='1.0'?'有人':'无人')+'</span>');
					}else{
						var devshtml="";
						var devsValArr=[];
						var addCount=result.list.length%4==0?4:3;
						for(var n=0; n<result.list.length;n+=addCount){
							devsValArr.push(result.list.slice(n,n+addCount));
						}
						var strArr=[];
						for(var m=0;m<devsValArr.length;m++){
							var strData='';
							for(var k=0;k<devsValArr[m].length;k++){
								var devsValkey=devsValArr[m][k].split(":");
								var devsValhtml='<span>'+devsValkey[0]+'：</span><span class="fontcolor">'+devsValkey[1]+'</span>';

								strData+=devsValhtml+"&nbsp;&nbsp;&nbsp;"
							}
							strArr.push('<div style="line-height:24px;">'+strData+'</div>');
						}
						devshtml=strArr.join("");
						// $("#devVal").html('设备数据：<span class="fontcolor">weewgwege'+result.list+'</span>');
						$("#devVal").html(devshtml);
					}
				}


				

        	}else{
            	$("#deve_type").text("");
				$("#deve_name").text("");
				$("#snid").text("");
				$("#deve_address").text("");
				$("#devVal").html("");
            }
			
			addMapOverlayl(results.latitude, results.longitude, map, results.webMapPicture);
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


//删除设备
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









//开启关闭(变量控制)
function switch_dev(gwsn,val,devId,that){
	// console.log(gwsn,val);
	var stateCode=val;
	if(stateCode=="0"){
		stateCode="1";
	}else{
		stateCode="0";
	};
	$.ajax({
		url:get_api_urlo(),
		async:true,
		type:"post",
		dataType:"json",
		data:{
			params:'{"api_name":"express_order","params":{"gateway":"'+gwsn+'","value":"'+stateCode+'","dev_id":"'+devId+'"}}'
		},
		
		contentType:"application/x-www-form-urlencoded;charset=utf-8",
		success:function(data,status,xhr){
			jump_index(data);
			if(data.code!=100) return parent.layer.msg(data.msg, { time: 1000});
			if(stateCode==1){
				parent.layer.msg('已关闭', { time: 1000});
			}else if(stateCode==0){
				parent.layer.msg('已开启', { time: 1000});
			}
			dev_list(true,search.pageNumber);
		},
		error: function (a, b, c) {
		 	console.log(a);
		}
		 
	});
}


/*存在场景zoneId的情况下*/
//添加设备
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

$('#addequipModal').on('hidden.bs.modal', function (e) {
	$("#gatename").val("");
	$("#gateId").val("");
	$("#sn").val("");
	$("#equipadress").val("");
});



/*BMap*/
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
// addMapOverlay(map);

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


/*位置总览*/
$("#allLocal").click(function(event) {
	addMapOverlay(map2,search.typeCode,search.zoneId);
});