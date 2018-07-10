/*
* @Author: Administrator
* @Date:   2017-09-20 17:29:53
* @Last Modified by:   Administrator
* @Last Modified time: 2018-03-29 11:37:58
*/
//地图初始化   

/*地图事件*/
function setMapEvent(map) {
    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.enableDragging();
    map.enableDoubleClickZoom();
}

/*控件*/
function addMapControl(map) {
    
    var scaleControl = new BMap.ScaleControl({
        anchor : BMAP_ANCHOR_BOTTOM_LEFT
    });
    scaleControl.setUnit(BMAP_UNIT_METRIC);
    map.addControl(scaleControl);
    var navControl = new BMap.NavigationControl({
        anchor : BMAP_ANCHOR_TOP_LEFT,
        type : 3
    });
    map.addControl(navControl);
    var overviewControl = new BMap.OverviewMapControl({
        anchor : BMAP_ANCHOR_BOTTOM_RIGHT,
        isOpen : false
    });
    map.addControl(overviewControl);

    /*var size = new BMap.Size(40, 10);
    var cityListControl=new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: size
    });
    map.addControl(cityListControl);*/
}

/*所有传感器覆盖物*/
function addMapOverlay(map,typecode,zoneid) {
    $.ajax({
        url :  get_api_urle(),
        type : "POST",
        dataType : "json",
        data: {
            params:'{"api_name":"getOnerankdev","params":{"page_num":"0","page_limit":"0","type_code":"'+typecode+'","zone_id":"'+zoneid+'","type":"1"}}'
        },
        contentType : "application/x-www-form-urlencoded;charset=utf-8",
        success : function(data) //data是返回数据处理后的结果 
        {

            if(data.code!=100) return;
            
            var markers = data.result.page.items;
            
            for (var index = 0; index < markers.length; index++) {

                var type=markers[index].typeCode;
                
                var point = new BMap.Point(
                        markers[index].longitude,
                        markers[index].latitude);
                var marker = new BMap.Marker(
                        point,
                        {
                            icon : new BMap.Icon(
                                    markers[index].webMapPicture?markers[index].webMapPicture:"../../images/mark.png",
                                    new BMap.Size(26, 36),
                                    {
                                        imageOffset : new BMap.Size(0,0)
                                    })
                        });
                var label = new BMap.Label(markers[index].deviceName, {
                    offset : new BMap.Size(25, 5)
                });
                var opts = {
                    width : 200,
                    title : markers[index].deviceName,
                    // title : markers[index].typeName,
                    enableMessage : false
                };
                var infoWindow = new BMap.InfoWindow(markers[index].address, opts);
                // marker.setLabel(label);

                addClickHandler(marker, infoWindow,markers[index].deviceName,markers[index].equId);

                map.addOverlay(marker);

            };
        }
    });

}

