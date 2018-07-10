/*
* @Author: Administrator
* @Date:   2017-06-06 15:24:35
* @Last Modified by:   Administrator
* @Last Modified time: 2018-01-02 15:28:35
*/

// 'use strict';
jQuery.support.cors = true;//支持跨域


$('#addgateModal').on('hidden.bs.modal', function (e) {
  	$("#addgate_form").Validform().resetForm(); 
 	$("#addgateModal .Validform_checktip").html("");
})

/*添加网关*/
/*$("#addgateway").click(function(event) {
	$.ajax({
		url :  get_api_urle(),
		async:true,
		type : "POST",
		dataType : "json",
		data: {
	    	params:'{"api_name":"get_AreaLevel_List"}'
	    },
		contentType : "application/x-www-form-urlencoded;charset=utf-8",
		success : function(data) //data是返回数据处理后的结果 
		{
			jump_main(data);
			if(data.code!=100) return;
			var allList = data.result;
			
			var html="";
			for(var i=0;i<allList.length;i++){
				html+='<option class="list-group-item" value="'+allList[i].zoneId+'">'+allList[i].zoneName+'</option>';
			}
			$("#gatearea").html(html);
		}
	});
});*/
$("#add_true").click(function(){
	if(!gateinfo) return;
	$.ajax({
		url :  get_api_url(),
		async:true,
		type : "POST",
		dataType : "json",
		data: {
	    	params:'{"api_name":"web_add_gateWay","params":{"sn":"'+$("#sn").val()+'","gateWay_name":"'+$("#gatename").val()+'"}}'
	    },
		contentType : "application/x-www-form-urlencoded;charset=utf-8",
		success : function(data) //data是返回数据处理后的结果 
		{
			jump_index(data);
			if(data.code!=100) return parent.layer.msg('添加失败', { time: 1000});
			parent.layer.msg('添加成功', { time: 1000});
			init_tree();
		}
	});

	gateinfo=false;
	$("#addgateModal").modal("hide");

});

/*删除网关*/
$("#removegateway").click(function(){
	$.ajax({
		url :  get_api_url(),
		async:true,
		type : "POST",
		dataType : "json",
		data: {
	    	params:'{"api_name":"web_get_devmanege"}'
	    },
		contentType : "application/x-www-form-urlencoded;charset=utf-8",
		success : function(data) //data是返回数据处理后的结果 
		{
			jump_main(data);
			if(data.code!=100) return;
			var allList = data.result;
			
			var html="";
			for(var i=0;i<allList.length;i++){
				html+='<option class="list-group-item" value="'+allList[i].gateway.gwId+'">'+allList[i].gateway.gwName+'</option>';
			}
			$("#gate_name").html(html);
		}
	});

});

$("#del_true").click(function(){
	$.ajax({
		url :  get_api_url(),
		async:true,
		type : "POST",
		dataType : "json",
		data: {
	    	params:'{"api_name":"web_del_gateWay","params":{"gatewId":"'+$("#gate_name").val()+'"}}'
	    },
		contentType : "application/x-www-form-urlencoded;charset=utf-8",
		success : function(data) //data是返回数据处理后的结果 
		{
			jump_index(data);
			if(data.code!=100) return parent.layer.msg('删除失败', { time: 1000});
			parent.layer.msg('删除成功', { time: 1000});
			init_tree();
		}
	});
	$("#delgateModal").modal("hide");

});

/*修改网关信息*/
$("#g_edit").click(function(){
	if ($("#gate_id").val()=="") return parent.layer.alert('请先选择网关');
	$.ajax({
		url :  get_api_url(),
		async:true,
		type : "POST",
		dataType : "json",
		data: {
	    	params:'{"api_name":"web_upd_gatew_msg","params":{"gatew_id":"'+$("#gate_id").val()+'","gateWay_name":"'+$("#g_name").val()+'","gateWay_curPosition":"'+$("#g_local").val()+'","phonenum":"'+$("#phoneNum").val()+'","repairPhone":"'+$("#repairPhone").val()+'","severIpPort":"'+$("#severIpPort").val()+'"}}'
	    },
		contentType : "application/x-www-form-urlencoded;charset=utf-8",
		success : function(data) //data是返回数据处理后的结果 
		{
			jump_index(data);
			if(data.code!=100) return parent.layer.msg('修改失败', { time: 1000});
			init_tree();
		}
	});

});

/*修改设备信息-dg*/
$("#d_edit").click(function(){
	$.ajax({
		url :  get_api_url(),
		async:true,
		type : "POST",
		dataType : "json",
		data: {
	    	params:'{"api_name":"web_upd_onerankdev_msg","params":{"devId":"'+$("#dev_id").val()+'","onerankdevName":"'+$("#d_name").val()+'","curposition":"'+$("#d_local").val()+'"}}'
	    },
		contentType : "application/x-www-form-urlencoded;charset=utf-8",
		success : function(data) //data是返回数据处理后的结果 
		{
			jump_index(data);
			if(data.code!=100) return parent.layer.msg('修改失败', { time: 1000});
			init_tree();
		}
	});

});

