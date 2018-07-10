/*
* @Author: Administrator
* @Date:   2017-10-10 16:34:29
* @Last Modified by:   Administrator
* @Last Modified time: 2018-03-27 11:51:12
*/
$('#setequipModal').on('hidden.bs.modal', function (e) {
  	$("#equipset_form").Validform().resetForm(); 
 	$("#setequipModal .Validform_checktip").html("");
})
//获取列表
var backCurPage=location.search.split("=")[1];
var search={
	pageNumber:"1",
	pageSize:"10",
	equiptype:""
};
if(Boolean(backCurPage)){
	search.pageNumber=backCurPage;
}

// console.log(search.pageNumber)
equipset_list(true,search.pageNumber);
function equipset_list(pag,pageN){
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"getDevType","params":{"pageNumber":"'+pageN+'","pageSize":"'+search.pageSize+'","equiptype":"'+search.equiptype+'"}}'
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
				equipset_page(data.result.rowsCount,data.result.pageSize);
			}
			var list = data.result.items;
			var html="";
			var arr=[];
			for(var i=0;i<list.length;i++){
				arr.push('<tr>');
				arr.push('<td>'+list[i].typeName+'</td>');
				arr.push('<td>'+list[i].createdDate+'</td>');
				if(Boolean(list[i].startRange)){
					arr.push('<td>'+list[i].startRange+'</td>');
				}else{
					arr.push('<td>0</td>');
				}
				if(Boolean(list[i].endRange)){
					arr.push('<td>'+list[i].endRange+'</td>');
				}else{
					arr.push('<td>0</td>');
				}
				if(Boolean(list[i].dangerousValue)){
					arr.push('<td>'+list[i].dangerousValue+'</td>');
				}else{
					arr.push('<td>0</td>');
				}
				arr.push('<td>');
				arr.push('<a title="" href="#" data-target="#setequipModal" data-toggle="modal" onclick="set_equip('+list[i].id+')"><span>阈值设置</span></a>&nbsp;&nbsp;');
				arr.push('<a title="" href="./sensortypeadd.html?senTypeId='+list[i].id+'&curPage='+data.result.curIndex+'"><span>类型编辑</span></a>');
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
	search.pageNumber=1;
	search.equiptype=$("#eq_type").val();
	equipset_list(true,search.pageNumber);

});

//获取数据 
function set_equip(eqsetId){
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"beforeModificationDevType","params":{"id":"'+eqsetId+'"}}'
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
			$("#equipset_type").val(result.typeName);
			$("#equipset_id").val(result.id);
			$("#startrange").val(result.startRange);
			$("#endrange").val(result.endRange);
			$("#dangerval").val(result.dangerousValue);
			$("#proportion").val(result.occupy);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
}

function setSensorType(senTypeId,curPage){
	window.location.href="./sensortypeadd.html?senTypeId="+senTypeId+"&curPage="+curPage;
}

//设置成功
$("#set_true").click(function(event) {
	if(!eqsetinfo) return;
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"updateDevType","params":{"id":"'+$("#equipset_id").val()+'","startRange":"'+$("#startrange").val()+'","endRange":"'+$("#endrange").val()+'","dangerousValue":"'+$("#dangerval").val()+'","occupy":"'+$("#proportion").val()+'"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			// parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			equipset_list(true,search.pageNumber);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
	eqsetinfo=false;
	$("#setequipModal").modal('hide');
});