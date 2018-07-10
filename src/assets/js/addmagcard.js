/*
* @Author: Administrator
* @Date:   2017-10-18 17:32:44
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-24 11:03:15
*/
var locationSearch=location.search;
var zoneId=locationSearch.split("=")[1];
$("#halltemplate").attr("href","./halltemplate.html?zoneId="+zoneId);


$('#addmagcardModal').on('hidden.bs.modal', function (e) {
  	$("#addmag_form").Validform().resetForm(); 
 	$("#addmagcardModal .Validform_checktip").html("");
});


//获取区域列表
var search={
	pageNumber:"1",
	pageSize:"10",
	magName:"",
	magNum:""
};
magcard_list(true,search.pageNumber);
function magcard_list(pag,pageN){
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"getListCard","params":{"page_num":"'+pageN+'","page_limit":"'+search.pageSize+'","mag_name":"'+search.magName+'","mag_num":"'+search.magNum+'"}}'
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
				magcard_page(data.result.rowsCount,data.result.pageSize);
			}
			var list = data.result.items;
			var html="";
			var arr=[];
			for(var i=0;i<list.length;i++){
				arr.push('<tr>');
				arr.push('<td>'+list[i].cardNumber+'</td>');
				arr.push('<td>'+list[i].name+'</td>');
				arr.push('<td>'+(list[i].sex==1?'女':'男')+'</td>');
				arr.push('<td>'+(Boolean(list[i].position)?list[i].position:'')+'</td>');
				arr.push('<td>'+(Boolean(list[i].industry)?list[i].industry:'')+'</td>');
				arr.push('<td>'+(Boolean(list[i].company)?list[i].company:'')+'</td>');

				arr.push('<td>'+(Boolean(list[i].createdDate)?list[i].createdDate:'')+'</td>');
				arr.push('<td>');
				arr.push('<a title="" href="#" data-target="#addmagcardModal" data-toggle="modal" onclick="edit_mag('+list[i].cardNumberId+')"><span>编辑</span></a>&nbsp;&nbsp;');
				arr.push('<a title="" href="javascript:;" onclick="del_mag('+list[i].cardNumberId+')" class=""><span>删除</span></a>');
				arr.push('</td>');
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
	search.magNum=$("#mag_num").val();
	magcard_list(true,search.pageNumber);

});


//编辑磁卡获取数据
function edit_mag(magId){
	$("#area_id").val(magId);
	if(magId==""&&magId!=0) return;
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"getBeforeModificationCard","params":{"card_number_id":"'+magId+'"}}'
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
			$("#mag_id").val(result.cardNumberId);

			$("#magnum").val(result.cardNumber);
			$("#magnum1").val(result.cardNumber1);
			$("#magnum2").val(result.cardNumber2);
			$("#magname").val(result.name);
			$("#sex").val(result.sex);
			$("#position").val(result.position);
			$("#industry").val(result.industry);
			$("#mag_phone").val(result.phone);
			$("#mag_company").val(result.company);
			$("#mag_address").val(result.address);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
	
}

//删除磁卡
function del_mag(magId){
	parent.layer.confirm('您确定删除该磁卡？', 
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
		    	params:'{"api_name":"deleteCard","params":{"card_number_id":"'+magId+'"}}'
		    },
			contentType:"application/x-www-form-urlencoded;charset=utf-8", 
			beforeSend:function(xhr){
				// parent.modal_loading("正在获取数据！");
				
			},
			success:function(data,status,xhr){
				magcard_list(true,search.pageNumber);
				
			},
			error: function (a, b, c) {
				// parent.modal_loading("error");
			 	console.log(c);
			 }
			 
		});
	});
	
	
}

//添加、编辑完成提交数据
$("#add_true").click(function(event) {
	if(!addmaginfo) return;
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"modifyOrAddCard","params":{"card_number_id":"'+$("#mag_id").val()+'","card_number":"'+$("#magnum").val()+'","card_number1":"'+$("#magnum1").val()+'","card_number2":"'+$("#magnum2").val()+'","name":"'+$("#magname").val()+'","phone":"'+$("#mag_phone").val()+'","company":"'+$("#mag_company").val()+'","address":"'+$("#mag_address").val()+'","sex":"'+$("#sex").val()+'","position":"'+$("#position").val()+'","industry":"'+$("#industry").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			magcard_list(true,search.pageNumber);

			
			
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
	addmaginfo=false;
	$("#addmagcardModal").modal('hide');
});