/*添加设备*/
$("#addequip").click(function(){
	if ($("#g_sn").val()=="") return parent.layer.alert('请先选择设备');
	$.ajax({
		url :  get_api_urly(),
		async:true,
		type : "POST",
		dataType : "json",
		data: {
	    	params:'{"api_name":"query_parimary_attribute","params":{"gateway":"'+$("#g_sn").val()+'"}}'
	    },
		contentType : "application/x-www-form-urlencoded;charset=utf-8",
		success : function(data) //data是返回数据处理后的结果 
		{
			jump_index(data);
			if(data.code!=100) return parent.layer.msg('添加失败', { time: 1000});
			// init_tree();
		}
	});

});

/*添加摄像头*/
var add_camera=$("#addcamera",parent.document);
$("#addcamera").click(function(){
	if ($("#gate_id").val()=="") return alert("请先选择网关！");
	add_camera.click();/*触发主页控件*/

});

$("#addcamera_suc").click(function(){
	var data=parent.addcamera_form;
	$.ajax({
		url :  get_api_url(),
		async:true,
		type : "POST",
		dataType : "json",
		data: {
	    	params:'{"api_name":"web_add_camera","params":{"camera_name":"'+data.name+'","camera_num":"'+data.num+'","gatew_id":"'+$("#gate_id").val()+'"}}'
	    },
		contentType : "application/x-www-form-urlencoded;charset=utf-8",
		success : function(data) //data是返回数据处理后的结果 
		{
			
			jump_index(data);
			if(data.code!=100) return;
			init_tree();
		}
	});

});

/*删除摄像头*/
var del_camera=$("#delcamera",parent.document);
$("#delcamera").click(function(){
	parent.delcamera_form.gate_id=$("#gate_id").val();
	if ($("#gate_id").val()=="") return alert("请先选择网关！");
	del_camera.click();/*触发主页控件*/

});

$("#delcamera_suc").click(function(){
	var data=parent.delcamera_form;
	
	$.ajax({
		url :  get_api_url(),
		async:true,
		type : "POST",
		dataType : "json",
		data: {
	    	params:'{"api_name":"web_del_camera","params":{"camera_num":"'+data.devid+'"}}'
	    },
		contentType : "application/x-www-form-urlencoded;charset=utf-8",
		success : function(data) //data是返回数据处理后的结果 
		{
			
			jump_index(data);
			if(data.code!=100) return;
			init_tree();
		}
	});

});





/*请求side_jstree数据*/
init_tree();
function init_tree(){
	$.ajax({
		url:get_api_url(),
		async:true,
		type:"post",
		dataType:"json",
		data:{
			params:'{"api_name":"web_get_devmanege"}'
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
			var arr=[];
			var html="";
			arr.push('<div id="jstree">');
			arr.push('<ul>');
			for(var i=0;i<result.length;i++){
				arr.push('<li data-id='+result[i].gateway.gwId+'>'+result[i].gateway.gwName);
				arr.push('<ul>');
					for(var j=0;j<result[i].typelist.length;j++){
						var item=result[i].typelist[j].typeCode;
						var obj=result[i].onelist;
						console.log(filter(item,obj))
						if(filter(item,obj)){
							arr.push("<li data-id="+result[i].typelist[j].id+">"+result[i].typelist[j].typeName);
							arr.push("<ul>");
								for(var k=0;k<result[i].onelist.length;k++){
									if(result[i].onelist[k].onerankdevType==result[i].typelist[j].typeCode){
										arr.push('<li data-id='+result[i].onelist[k].devId+'>'+result[i].onelist[k].onerankdevTerminId+'</li>')
									}
								}	
							arr.push("</ul>");
							arr.push("</li>");
						}
					}
				arr.push('</ul>');
				arr.push('</li>');
			}
			arr.push('</ul>');
			arr.push('</div>');

			html=arr.join("");
			$("#equip_jstree").html(html);

			jstree($("#jstree"));

		},
		error: function (a, b, c) {
		 	// parent.modal_loading("error");
		}
		 
	});
}


