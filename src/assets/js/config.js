/*
* @Author: Administrator
* @Date:   2018-01-23 10:51:02
* @Last Modified by:   Administrator
* @Last Modified time: 2018-02-01 17:45:21
*/
/*传感器类型*/
function getsentype(){
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
			var html='<option value="">请选择</option>';
			var arr=[];
			for(var i=0;i<list.length;i++){
				// if(list[i].typeCode=="176"||list[i].typeCode=="177") continue;
				arr.push('<option value="'+list[i].typeCode+'">'+list[i].typeName+'</option>');
			}
			html+=arr.join("");
			$("#sentype").html(html);

		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
};

function getdevid(){
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_getDevTypeByOnerankdev","params":{"devType":"'+$("#sentype").val()+'","type":"2"}}'
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

function getgwsn(){
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
			$("#equipid").val(list.onerankdevTerminId);
			$("#equipsn").val(list.onerankdevSn);
			$("#gwsn").val(list.gwSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
}

getsentype();
$("#sentype").change(function(event) {
	$("#equipid").val("");
	$("#equipsn").val("");
	$("#gwsn").val("");
	if(this.value==""){
		$("#equipname").html('<option value="">请选择</option>');
		return;
	};
	getdevid();
});

$("#equipname").change(function(event) {
	if(this.value==""){
		$("#equipid").val("");
		$("#equipsn").val("");
		$("#gwsn").val("");
		return;
	};
	getgwsn();
});


/*配置*/
//传感器状态
$("#searchsenstate").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"query_sensor_state","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});

//终端连接间隔
$("#searchinterval").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"query_terminal_conninterval","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});
$("#setinterval").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"update_terminal_conninterval","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'","time":"'+$("#interval").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});

//终端应答类型
$("#searchrestype").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"query_terminal_responsetype","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});
$("#setrestype").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	var typereport=$("#initiative").val()+","+$("#keydata").val()+","+$("#resetdata").val()+","+$("#statedata").val()+","+$("#errordata").val();
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"update_terminal_responsetype","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'","type":"'+$("#quick").val()+'","type1":"'+typereport+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});


//传感器特性
$("#searchsenfeature").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"query_sensor_characteristics","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});
$("#setsenfeature").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	var valreport=$("#repthre1").val()+","+$("#repthre2").val()+","+$("#repthre3").val()+","+$("#repthre4").val()+","+$("#repthre5").val()+","+$("#repthre6").val()+","+$("#repthre7").val()+","+$("#repthre8").val()+","+$("#repthre9").val()+","+$("#repthre10").val()+","+$("#repthre11").val();
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"update_sensor_characteristics","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'","time":"'+$("#seninterval").val()+'","val":"'+valreport+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});


//公司信息
$("#searchcominfo").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"query_company_information","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});
$("#setcominfo").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"update_company_information","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'","dev_code":"'+$("#equipnamenum").val()+'","code":"'+$("#comnamenum").val()+'","power_mode":"'+$("#powermode").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});


//传感器设备型号
$("#searchsenmodel").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"query_sensor_devicemodel","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});
$("#setsenmodel").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"update_sensor_devicemodel","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'","number":"'+$("#senmodel").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});


//转接盒
$("#searchtransfermodel").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"query_transfer_boxdevicek_model","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});
$("#settransfermodel").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"update_transfer_boxdevicek_model","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'","number":"'+$("#transfermodel").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});


//传感器序列号
$("#searchsenserial").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"query_sensor_sequence_number","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});
$("#setsenserial").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"update_sensor_sequence_number","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'","number":"'+$("#senserial").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});


//软件版本号
$("#searchsoftver").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"query_software_version_number","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});
$("#setsoftver").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	var version=$("#softvernum1").val()+"-"+$("#softvernum2").val()+"-"+$("#softvernum3").val();
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"update_software_version_number","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'","versionNumber":"'+version+'","date":"'+$("#softvertime").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});


//硬件版本号
$("#searchhardver").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"query_thehardware_version_number","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});
$("#sethardver").click(function(event) {
	if($("#equipname").val()=="") return parent.layer.msg("请先选择设备",{time:1000});
	$.ajax({
		url:get_api_urlo(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"update_thehardware_version_number","params":{"dev_id":"'+$("#equipid").val()+'","gateway":"'+$("#gwsn").val()+'","number":"'+$("#hardvernum").val()+'","date":"'+$("#hardvertime").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			// $("#senstate").val(result.onerankdevSn);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});


//查询内容
searchmsg();
$("#conupdata").click(function(event) {
	searchmsg();
});
function searchmsg(){
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"configuration_data"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var result = data.result;
			$("#searchcontent").val(result.value);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
}
