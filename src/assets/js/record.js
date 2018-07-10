/*
* @Author: Administrator
* @Date:   2018-04-12 17:56:41
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-13 09:49:31
*/

/*列表处理*/
function list(pag,pageN){
	$.ajax({
        url:get_api_urle(),
        async:true,
        cache:false,
        // timeout:2000,
        type:"post",
        dataType:"json",
        data: {
            params:'{"api_name":"getOperationRecord","params":{"page_num":"'+pageN+'","page_limit":"'+search.pageSize+'","content":"'+search.record+'","start_time":"'+search.startTime+'","end_time":"'+search.endTime+'"}}'
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
				gate_page(data.result.rowsCount,data.result.pageSize);
			}

            var list=result.items;
            var html="";
            var arr=[];
            for(var i=0;i<list.length;i++){
                arr.push('<tr>');
                arr.push('<td>'+list[i].createdDate+'</td>');
                arr.push('<td>'+list[i].content+'</td>');
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
	record:""
};

list(true,search.pageNumber);

//查询
$("#search_btn").click(function(event) {
	search.record=$("#record").val();
	search.startTime=$("#bdate").val();
	search.endTime=$("#edate").val();
	
	list(true,search.pageNumber);
});