/*初始化jstree+获取网关及设备信息*/
// 初始化jstree
function jstree(jstr){
	jstr.jstree();   
	jstr.on("select_node.jstree", function (e, data) {
		
		var selId=$("#"+data.selected[0]).attr("data-id");
		var aria_level=$("#"+data.selected[0]).attr("aria-level");
		console.log(aria_level);

		if(aria_level=="1"){
			$("#title").text("网关设备信息");
			$("#gatew").show();
			$("#dev").hide();
			$.ajax({
				url:get_api_url(),
				async:true,
				type:"post",
				dataType:"json",
				data:{
					params:'{"api_name":"web_get_devgatewaymsg","params":{"GwId":"'+selId+'"}}'
				},

				contentType:"application/x-www-form-urlencoded;charset=utf-8", 
				error: function (a, b, c) {
				 	console.log(a);
				 },
				success:function(data,status,xhr){
					jump_index(data);
					if(data.code!=100) return;
					var result=data.result.devGateway;
					$("#g_name").val(result.gwName);
					$("#g_sn").val(result.gwSn);
					$("#g_ver").val(result.gwVersion);
					$("#g_date").val(result.createdDate);
					$("#g_eqnum").val(result.gwDevnumber);
					$("#g_local").val(result.gwCruposition);
					$("#g_freq").val(result.gwCurfreq);
					$("#phoneNum").val(result.phoneNum);
					$("#repairPhone").val(result.repairPhone);
					$("#severIpPort").val(result.severIpPort);
					$("#g_parking").val(data.result.zoneName);
					if(data.result.isOn=="false"){
						$("#ison").val("离线");
					}else{
						$("#ison").val("在线");
					}
					
					$("#gate_id").val(result.gwId);	//隐藏
					
				}
				 
			});

		}else if(aria_level=="3"){
			$("#title").text("一级终端设备信息");
			$("#gatew").hide();
			$("#dev").show();

			$.ajax({
				url:get_api_url(),
				async:true,
				type:"post",
				dataType:"json",
				data:{
					params:'{"api_name":"web_get_onerankmsg","params":{"devId":"'+selId+'"}}'
				},

				contentType:"application/x-www-form-urlencoded;charset=utf-8", 
				error: function (a, b, c) {
				 	console.log(a);
				 },
				success:function(data,status,xhr){
					jump_index(data);
					if(data.code!=100) return;
					var result=data.result.onerankdev;
					var resultL=data.result.sysDictionaryList;
					if(Boolean(result.onerankdevName)){
						$("#d_name").val(result.onerankdevName);
					}
					$("#d_sn").val(result.onerankdevDevSn);
					$("#d_id").val(result.onerankdevTerminId);
					$("#d_date").val(result.createdDate);
					for(var i=0;i<resultL.length;i++){
						if(result.onerankdevState==resultL[i].id){
							$("#d_state").val(resultL[i].errName);
						}
					}
					
					$("#d_type").val(result.typeName);

					if(data.result.status==1){
						$("#d_line").val("离线");
					}else{
						$("#d_line").val("在线");
					}

					$("#dev_id").val(result.devId);	//隐藏

				}
				 
			});
		}else{
			$("#title").text("一级终端设备信息");
		}


    	if(data.node.id !=1 ){ 
       	 	data.instance.toggle_node(data.node);
    	}  
      
	}); 
}


function filter(item,arr){
	var f=false;
	for(var i=0;i<arr.length;i++){
		if(item==arr[i].onerankdevType){
			f=true;
		}
	}
	return f;
}


/*组网*/
//删除全部终端
$("#delall").click(function(){
	if ($("#g_sn").val()=="") return parent.layer.alert('请先选择设备');
	$.ajax({
		url:get_api_urly(),
		async:true,
		type:"post",
		dataType:"json",
		data:{
			params:'{"api_name":"delete_all_terminal","params":{"gateway":"'+$("#g_sn").val()+'","gatewaytime":"","looptime":"","sendmsg":""}}'
		},

		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		error: function (a, b, c) {
		 	console.log(a);
		 },
		success:function(data,status,xhr){
			jump_index(data);
			if(data.code!=100) return;
			var result=data.result;
		}
	})
})

//单终端组网
$("#single").click(function(){
	if ($("#g_sn").val()=="") return parent.layer.alert('请先选择网关');
	$.ajax({
		url:get_api_urly(),
		async:true,
		type:"post",
		dataType:"json",
		data:{
			params:'{"api_name":"single_terminal_networking","params":{"gateway":"'+$("#g_sn").val()+'","gatewaytime":"","looptime":"","sendmsg":""}}'
		},

		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		error: function (a, b, c) {
		 	console.log(a);
		 },
		success:function(data,status,xhr){
			jump_index(data);
			if(data.code!=100) return;
			var result=data.result;
		}
	})
})


//多终端组网
$("#many").click(function(){
	if ($("#g_sn").val()=="") return parent.layer.alert('请先选择网关');
	$.ajax({
		url:get_api_urly(),
		async:true,
		type:"post",
		dataType:"json",
		data:{
			params:'{"api_name":"many_terminal_networking","params":{"gateway":"'+$("#g_sn").val()+'","gatewaytime":"","looptime":"","sendmsg":""}}'
		},

		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		error: function (a, b, c) {
		 	console.log(a);
		 },
		success:function(data,status,xhr){
			jump_index(data);
			if(data.code!=100) return;
			var result=data.result;
		}
	})
})