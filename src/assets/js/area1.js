/*
* @Author: Administrator
* @Date:   2017-09-25 10:53:42
* @Last Modified by:   Administrator
* @Last Modified time: 2017-09-25 16:14:50
*/
area_page(20,10);
$('#editareaModal').on('hidden.bs.modal', function (e) {
  	$("#editarea_form").Validform().resetForm(); 
 	$("#editareaModal .Validform_checktip").html("");
 	map2.clearOverlays();
});

var map2 = new BMap.Map("areaMap"); 
map2.centerAndZoom(new BMap.Point(113.925049, 22.552487), 12);   
setMapEvent(map2);
addMapControl(map2);
// addMapOverlay(map2);
drawing(map2);

var styleOptions = {
    strokeColor:"#ccc",    //边线颜色。
    fillColor:"#000",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 1,       //边线的宽度，以像素为单位。
    strokeOpacity: 1,	   //边线透明度，取值范围0 - 1。
    fillOpacity: 0.2,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}


map2.addEventListener("click", function(e) {
    // 创建地理编码服务实例
    var myGeo = new BMap.Geocoder();
    // 根据坐标得到地址描述
    myGeo.getLocation(new BMap.Point(e.point.lng, e.point.lat), function(result) {
        if (result) {
           
            console.log(e)
            /*$("#pplace").val(result.address);
            $("#point_lat").val(e.point.lat);
            $("#point_lng").val(e.point.lng);*/
        }

    });
});

// 添加、编辑区域获取数据
function edit_area(areaId){
	$("#area_id").val(areaId);
	$('#editareaModal').on('shown.bs.modal', function (e) {
	  	var polygon = new BMap.Polygon([   
	        new BMap.Point(114.033708,22.484647),    
	        new BMap.Point(114.152141,22.484647),
	        new BMap.Point(114.152141,22.530618),
	        new BMap.Point(114.033708,22.530618)
	     ], styleOptions);
	  	map2.addOverlay(polygon);
	  	$('#editareaModal').off('shown.bs.modal');
	});
}

//编辑完成提交数据
$("#edit_true").click(function(event) {
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_order_manag","params":{"pageNumber":"1","pageSize":"10"}}'
	    },
		contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		beforeSend:function(xhr){
			// parent.modal_loading("正在获取数据！");
		},
		success:function(data,status,xhr){
			parent.modal_loading("");
			jump_index(data);
			if(data.code!=100) return;
			
			
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
});
