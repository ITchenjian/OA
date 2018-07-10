/*
* @Author: Administrator
* @Date:   2017-12-22 18:22:14
* @Last Modified by:   Administrator
* @Last Modified time: 2018-01-23 11:25:58
*/
//获取区域列表
var search={
	pageNumber:"1",
	pageSize:"10",
	name:""
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
	    	params:'{"api_name":"web_getRelationList","params":{"page_num":"'+pageN+'","page_limit":"'+search.pageSize+'","name":"'+search.name+'"}}'
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
				dev_page(data.result.rowsCount,data.result.pageSize);
			}
			var list = data.result.items;
			var html="";
			var arr=[];
			for(var i=0;i<list.length;i++){
				arr.push('<tr>');
				arr.push('<td>'+list[i].deviceName+'</td>');
				arr.push('<td>'+list[i].asDevName+'</td>');
				arr.push('<td>'+list[i].createdDate+'</td>');
				
				arr.push('<td><a title="" href="javascript:;" data-target="#addcorrelateModal" data-toggle="modal" onclick="edit_dev('+list[i].equId+')"><span>编辑</span></a>&nbsp;&nbsp;<a title="" href="javascript:;" onclick="unbind_dev('+list[i].equId+')"><span>解除</span></a></td>');
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


/*modal*/
//获取数据
function edit_dev(equipId){
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
			$("#assentype").html(html);

			if(Boolean(equipId)){
				getConrre(equipId);
			}

		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
};

function getConrre(equipId){
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_getDevTypeByOnerankdev","params":{"equId":"'+equipId+'","type":"3"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;

			var lists = data.result.maps;
			var list = data.result.map;
			$("#sentype").val(lists.devType.typeCode);
			$("#equipname").html('<option value="'+lists.equId+'">'+lists.devName+'</option>');
			$("#sn").val(lists.onerankdevDevSn);
			$("#equipadress").val(lists.address);

			$("#assentype").val(list.devType.typeCode);
			$("#asequipname").html('<option value="'+list.equId+'">'+list.devName+'</option>');
			$("#assn").val(list.onerankdevDevSn);
			$("#asequipadress").val(list.address);
			
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
}

//关联
$("#sentype").change(function(event) {
	if(this.value==""){
		$("#equipname").html('<option value="">请选择</option>');
		$("#sn").val("");
		$("#equipadress").val("");
		return;
	};

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
});

$("#equipname").change(function(event) {
	if(this.value==""){
		// $("#gatename").val("");
		// $("#gateId").val("");
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
			// $("#gatename").val(list.gwName);
			// $("#gateId").val(list.gwId);
			$("#sn").val(list.onerankdevSn);
			$("#equipadress").val(list.address);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});

//被关联
$("#assentype").change(function(event) {
	if(this.value==""){
		$("#asequipname").val('<option value="">请选择</option>');
		$("#assn").val("");
		$("#asequipadress").val("");
		return;
	};
	$("#assn").val("");
	$("#asequipadress").val("");


	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_getDevTypeByOnerankdev","params":{"devType":"'+$("#assentype").val()+'","type":"2"}}'
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
			$("#asequipname").html(html);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});

$("#asequipname").change(function(event) {
	if(this.value==""){
		// $("#gatename").val("");
		// $("#gateId").val("");
		$("#assn").val("");
		$("#asequipadress").val("");
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
	    	params:'{"api_name":"web_getEquipmentDetail","params":{"equ_id":"'+$("#asequipname").val()+'"}}'
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
			// $("#gatename").val(list.gwName);
			// $("#gateId").val(list.gwId);
			$("#assn").val(list.onerankdevSn);
			$("#asequipadress").val(list.address);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
});

//确认关联
$("#add_true").click(function(event) {
	console.log("s")
	// if(!addmaginfo) return;
	if($("#equipname").val()==""||$("#asequipname").val()=="") return;
	if($("#equipname").val()==$("#asequipname").val()){
		$("#addcorrelateModal").modal('hide');
		return parent.layer.msg('请勿关联本身', { time: 1000});
	};
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_relation","params":{"equId":"'+$("#equipname").val()+'","equIds":"'+$("#asequipname").val()+'","type":"0"}}'
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
	$("#addcorrelateModal").modal('hide');
});


$('#addcorrelateModal').on('hidden.bs.modal', function (e) {
	$("#equipname").html('<option value="">请选择</option>');
	$("#sn").val("");
	$("#equipadress").val("");

  	$("#asequipname").html('<option value="">请选择</option>');
	$("#assn").val("");
	$("#asequipadress").val("");
});





//解除关联
function unbind_dev(equId){
	parent.layer.confirm('您确定解除此条关联？', 
	{
	  btn: ['确定','取消']
	}, function(index){
		parent.layer.close(index);
		$.ajax({
			url:get_api_urle(),
			async:true,
			cache:false,
			// timeout:2000,
			type:"post",
			dataType:"json",
			data: {
		    	params:'{"api_name":"web_relation","params":{"equId":"'+equId+'","type":"1"}}'
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