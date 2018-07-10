/*
* @Author: Administrator
* @Date:   2017-06-14 15:10:01
* @Last Modified by:   Administrator
* @Last Modified time: 2018-03-29 10:28:53
*/

// 'use strict';
/*翻页*/

//场景管理
function scen_page(total,num) {
    $("#Pagination").pagination(
        total,
        {
            items_per_page : num,
            current_page : Number(search.pageNumber)-1,
            num_edge_entries : 1,
            num_display_entries : 2,
            callback :function(id,jp){
                search.pageNumber=id+1;
                addscen_list(false,id+1);
            }
        });
};

//区域管理
function area_page(total,num) {
    $("#Pagination").pagination(
        total,
        {
            items_per_page : num,
            num_edge_entries : 1,
            num_display_entries : 2,
            callback :function(id,jp){
                area_list(false,id+1);
            }
        });
};

//设备管理(绑定)
function equip_page(total,num) {
    $("#Pagination").pagination(
        total,
        {
            items_per_page : num,
            current_page : Number(search.pageNumber)-1,
            num_edge_entries : 1,
            num_display_entries : 2,
            callback :function(id,jp){
                search.pageNumber=id+1;
                equip_list(false,id+1);
            }
        });
};

//电表+传感器+关联等设备管理
function dev_page(total,num) {
    $("#Pagination").pagination(
        total,
        {
            items_per_page : num,
            current_page : Number(search.pageNumber)-1,
            num_edge_entries : 1,
            num_display_entries : 2,
            callback :function(id,jp){
                search.pageNumber=id+1;
                dev_list(false,id+1);
            }
        });
};

//日志列表
function gate_page(total,num) {
    $("#Pagination").pagination(
        total,
        {
            items_per_page : num,
            num_edge_entries : 1,
            num_display_entries : 2,
            callback :function(id,jp){
                // alert("good")
                list(false,id+1);
            }
        });
};



//电表+传感器等设备历史数据
function his_page(total,num) {
    $("#Pagination").pagination(
        total,
        {
            items_per_page : num,
            num_edge_entries : 1,
            num_display_entries : 2,
            callback :function(id,jp){
                his_list(false,id+1);
            }
        });
};

//设备设置(阈值)
function equipset_page(total,num) {
    // console.log(search.pageNumber)
    $("#Pagination").pagination(
        total,
        {
            items_per_page : num,
            current_page : Number(search.pageNumber)-1,
            num_edge_entries : 1,
            num_display_entries : 2,
            callback :function(id,jp){
                search.pageNumber=id+1;
                equipset_list(false,id+1);
            }
        });
};

//大棚读卡器
function readshed_page(total,num) {
    $("#Pagination").pagination(
        total,
        {
            items_per_page : num,
            num_edge_entries : 1,
            num_display_entries : 2,
            callback :function(id,jp){
                readshed_list(false,id+1);
            }
        });
};

//磁卡列表
function magcard_page(total,num) {
    $("#Pagination").pagination(
        total,
        {
            items_per_page : num,
            num_edge_entries : 1,
            num_display_entries : 2,
            callback :function(id,jp){
                magcard_list(false,id+1);
            }
        });
};


//轨迹列表
function traje_page(total,num) {
    $("#Pagination").pagination(
        total,
        {
            items_per_page : num,
            num_edge_entries : 1,
            num_display_entries : 2,
            callback :function(id,jp){
                trajeList(false,id+1);
            }
        });
};

//停留磁卡总览
function allmag_page(total,num) {
    $("#Pagination").pagination(
        total,
        {
            items_per_page : num,
            num_edge_entries : 1,
            num_display_entries : 2,
            callback :function(id,jp){
                console.log(id,jp)
                magpass(false,id+1,10,readcardId);

            }
        });
};





//gateway_page
function gateway_page(total,num) {
    $("#Pagination").pagination(
        total,
        {
            items_per_page : num,
            num_edge_entries : 1,
            num_display_entries : 2,
            callback :function(id,jp){
            	
               /* $.ajax({
                    url:get_api_url(),
                    async:true,
                    cache:false,
                    // timeout:2000,
                    type:"post",
                    dataType:"json",
                    data: {
                        params:'{"api_name":"web_get_parking_list","params":{"pageNumber":"'+(id+1)+'","pageSize":"10","parking_name":"'+search.parking_name+'","admin_name":"'+search.admin_name+'","city_id":"'+search.city_id+'"}}'
                    },
                    contentType:"application/x-www-form-urlencoded;charset=utf-8", 
                    beforeSend:function(xhr){
                        parent.modal_loading("正在获取数据！");
                    },
                    success:function(data,status,xhr){
                        
                    },
                    error: function (a, b, c) {
                        console.log(c);
                     }
                     
                });*/

            }
        });
};