/*单个*/
function addMapOverlayl(n, m, map, typeImg) {
    var markers = {
        content : "南山数字文化产业基地西塔楼1009室",
        title : "公司地址",
        imageOffset : {
            width : 0,
            height : 0
        },
        position : {
            lat : n,
            lng : m
        }
    };
    // console.log(type)
    /*switch (type)
    {
      case "209":
        markers.imageOffset.width=-546;
        break;
      case "178":
        markers.imageOffset.width=-702;
        break;
      case "161":
        markers.imageOffset.width=-52;
        break;
      case "162":
        markers.imageOffset.width=-78;
        break;
      case "163":
        markers.imageOffset.width=-442;
        break;
      case "164":
        markers.imageOffset.width=-260;
        break;
      case "165":
        markers.imageOffset.width=-104;
        break;
      case "166":
        markers.imageOffset.width=-390;
        break;
      case "171":
        markers.imageOffset.width=-858;
        break;
      case "167":
        markers.imageOffset.width=-754;
        break;
      case "168":
        markers.imageOffset.width=-780;
        break;
      case "169":
        markers.imageOffset.width=-572;
        break;
      case "173":
        markers.imageOffset.width=-26;
        break;
      case "170":
        markers.imageOffset.width=-650;
        break;
      case "175":
        markers.imageOffset.width=-624;
        break;
      case "174":
      case "238":
        markers.imageOffset.width=-676;
        break;
      case "86":
      case "172":
        markers.imageOffset.width=-1014;
        break
      case "81":
        markers.imageOffset.width=-338;
        break;
      case "82":
        markers.imageOffset.width=-884;
        break;
      case "83":
        markers.imageOffset.width=-312;
        break;
      case "84":
        markers.imageOffset.width=-416;
        break;
      case "85":
        markers.imageOffset.width=-234;
        break;
      case "87":
        markers.imageOffset.width=-962;
        break;
      case "88":
        markers.imageOffset.width=-494;
        break;
      case "89":
        markers.imageOffset.width=-1040;
        break;
      case "90":
        markers.imageOffset.width=-1066;
        break;
      case "91":
        markers.imageOffset.width=0;
        break;
      case "95":
        markers.imageOffset.width=-546;
        break;
      case "96":
        markers.imageOffset.width=-182;
        break;
      case "97":
        markers.imageOffset.width=-156;
        break;
      case "98":
        markers.imageOffset.width=-468;
        break;
      default:
        markers.imageOffset.width=-806;

    }*/


    var point = new BMap.Point(markers.position.lng, markers.position.lat);
    var marker = new BMap.Marker(
            point,
            {
                icon : new BMap.Icon(
                        (typeImg&&typeImg!="null")?typeImg:"../../images/mark.png",
                        new BMap.Size(26, 36), {
                            imageOffset : new BMap.Size(0,0)
                        })
            });

    /*var label = new BMap.Label("1", {
                    offset : new BMap.Size(25, 5)
                });
    marker.setLabel(label);
    marker.setZIndex(0);*/

    var allOverlay = map.getOverlays();
    for (var i = 0; i < allOverlay.length; i++) {
        map.removeOverlay(allOverlay[i]);
    }
    // console.log(marker);
    map.addOverlay(marker);
    // console.log(map.getOverlays()[0]);
}





/*覆盖物点击事件*/
function addClickHandler(target, window,id,name) {
   
    target.addEventListener("click", function() {
        target.openInfoWindow(window);
        console.log(id,name);
    });
}


function drawing(map){
	var styleOptions = {
	    strokeColor:"#ccc",    //边线颜色。
	    fillColor:"#000",      //填充颜色。当参数为空时，圆形将没有填充效果。
	    strokeWeight: 1,       //边线的宽度，以像素为单位。
	    strokeOpacity: 1,	   //边线透明度，取值范围0 - 1。
	    fillOpacity: 0.2,      //填充的透明度，取值范围0 - 1。
	    strokeStyle: 'solid' //边线的样式，solid或dashed。
	}
    drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(-50, 5), //偏离值
            scale: .6,
            drawingModes: [BMAP_DRAWING_MARKER,BMAP_DRAWING_POLYLINE,BMAP_DRAWING_RECTANGLE]
        },
        polylineOptions: styleOptions, //线的样式
        rectangleOptions: styleOptions //矩形的样式
    });

    var overlays = [];  
    drawingManager.addEventListener("rectanglecomplete",function(overlay){
        overlays.push(overlay); 
        $("#area_point").val(getPoint(overlays));
        drawingManager.close();
        
    });

    $(".BMapLib_Drawing_panel").on("click",".BMapLib_box",function(event) {
        
        for(var i = 0; i < overlays.length; i++){    
            map.removeOverlay(overlays[i]);    
        }    
        overlays.length = 0 ;
    });
};

function getPoint(overlays){
    var pointArr=[]; 
    for(var i = 0; i < overlays.length; i++){
        var overlay=overlays[i].getPath();
        for(var j = 0; j < overlay.length; j++){    
            var grid =overlay[j];   
            pointArr.push(grid.lng+"/"+grid.lat);
        }    
    } 
    return pointArr;   
} 




  

    

    
 

