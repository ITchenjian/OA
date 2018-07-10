/*
* @Author: Administrator
* @Date:   2018-03-30 14:53:42
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-02 12:04:26
*/
function getMagcard(){
	$.ajax({
		url:get_api_urle(),
		async:false,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"getListCard","params":{"page_num":"0","page_limit":"0","mag_num":""}}'
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
			var html="";
			var arr=['<option value="">请选择</option>'];
			for(var i=0;i<list.length;i++){
				arr.push('<option value="'+list[i].cardNumber+'">'+list[i].cardNumber+'</option>');
				
			};
			html=arr.join("");
			$("#magnum").html(html);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		}
		 
	});
}



/*列表处理*/
function trajeList(pag,pageN){
	$.ajax({
        url:get_api_urle(),
        async:true,
        cache:false,
        // timeout:2000,
        type:"post",
        dataType:"json",
        data: {
            params:'{"api_name":"getCardNumberDataPage","params":{"page_num":"'+pageN+'","page_limit":"'+search.pageSize+'","zone_id":"'+search.zoneId+'","card_number":"'+search.cardId+'","start_time":"'+search.startTime+'","end_time":"'+search.endTime+'","equ_id":"'+search.equipId+'","name":"'+search.name+'"}}'
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

            if(pag){
				traje_page(data.result.rowsCount,data.result.pageSize);
			}

            var list=result.items;
            var html="";
            var arr=[];
            for(var i=0;i<list.length;i++){
                arr.push('<tr>');
                arr.push('<td>'+list[i].cardNumber+'</td>');
                arr.push('<td>'+list[i].name+'</td>');
                arr.push('<td>'+list[i].deviceName+'</td>');
                arr.push('<td>'+list[i].startTime+'</td>');
                arr.push('<td>'+list[i].endTime+'</td>');
                arr.push('<td>'+list[i].residenceTime+'</td>');
                arr.push('<td>'+list[i].remarks+'</td>');
                
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
};

var search={
	pageNumber:"1",
	pageSize:"10",
	startTime:"",
	endTime:"",
	zoneId:"",
	cardId:"",

	equipId:"",
	name:""
};

// getMagcard();
trajeList(true,search.pageNumber);

//查询
$("#search_btn").click(function(event) {
	search.cardId=$("#magnum").val();
	search.startTime=$("#bdate").val();
	search.endTime=$("#edate").val();
	search.name=$("#name").val();
	
	trajeList(true,search.pageNumber);
});