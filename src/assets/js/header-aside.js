/*
* @Author: Administrator
* @Date:   2017-09-18 12:02:53
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-16 11:44:36
*/
$("#accordion").on("click",".title",function(event){
	$(".title").find("i").attr("class","icon iconfont icon-arrowdown");
	if($(this).next().hasClass("in")){
		$(this).find("i").removeClass("icon-arrowup");
		$(this).find("i").removeClass("icon-arrowdown")
		$(this).find("i").addClass("icon-arrowdown");
	}else{
		$(this).find("i").addClass("icon-arrowup")
		$(this).find("i").removeClass("icon-arrowdown")
	}
});

$("#accordion").on("click","li",function(){
	$(".aside .body ul li").removeClass("active");
	$(this).addClass("active");

});


/*左侧菜单-隐藏显示*/

function displaynavbar(obj) {
    if ($(obj).hasClass("open")) {
        $(obj).removeClass("open");
        $("body").removeClass("big-page");
    } else {
        $(obj).addClass("open");
        $("body").addClass("big-page");

    }
}

/*传感器*/
getSensorTypeList();
function getSensorTypeList(){
	$.ajax({
		url:get_api_urle(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"queryDevTypeAll"}'
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
			var html="";
			var arr=[];
			for(var i=0;i<list.length;i++){
				arr.push('<li class=""><a href="./temp/sensor/template.html?typeCode='+list[i].typeCode+'" target="rightFrame">'+list[i].typeName+'</a></li>');
			}
			html=arr.join("");
			$("#sensorTypeList").html(html);

			scrollbar(list.length);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
}


/*体验馆*/
getHallList();
function getHallList(){
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_get_area_level_list","params":{"pageNumber":"0","pageSize":"0","zone_name":"","type":"1"}}'
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
			var arr=[];
			for(var i=0;i<list.length;i++){
				arr.push('<li class=""><a href="./temp/hall/halltemplate.html?zoneId='+list[i].sceneId+'" target="rightFrame">'+list[i].sceneName+'</a></li>');
			}
			html=arr.join("");
			$("#hallList").html(html);
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
}






/*模拟滚动*/
function scrollbar(item){
	var boxHeight=$(".scrollbar").innerHeight();
	var totalHeight=item*39;
	// console.log(totalHeight)
	if(boxHeight>=600){
		var marginTop=0;
		$(".scrollbar").on("mousewheel DOMMouseScroll",function(e){
			var delta = -e.originalEvent.wheelDelta || e.originalEvent.detail;
		    // console.log(delta)
		    if(delta>0){
		    	if(marginTop<=totalHeight-boxHeight-60){
		    		marginTop=marginTop+60;
		    	}else{
		    		marginTop=totalHeight-boxHeight;
		    	}
		        $(this).children('ul').css("marginTop",-marginTop)
		    }
		    if(delta<0){
		    	if(marginTop>=60){
		    		marginTop=marginTop-60;
		    	}else{
		    		marginTop=0;
		    	}
		        $(this).children('ul').css("marginTop",-marginTop)
		    }

		})
	}
}
