/*
* @Author: Administrator
* @Date:   2017-06-27 19:06:57
* @Last Modified by:   Administrator
* @Last Modified time: 2018-01-11 15:03:38
*/

// 'use strict';
jQuery.support.cors = true;//支持跨域

//网关日志列表
/*网关序列号选择框*/
var gatew={};
$.ajax({
	url :  get_api_url(),
	async:false,
	type : "POST",
	dataType : "json",
	data: {
    	params:'{"api_name":"web_get_all_sn"}'
    },
	contentType : "application/x-www-form-urlencoded;charset=utf-8",
	success : function(data) //data是返回数据处理后的结果 
	{
		jump_index(data);
		if(data.code!=100) return;
		gatew=data.result;
		var allList = data.result;
		
		var html='<option value="">请选择</option>';
		for(var i=0;i<allList.length;i++){
			html+='<option value="'+allList[i].gwId+'">'+allList[i].gwName+'</option>';
		}
		$("#gatew").html(html);
	}
})


/*查询参数*/
var search={
	pageNumber:"1",
	pageSize:"6",
	bdate:"",
	edate:"",
	gatew:"",
	keyword:"",
	dict1:"",
	dict2:""

}
/*渲染列表*/
list(true,search.pageNumber,true);
function list(pag,pageN,sel){
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_get_dev_log","params":{"pageNumber":"'+pageN+'","pageSize":"'+search.pageSize+'","bdate":"'+search.bdate+'","edate":"'+search.edate+'","gatew":"'+search.gatew+'","keyword":"'+search.keyword+'","delimiter1":"'+search.dict1+'","delimiter2":"'+search.dict2+'"}}'
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
				gate_page(data.result.runList.rowsCount,search.pageSize);
			}
			
			var runlist = data.result.runList.items;
			var list1 = data.result.sysDictionaryList;
			var list2 = data.result.sysDictionaryList1;
			
			if(sel){
				var html_dict1='<option value="">请选择</option>';
				var html_dict2='<option value="">请选择</option>';
				for(var i=0;i<list1.length;i++){
					html_dict1+='<option value="'+list1[i].dictValue+'">'+list1[i].dictName+'</option>';
				}
				for(var i=0;i<list2.length;i++){
					html_dict2+='<option value="'+list2[i].dictValue+'">'+list2[i].dictName+'</option>';
				}
				$("#dict1").html(html_dict1);
				$("#dict2").html(html_dict2);
			}
			
			var html="";
			var arr=[];
			for(var i=0;i<runlist.length;i++){
				arr.push('<tr data-id='+runlist[i].logId+'>');
				arr.push('<td>'+runlist[i].logId+'</td>');
				arr.push('<td>'+runlist[i].createdDate+'</td>');
				var run=runlist[i].dataType=="0" ? "发送数据" : "接收数据";
				arr.push('<td>'+run+'</td>');
				arr.push('<td>'+runlist[i].text+'</td>');
				var ft=true;
                for(var n=0;n<gatew.length;n++){
                    if(runlist[i].gatewayNumber==gatew[n].gwSn){
                        arr.push('<td>'+gatew[n].gwName+'</td>');
                        ft=false;
                    }
                };
                if(ft){
                    arr.push('<td>'+runlist[i].gatewayNumber+'</td>');
                };
				// arr.push('<td><pre style="width:800px; text-align:left;">'+runlist[i].analyticalContent+'</pre></td>');
				if(Boolean(runlist[i].analyticalContent)){
					arr.push('<td><textarea name="" class="pretxt" cols="70" rows="3" readonly>'+runlist[i].analyticalContent+'</textarea></td>');
				}else{
					arr.push('<td><textarea name="" class="pretxt" cols="70" rows="2" readonly>'+runlist[i].analyticalContent+'</textarea></td>');
				}
				arr.push('<td>'+runlist[i].flowNum2+'</td>');
				// console.log(runlist[i].delimiter1)
				for(var j=0;j<list1.length;j++){
					if(runlist[i].delimiter1==list1[j].dictValue){
						arr.push('<td>'+list1[j].dictName+'</td>');
					}
				}
				for(var k=0;k<list2.length;k++){
					if(runlist[i].delimiter2==list2[k].dictValue){
						arr.push('<td>'+list2[k].dictName+'</td>');
					}
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

$("#search_btn").click(function(event) {
	search.bdate=$("#bdate").val();
	search.edate=$("#edate").val();
	search.gatew=$("#gatew").val();
	search.keyword=$("#fuzzy").val();
	search.dict1=$("#dict1").val();
	search.dict2=$("#dict2").val();
	//调接口
	list(true,search.pageNumber);
});



