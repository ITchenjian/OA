/*
* @Author: Administrator
* @Date:   2018-05-08 11:15:42
* @Last Modified by:   Administrator
* @Last Modified time: 2018-06-04 18:38:54
*/
var href=window.location.href;
var protocol=window.location.protocol;
var host=window.location.host;
var port=window.location.port;
var url=protocol+"//"+host+"/parking/";

var url = "http://192.168.1.25:7367/oa/";
export default{
  	install(Vue,options){
  		/*api*/
	    Vue.prototype.get_api_url = function () {
	      	return url+"web/web_interface.html";
	    };
	    Vue.prototype.get_api_urle = function () {
	      	return url+"web/bj_web_interface.html";
	    };

	    /*pagination*/
	    Vue.prototype.page_curBase=function (total,num,that) {
		    $("#Pagination").pagination(
		        total,
		        {
		            items_per_page : num,
		            current_page : Number(that.search.pageNumber)-1,
		            num_edge_entries : 1,
		            num_display_entries : 2,
		            callback :function(id,jp){
		                that.search.pageNumber=id+1;
		                that.tableList(false,id+1);
		            }
		        });
		};

		/*Map*/
		Vue.prototype.setMapEvent=function (map) {
		    map.enableScrollWheelZoom();
		    map.enableKeyboard();
		    map.enableDragging();
		    map.enableDoubleClickZoom();
		};
		Vue.prototype.addMapControl=function (map) {
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
		};
		Vue.prototype.addMapOverlay=function (map, markers) {
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

                // addClickHandler(marker, infoWindow,markers[index].deviceName,markers[index].equId);

                map.addOverlay(marker);

            };
		};
		Vue.prototype.addMapOverlayl=function (n, m, map, typeImg) {
		    var markers = {
		        content : "南山数字文化产业基地西塔楼1009室",
		        title : "公司地址",
		        imageOffset : {
		            width : 0,
		            height : 0
		        },
		        position : {
		            lng : m,
		            lat : n
		            
		        }
		    };

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

		    var allOverlay = map.getOverlays();
		    for (var i = 0; i < allOverlay.length; i++) {
		        map.removeOverlay(allOverlay[i]);
		    }
		    map.addOverlay(marker);
		}
  	}
}