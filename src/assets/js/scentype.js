/*
* @Author: Administrator
* @Date:   2017-12-28 14:48:56
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-26 17:29:32
*/
jQuery.support.cors = true;
var locationSearch=window.location.search.split("&");
var scenaName=decodeURI(locationSearch[1].split("=")[1]);
var scenaId=locationSearch[0].split("=")[1];
$("#scenName").text(scenaName);

getScenType(scenaId);
function getScenType(scenId){
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_getSceneDevType","params":{"scene_id":"'+scenId+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			var typeColor=["1eb0ec","01c3cf","01cd9a","f8bd40","01c3cf","01cd9a","1eb0ec","01c3cf","546dc9","f8bd40","ff7e4b","32d161","f93ef3","1eb0ec","01c3cf","01cd9a","f8bd40","01c3cf","01cd9a","1eb0ec","01c3cf","546dc9","f8bd40","ff7e4b","32d161","f93ef3","1eb0ec","01c3cf","01cd9a","f8bd40","01c3cf","01cd9a","1eb0ec","01c3cf","546dc9","f8bd40","ff7e4b","32d161","f93ef3","1eb0ec","01c3cf","01cd9a","f8bd40","01c3cf","01cd9a","1eb0ec","01c3cf","546dc9","f8bd40","ff7e4b","32d161","f93ef3"];

			var list = data.result;
			var html="";
			var arr=[];
			for(var i=0;i<list.length;i++){
				// arr.push('<div class="sen-warm" style="background-color:#'+typeColor[i]+';" onclick="click_sentype(\''+list[i].typeCode+'\')">');
				if(list[i].runningStatus=="0"){
					console.log(list[i].devStatus)
                  	if(list[i].devStatus=="0"){
                  		arr.push('<div class="sen-prompt" style="background-color:#'+typeColor[i]+';" onclick="click_sentype(\''+list[i].typeCode+'\')">');
                  	}else if(list[i].devStatus=="2"){
                  		arr.push('<div class="sen-warm" style="background-color:#'+typeColor[i]+';" onclick="click_sentype(\''+list[i].typeCode+'\')">');
                  	}else{
                  		arr.push('<div class="" style="background-color:#'+typeColor[i]+';" onclick="click_sentype(\''+list[i].typeCode+'\')">');
                  	}
                  	
               	}else{
                  	arr.push('<div class="sen-empty" style="background-color:#'+typeColor[i]+';" onclick="click_sentype(\''+list[i].typeCode+'\')">');
                }

				// arr.push('<p class="img-tag"><img src="../../images/type_'+list[i].typeCode+'.png" height="100" width="120" alt=""></p>');
				arr.push('<p class="img-tag"><img src="'+(list[i].webScenePicture?list[i].webScenePicture:"../../images/scenblank.png")+'" height="100" width="120" alt=""></p>');

				var devValue=list[i].devValue.split(":")[1];
				arr.push('<p class="status">'+(devValue?devValue:list[i].devValue?list[i].devValue:"_")+'</p>');
				arr.push('<p class="type">'+list[i].typeName+'</p>');
				arr.push('</div>');
				
			}
			html=arr.join("");
			$("#scenTypeList").html(html);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
}

/*modal*/
//传感器类型获取
function chose_sentype(){
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
				if(list[i].typeCode=="176"||list[i].typeCode=="177") continue;
				arr.push('<option value="'+list[i].typeCode+'">'+list[i].typeName+'</option>');
				// arr.push('<button type="button" class="btn btn-default" id="'+list[i].id+'">'+list[i].typeName+'</button>');
				// arr.push('</li>');
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

$("#sentype").change(function(event) {
	if(this.value==""){
		$("#equipname").html('<option value="">请选择</option>');
		$("#gatename").val("");
		$("#gateId").val("");
		$("#sn").val("");
		$("#equipadress").val("");
		return;
	};
	$("#gatename").val("");
	$("#gateId").val("");
	$("#sn").val("");
	$("#equipadress").val("");
	
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_getDevTypeByOnerankdev","params":{"devType":"'+$("#sentype").val()+'","sceneId":"'+scenaId+'","type":"1"}}'
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
});

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
	    	params:'{"api_name":"web_addEquAndScene","params":{"scene_id":"'+scenaId+'","equ_id":"'+$("#equipname").val()+'","gatewayId":"'+$("#gateId").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			// magcard_list(true,search.pageNumber);

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
	$("#equipname").html('<option value="">请选择</option>');
	$("#gatename").val("");
	$("#gateId").val("");
	$("#sn").val("");
	$("#equipadress").val("");
});


/*scen*/
function click_sentype(type){
	// console.log(type);
	window.location.href="../sensor/template.html?typeCode="+type+"&scenId="+scenaId;
}


