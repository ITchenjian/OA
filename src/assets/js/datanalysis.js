/*
* @Author: Administrator
* @Date:   2018-03-29 14:37:02
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-12 12:44:09
*/
// 'use strict';
/*磁卡*/
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
            search.cardId=$("#magnum").val();
        },
        error: function (a, b, c) {
            // parent.modal_loading("error");
            console.log(c);
         }
         
    });
}

/*全局变量*/
var myChart1,myChart2;

//参观数据分析
var datanaly_fun=function(){
    this.id="datanaly";
    this.showTool=false;
    this.title="",
    this.item=[''];
    this.units=['',''];
    this.xy=['项目','次数'];
    this.mtype='line';
    this.xaxis=['1','2','3','4','5','6','7','8','9','10','11','12'];
    this.ydata={
        y0:[15, 18, 20, 22, 10, 18, 16,15, 8, 12, 20, 26]
    };
    this.series=[
        {
            name:this.item[0],
            type:'bar',
            stack: null,
            data:this.ydata.y0,
            barGap:"1%",
            barWidth:20
        }
    ];
};
var datanaly_opt=new datanaly_fun();

//模块
function datanaly(){
    $.ajax({
        url :  get_api_urle(),
        async:true,
        cache:false,
        // timeout:2000,
        type : "POST",
        dataType : "json",
        data: {
            params:'{"api_name":"getDataAnalysis","params":{"card_number":"'+search.cardId+'","start_time":"'+search.startTime+'","end_time":"'+search.endTime+'"}}'
        },
        contentType : "application/x-www-form-urlencoded;charset=utf-8",
        beforeSend:function(xhr){
            myChart1.showLoading('default',loading);
        },
        success : function(data) //data是返回数据处理后的结果 
        {
            myChart1.hideLoading();
            if(data.code==130){
                window.parent.location.href="../../index.html";
                return;
            }else if(data.code!=100){
                return;
            };
            var result=data.result.list;
            var allitem=[];
            var seri=[];
            var tipbox="{b}<br />";
           

            var arrdata=[];
            var arrxaxis=[];
            var sum=0;


            if(result.length<=15){

            }else{
                datanaly_opt.diszoom=true;
                datanaly_opt.dzoom=datazoom(result.length);
                datanaly_opt.max="dataMax";
            };

            for(var k=0;k<result.length;k++){
            // for(var k=0;k<3;k++){
                /*arrdata.push(100);
                arrxaxis.push("产品展示");*/
                arrdata.push(result[k].count);
                arrxaxis.push(result[k].remarks);
                sum+=result[k].count;
            };

            seri.push({name:"参观次数",type:'bar',stack: null,data:arrdata,barGap:"1%",barWidth:30});
            tipbox+="{a"+0+"}: {c"+0+"}<br />";
            
            datanaly_opt.xaxis=arrxaxis;
            datanaly_opt.series=seri;
            datanaly_opt.title="累计观看："+sum+"次";

            datanaly_opt.formatter=tipbox;
            
            var option1=newbar_box(datanaly_opt);
            myChart1.setOption(option1);


        },
        error: function (a, b, c) {
            myChart1.hideLoading();
            parent.layer.msg('网络异常', { time: 1000});
            console.log(c);
        }
    });
    
}

//初始化
function datanalyinit(){
    var box1=document.getElementById(datanaly_opt.id);
    myChart1=echarts.init(box1);
    
    datanaly();
}

var search={
	startTime:"",
	endTime:"",
	cardId:$("#magnum").val()
}

getMagcard();
datanalyinit();


//查询接口调用
$("#search_btn").click(function(event) {
    search.startTime=$("#bdate").val();
    search.endTime=$("#edate").val();
    search.cardId=$("#magnum").val();
    //接口
    datanaly();
    
});



