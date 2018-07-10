/*
* @Author: Administrator
* @Date:   2018-03-20 11:09:55
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-17 17:22:41
*/
// 'use strict';
 
var localSearch=location.search.split("&");
// console.log(localSearch);

/*列表数据*/
var search={
    pageNumber:"1",
    pageSize:"4",
    devType:""
};

var devSn=localSearch[1].split("=")[1];
search.devType=localSearch[0].split("=")[1];



his_list(true,search.pageNumber);



/*echart*/
var myChart1;
//数据
var hisData_fun=function(){
	this.id="his_data";
	this.item=["设备数据"];
	this.units=['',''];
	this.xy=['时间','值'];
	this.xaxis=['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
	this.ydata={
		y0:[10, 22, 25, 20, 14, 20, 25,5, 22, 35, 26, 15,10, 22, 25, 20, 14, 20, 25,5, 22, 19, 26, 15, 20, 25,5, 22, 19, 26, 15]
	};
	this.mtype='line';
    this.tbmagic=['line', 'bar'];
    this.formatter='{b}'+this.units[0]+'<br />{a0}: {c0}'+this.units[1];
	this.series=[
        {
            name:this.item[0],
            type:'line',
            stack: null,
            data:this.ydata.y0
        }
    ];
};
var hisData_opt=new hisData_fun();


//初始化
function hisData1(){

    $.ajax({
        url:get_api_urle(),
        async:true,
        cache:false,
        // timeout:2000,
        type:"post",
        dataType:"json",
        data: {
            params:'{"api_name":"getSolarRadiationList","params":{"page_num":"0","page_limit":"0","dev_sn":"'+devSn+'","devType":"'+search.devType+'"}}'
        },
        contentType:"application/x-www-form-urlencoded;charset=utf-8", 
        beforeSend:function(xhr){
            myChart1.showLoading('default',loading);
        },
        success : function(data)
        {
            myChart1.hideLoading();
            if(data.code==130){
                window.parent.location.href="../../index.html";
                return;
            }else if(data.code!=100){
                return;
            };
            var result=data.result;
            if(!result.items.length) return;
            // var arrsum=[];
            var item=[];
            var formatter="";

            if(result.items[0].controlClass==1){
                item=["状态"];
                formatter='{b}<br />{a0}: {c0}';
                hisData_opt.ylabel=function (value, index) {if (value == 1) {return '开'}else{return '关'}};
			}else{
                if(result.items[0].devType=="173"){
                    item=["状态"];
                    formatter='{b}<br />{a0}: {c0}';
                }else if(result.items[0].devType=="85"){
                    item=["状态"];
                    formatter='{b}<br />{a0}: {c0}';
                    hisData_opt.ylabel=function (value, index) {if (value == 1) {return '有人'}else{return '无人'}};
                }else{
                    item[0]=result.items[0].devValue.split(":")[0];
                    formatter='{b}<br />{a0}: {c0} '+result.items[0].devValue.split(":")[1].split(" ")[1];
                }
            }

            var arrX=[];

            var arrAllItem=[];
            var arrItemV=[];
            
            var seri=[];
            for(var i=0;i<result.items.length;i++){
                arrX.push(result.items[i].storageTime);

                if(result.items[i].controlClass==1){
                    if(result.items[i].devValue=="0.0"||result.items[i].devValue=="0"){
                        arrItemV.push('1');
                    }else{
                        arrItemV.push('0');
                    }
                }else{
                    if(result.items[i].devType=="173"){
                        if(result.items[i].devValue=="1.0"){
                            arrItemV.push('1');
                        }else{
                            arrItemV.push('0');
                        }
                    }else if(result.items[i].devType=="85"){
                        if(result.items[i].devValue=="1.0"){
                            arrItemV.push('1');
                        }else{
                            arrItemV.push('0');
                        }
                    }else{
                        var devValue=result.items[i].devValue.split(":")[1].split(" ")[0];
                        arrItemV.push(devValue);
                    }
                }

                /*if(result.items[i].devValue=="正常"){
                    arrItemV.push(1);
                }else if(result.items[i].devValue=="浸水"){
                    arrItemV.push(0);
                }else{
                    var devValue=result.items[i].devValue.split(":")[1].split(" ")[0];
                    
                    arrItemV.push(devValue);
                }*/
                
            }
            arrAllItem.push(arrItemV);

            hisData_opt.xaxis=arrX;
            hisData_opt.dzoom=datazoom(arrX.length);
            hisData_opt.item=item;
            hisData_opt.formatter=formatter;
            // console.log(arrAllItem)
            for(var j=0;j<arrAllItem.length;j++){
                seri.push({name:item[j],type:'line',stack: null,data:arrAllItem[j],barMaxWidth:20,smooth:true});
            }
            hisData_opt.series=seri;

            // var option1=line_box(hisData_opt);

            if(result.items[0].controlClass==1){
                var option1=line_box_category(hisData_opt);
            }else{
                if(result.items[0].devType=="173"||result.items[0].devType=="85"){
                    var option1=line_box_category(hisData_opt);
                }else{
                    var option1=line_box(hisData_opt);
                }
            }

            myChart1.setOption(option1);

        },
        error: function (a, b, c) {
            myChart1.hideLoading();
            parent.layer.msg('网络异常', { time: 1000});
            console.log(c);
        }
    });
}


hisData();
//模块化
function hisData() {
    var box1=document.getElementById(hisData_opt.id);
        myChart1=echarts.init(box1);
	hisData1();
};


/*获取列表*/
function his_list(pag,pageN){
    $.ajax({
        url:get_api_urle(),
        async:true,
        cache:false,
        // timeout:2000,
        type:"post",
        dataType:"json",
        data: {
            params:'{"api_name":"getSolarRadiationList","params":{"page_num":"'+pageN+'","page_limit":"'+search.pageSize+'","dev_sn":"'+devSn+'","devType":"'+search.devType+'"}}'
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
                his_page(data.result.rowsCount,data.result.pageSize);
            }
            var list = data.result.items;
            var html="";
            var arr=[];
            for(var i=0;i<list.length;i++){
                arr.push('<tr>');
                arr.push('<td>'+list[i].storageTime+'</td>');


                if(list[i].controlClass==1){
                    if(list[i].devValue=="0.0"||list[i].devValue=="0"){
                        arr.push('<td>开</td>');
                    }else{
                        arr.push('<td>关</td>');
                    }
                }else{
                    if(list[i].devType=="173"){
                        if(list[i].devValue=="1.0"){
                            arr.push('<td>正常</td>');
                        }else{
                            arr.push('<td>异常</td>');
                        }
                    }else if(list[i].devType=="85"){
                        if(list[i].devValue=="1.0"){
                            arr.push('<td>有人</td>');
                        }else{
                            arr.push('<td>无人</td>');
                        }
                    }else{
                        var devValue=list[i].devValue.split(":")[1];
                        arr.push('<td>'+devValue+'</td>');
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