/*参观人数分析折线图*/
var itemsper_fun=function(){
    this.id="itemsper";
    this.color=['#2db5ed','#cb2ded','#17cb28','#17cb28','#5edbff','#ff9434','#ff5858','#b35ab4'];
    this.item=[];
    this.title='';
    this.mtype='cross';
    this.gtop=60;
    this.units=['','百分比'];
    this.xy=['','百分比'];
    this.mtype='line';
    this.xaxis=['1','2','3','4','5','6','7','8','9','10','11','12'];
    this.ydata={
        y0:[15, 18, 20, 22, 10, 18, 16,15, 8, 12, 20, 26],
        y1:[10, 22, 25, 20, 14, 20, 25,5, 22, 18, 26, 24],
    };
    this.series=[
        {
            name:this.item[0],
            type:'line',
            stack: null,
            data:this.ydata.y0,
            barGap:"1%",
            smooth:true
        },
        {
            name:this.item[1],
            type:'line',
            stack: null,
            data:this.ydata.y1,
            barGap:"1%",
            smooth:true
        }
    ];
};
var itemsper_opt=new itemsper_fun();

//模块
function itemsper(){
    $.ajax({
        url :  get_api_urle(),
        async:true,
        cache:false,
        // timeout:2000,
        type : "POST",
        dataType : "json",
        data: {
            params:'{"api_name":"getDataAnalysis","params":{"card_number":"'+search.cardId+'","start_time":"'+search.startTime+'","end_time":"'+search.endTime+'"}}'
        },
        contentType : "application/x-www-form-urlencoded;charset=utf-8",
        beforeSend:function(xhr){
            myChart1.showLoading('default',loading);
        },
        success : function(data) //data是返回数据处理后的结果 
        {
            myChart1.hideLoading();
            if(data.code==130){
                window.parent.location.href="../../index.html";
                return;
            }else if(data.code!=100){
                return;
            };
            var resultCount=data.result.count;
            var result=data.result.map1;

            //折线
            var allitem=[];
            
            var seri=[];
            var tipbox="{b}<br/>";
            
            //类目设置
            
            for(var j=0;j<result.lists.length;j++){
                var arrdata=[0];
                var xaxisData=[''];
                for(var k=0;k<result.lists[j].array.length;k++){
                    
                    arrdata.push(result.lists[j].array[k].y);
                    xaxisData.push(result.lists[j].array[k].x);
                };
                allitem.push(result.lists[j].remarks);


                seri.push({name:result.lists[j].remarks,type:'line',stack: null,data:arrdata,smooth:true});
                tipbox+="{a"+j+"}: {c"+j+"}<br />";
            };

            var total=resultCount;
            itemsper_opt.title="参观人数："+total+"人";

            itemsper_opt.item=allitem;

            itemsper_opt.xaxis=xaxisData;
            itemsper_opt.series=seri;
            // itemsper_opt.formatter=tipbox;
            itemsper_opt.formatter=function (params){
                // console.log(params);

                var tipmsg=params.seriesName+": "+params.data+"%";
                return tipmsg;

                /*if(params[0].name<10){
                    var tipmsg=search.beginDate+"-0"+params[0].name+"<br />";
                }else{
                    var tipmsg=search.beginDate+"-"+params[0].name+"<br />";
                }
                var tiptotal=0;
                for(var i=0;i<params.length;i++){
                    tipmsg+=(params[i].seriesName+": "+params[i].data+"次<br />");
                    tiptotal+=params[i].data;
                }
                return tipmsg+"总计: "+tiptotal+"次";*/
            }
            
            var option2=newline_box(itemsper_opt);
            myChart2.setOption(option2,true);


        },
        error: function (a, b, c) {
            myChart1.hideLoading();
            parent.layer.msg('网络异常', { time: 1000});
            console.log(c);
        }
    });
    
}

//初始化
function itemsperinit(){
    var box2=document.getElementById(itemsper_opt.id);
    myChart2=echarts.init(box2);
    
    itemsper();
}


itemsperinit();


