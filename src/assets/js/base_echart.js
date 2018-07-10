/*
* @Author: Administrator
* @Date:   2017-07-31 16:02:57
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-12 12:47:45
*/

// 'use strict';
var loading={
	    text: '',
	    color: '#c23531',
	    textColor: '#000',
	    maskColor: 'rgba(255, 255, 255, 0.8)',
	    zlevel: 0
	};
//bar-pie混合
function bar_pie_box(opt){
	// var box=document.getElementById(opt.id);
	// var myChart=echarts.init(box);

	var option = {
	    tooltip : {
	        trigger: 'axis',
	        formatter:'{b0}: {c0}'+opt.units[1]
	    },
	    toolbox: {
	        show : true,
	        right: 15,
	        feature : {
	            mark : {show: true},
	            // dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true}
	            // saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    legend: {
	        data:opt.item,
	        left:'left',
	        orient:opt.orient||'horizontal'
	    },
	    grid: [{
	        top: 50,
	        width: '55%',
	        height: '80%',
	        bottom: '0%',
	        left: '40%',
	        containLabel: true
	    }],
	    xAxis : [
	        {
	            type : 'category',
	            splitLine : {show : false},
	            data : opt.xaxis,
	            name:opt.xy[0]
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            position: 'left',
	            name:opt.xy[1]
	        }
	    ],
	    series : [
	        {
	            name:'次数',
	            type:'bar',
	            data:opt.bardata.y0,
	            animation:true,

	            itemStyle :　{
	                normal : {
	                    color: function(params) {
	                        var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
	                        return colorList[params.dataIndex]
	                    },
	                }

	            },
	            label: {
	                normal: {
	                    show: true,
	                    position: 'outside',
	                    formatter: '{c}'+opt.units[1]
	                }
	            }

	        },
	        {
	            name:'占比',
	            type:'pie',
	            tooltip : {
	                trigger: 'item',
	                formatter: '{a} <br/>{b} : {c} ({d}%)'
	            },
	            labelLine :{
	            	normal:{
	            		length:10,
	            		length2:5
	            	}
	            },
	            center: ['20%','50%'],
	            radius : [0, 100],
	            itemStyle :　{
	                normal : {
	                    labelLine : {
	                        length : 20
	                    }
	                }

	            },
	            label: {
	                normal: {
	                    show: true,
	                    position: 'outside',
	                    formatter:function (params) {                       
	                      return params.name+(params.percent - 0) + '%'
	                    }
	                }
	            },
	            data:opt.piedata
	        }
	    ]
	};

	// myChart.setOption(option);
	return option;
}

//柱状图
function bar_box(opt){
	// var box=document.getElementById(opt.id);
	// var myChart=echarts.init(box);
	var option = {
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {
	            type: opt.mtype||'line'
	        },
	        formatter: opt.formatter||'{b}'+opt.units[0]+'<br />{a0}: {c0}'+opt.units[1]+'<br />{a1}: {c1}'+opt.units[1]
	    },
	    legend: {
	        data:opt.item,
	        left:'center',
	        orient:opt.orient||'horizontal'
	    },
	    toolbox: {
	        show : true,
	        right: 15,
	        feature : {
	            mark : {show: true},
	            // dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: opt.tbmagic||['line', 'bar', 'stack', 'tiled']},
	            restore : opt.restore||{show:true}
	            // saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	        	name :opt.xy[0],
	            type : 'category',
	            data : opt.xaxis,
	        }
	    ],
	    yAxis : [
	        {
	        	name :opt.xy[1],
	            type : 'value'
	        }
	    ],
	    dataZoom: [{
	        type: 'inside',
	        start: 0,
	        end: opt.dzoom||20,
	        disabled:true
	    }, {
	        start: 0,
	        end: opt.dzoom||20,
	        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
	        handleSize: '80%',
	        handleStyle: {
	            color: '#fff',
	            shadowBlur: 3,
	            shadowColor: 'rgba(0, 0, 0, 0.6)',
	            shadowOffsetX: 2,
	            shadowOffsetY: 2
	        }
	    }],
	    series :opt.series
	};

	// myChart.setOption(option);
	return option;
}

//折线图
function line_box(opt){
	// var box=document.getElementById(opt.id);
	// var myChart=echarts.init(box);
	var option = {
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {
	            type: opt.mtype||'line'
	        },
	        formatter: opt.formatter||'{b}<br />{a}: {c}'
	    },
	    legend: {
	        data:opt.item,
	        left:opt.left||'center',
	        orient:opt.orient||'horizontal'
	    },
	    toolbox: {
	        show : true,
	        right: 15,
	        feature : {
	            mark : {show: true},
	            // dataView : {show: true, readOnly: false},
	            magicType : {show: true,type: opt.tbmagic||['line', 'bar', 'stack', 'tiled']},
	            restore : {show: true}
	            // saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	        	name :opt.xy[0],
	            type :'category',
	            data : opt.xaxis,
	            max:5,
	            axisLabel:{
	            	interval:opt.interval||"auto"
	            },
	            axisTick: {
	            	show:false
	            }
	        }
	    ],
	    yAxis : [
	        {
	        	name :opt.xy[1],
	            type : 'value',
	            axisTick: {
	            	show:false
	            }
	        }
	    ],
	    dataZoom: [{
	        type: 'inside',
	        start: 0,
	        end: opt.dzoom||20,
	        disabled:false
	    }, {
	        start: 0,
	        end: opt.dzoom||20,
	        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
	        handleSize: '80%',
	        handleStyle: {
	            color: '#fff',
	            shadowBlur: 3,
	            shadowColor: 'rgba(0, 0, 0, 0.6)',
	            shadowOffsetX: 2,
	            shadowOffsetY: 2
	        }
	    }],
	    series :opt.series
	};

	// myChart.setOption(option);
	return option;
}

//折线图item
function line_box_category(opt){
	// var box=document.getElementById(opt.id);
	// var myChart=echarts.init(box);
	var option = {
	    tooltip : {
	    	show:false,
	        trigger: 'axis',
	        axisPointer : {
	            type: opt.mtype||'line'
	        },
	        formatter: opt.formatter||'{b}<br />{a}: {c}'
	    },
	    legend: {
	        data:opt.item,
	        left:opt.left||'center',
	        orient:opt.orient||'horizontal'
	    },
	    toolbox: {
	        show : true,
	        right: 15,
	        feature : {
	            mark : {show: true},
	            // dataView : {show: true, readOnly: false},
	            magicType : {show: true,type: opt.tbmagic||['line', 'bar', 'stack', 'tiled']},
	            restore : {show: true}
	            // saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	        	name :opt.xy[0],
	            type :'category',
	            data : opt.xaxis,
	            max:5,
	            axisLabel:{
	            	interval:opt.interval||"auto"
	            },
	            axisTick: {
	            	show:false
	            }
	        }
	    ],
	    yAxis : [
	        {
	        	name :opt.xy[1],
	            type : 'value',
	            minInterval:1,
	            boundaryGap: false,
	            // data : ['异常','正常'],
	            axisLabel: {
		            formatter: opt.ylabel||function (value, index) {
					    if (value == 1) {
					        return '正常';
					    }else{
					    	return '异常';
					    }
					    
					}
		        },
	            axisTick: {
	            	show:false
	            }
	        }
	    ],
	    dataZoom: [{
	        type: 'inside',
	        start: 0,
	        end: opt.dzoom||20,
	        disabled:false
	    }, {
	        start: 0,
	        end: opt.dzoom||20,
	        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
	        handleSize: '80%',
	        handleStyle: {
	            color: '#fff',
	            shadowBlur: 3,
	            shadowColor: 'rgba(0, 0, 0, 0.6)',
	            shadowOffsetX: 2,
	            shadowOffsetY: 2
	        }
	    }],
	    series :opt.series
	};

	// myChart.setOption(option);
	return option;
}


//显示比例(datazoom)
function datazoom(datalength){
	var zoom=20;
	if(datalength<=13){
		zoom=100;
	}else{
		zoom=parseInt(100*13/datalength);
		if(zoom==0){
			zoom=1;
		}
	}
	return zoom;
}


//自适应宽度
function autoW(itemN,dom){
	if(itemN*30>820){
		dom.style.width=itemN*30+"px";
	}
}


//base_select
function select_type(type,year,month,day){
    if(type.val()==1){
        year.show();
        month.hide();
        day.hide();
    };
    if(type.val()==2){
        year.show();
        month.show();
        day.hide();
    };
    if(type.val()==3){
        year.show();
        month.show();
        day.show();
    };
}

//生成时间
function getymd(sel1,sel2,sel3){
   function creatDate()
   {
   	var myDate=new Date();
   	var curYear=myDate.getFullYear();
     //生成1950年-2016年
     for(var i = curYear; i >= curYear-20; i--)
     {
       //创建select项
       var option = document.createElement('option');
       option.setAttribute('value',i);
       option.innerHTML = i;
       sel1.appendChild(option);
     }
     //生成1月-12月
     for(var i = 1; i <=12; i++){
       var option1 = document.createElement('option');
       option1.setAttribute('value',i);
       option1.innerHTML = i;
       sel2.appendChild(option1);
     }
     //生成1日—31日
     for(var i = 1; i <=31; i++){
       var option2 = document.createElement('option');
       option2.setAttribute('value',i);
       option2.innerHTML = i;
       sel3.appendChild(option2);
     }
   }
   creatDate();
   //保存某年某月的天数
   var days;
 
   //月份点击 绑定函数
   sel2.onclick = function()
   {
     //计算天数的显示范围
     //如果是2月
     if(sel2.value == 2)
     {
       //判断闰年
       if((sel1.value % 4 === 0 && sel1.value % 100 !== 0) || sel1.value % 400 === 0)
       {
         days = 29;
       }
       else
       {
         days = 28;
       }
       //判断小月
     }else if(sel2.value == 4 || sel2.value == 6 ||sel2.value == 9 ||sel2.value == 11){
       days = 30;
     }else{
       days = 31;
     }
 
     //增加或删除天数
     //如果是28天，则删除29、30、31天(即使他们不存在也不报错)
     if(days == 28){
       sel3.remove(31);
       sel3.remove(30);
       sel3.remove(29);
     }
     //如果是29天
     if(days == 29){
       sel3.remove(31);
       sel3.remove(30);
       //如果第29天不存在，则添加第29天
       if(!sel3.options[29]){
         sel3.add(new Option('29','29'),null)
       }
     }
     //如果是30天
     if(days == 30){
       sel3.remove(31);
       //如果第29天不存在，则添加第29天
       if(!sel3.options[29]){
         sel3.add(new Option('29','29'),null)
       }
       //如果第30天不存在，则添加第30天
       if(!sel3.options[30]){
         sel3.add(new Option('30','30'),null)
       }
     }
     //如果是31天
     if(days == 31){
       //如果第29天不存在，则添加第29天
       if(!sel3.options[29])
       {
         sel3.add(new Option('29','29'),null)
       }
       //如果第30天不存在，则添加第30天
       if(!sel3.options[30])
       {
         sel3.add(new Option('30','30'),null)
       }
       //如果第31天不存在，则添加第31天
       if(!sel3.options[31])
       {
         sel3.add(new Option('31','31'),null)
       }
     }
   }

}




//柱状图
function newbar_box(opt){
	// var box=document.getElementById(opt.id);
	// var myChart=echarts.init(box);
	var option = {
		color:['#299cec','#ce89fe','#ff9434','#5eddc0','#5ab4b4'],
		title : {
	        text: opt.title||"",
	        left:'right',
	        textStyle:{
	        	color:"#299ceb",
	        	fontSize:"12",
	        	fontWeight:"normal"
	        }
	    },
	    tooltip : {
	    	show:false||opt.showTool,
	        trigger: 'axis',
	        axisPointer : {
	            type: opt.mtype||'line'
	        },
	        formatter: opt.formatter||'{b}'+opt.units[0]+'<br />{a0}: {c0}'+opt.units[1]+'<br />{a1}: {c1}'+opt.units[1]
	    },
	    legend: {
	        data:opt.item,
	        left:'center',
	        orient:opt.orient||'horizontal'
	    },
	    grid: {
	        top: 30,
	        left: '1%',
	        right: '50',
	        bottom: 30,
	        containLabel: true
	    },
	    /*toolbox: {
	        show : true,
	        right: 15,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: opt.tbmagic||['line', 'bar', 'stack', 'tiled']},
	            restore : opt.restore||{show:true}
	            saveAsImage : {show: true}
	        }
	    },*/
	    calculable : true,
	    xAxis : [
	        {
	        	name :opt.xy[0],
	            type : 'category',
	            data : opt.xaxis,
	            max:opt.max||14,
	            axisTick: {
	            	show:false
	            },
	            axisLabel:{
	            	interval:0,
	            	rotate:0
	            }
	        }	
	    ],
	    yAxis : [
	        {
	        	name :opt.xy[1],
	            type : 'value',
	            axisTick: {
	            	show:false
	            }
	        }
	    ],
	    label:{
	    	normal:{
	    		show:true,
	    		position: 'top'
	    	}
	    },
	    dataZoom: [{
	        type: 'inside',
	        start: 0,
	        end: opt.dzoom||100,
	        disabled:opt.diszoom?false:true
	    }],
	    series :opt.series
	};

	// myChart.setOption(option);
	return option;
}

//折线图
function newline_box(opt){
	// var box=document.getElementById(opt.id);
	// var myChart=echarts.init(box);
	var option = {
		color:opt.color||['#cf89ff','#5edbff','#ff9434','#5ab4b4','#b35ab4','#ff5858','#ff9873'],
		title : {
	        text: opt.title||"",
	        left:'right',
	        textStyle:{
	        	color:"#299ceb",
	        	fontSize:"12",
	        	fontWeight:"normal"
	        }
	    },
	    tooltip : {
	        trigger: 'item',
	        padding:[5,10],
	        axisPointer : {
	            type:opt.mtype||'line'
	        },
	        formatter: opt.formatter||'{b}'+opt.units[0]+'<br />{a0}: {c0}'+opt.units[1]+'<br />{a1}: {c1}'+opt.units[1]
	    },
	    legend: {
	        data:opt.item,
	        width:"85%",
	        left:opt.left||'center',
	        orient:opt.orient||'horizontal'
	    },
	    grid: {
	        top: opt.gtop||30,
	        left: '1%',
	        right: '50',
	        bottom: 20,
	        containLabel: true
	    },
	    calculable : true,
	    xAxis : [
	        {
	        	name :opt.xy[0],
	            type : 'category',
	            data : opt.xaxis,
	            boundaryGap: false,
	            max:13,
	            axisLabel:{
	            	interval:opt.interval||"auto"
	            },
	            axisTick: {
	            	show:false
	            }
	        }
	    ],
	    yAxis : [
	        {
	        	name :opt.xy[1],
	            type : 'value',
	            axisLabel: {
		            formatter: function (value, index) {
					    // 格式化成月/日，只在第一个刻度显示年份
					    if (index === 0) {
					        return value;
					    }
					    return value+' %';
					}
		        },
	            axisTick: {
	            	show:false
	            }
	        }
	    ],
	    /*dataZoom: [{
	        type: 'inside',
	        start: 0,
	        end: opt.dzoom||20,
	        disabled:true
	    }, {
	        start: 0,
	        end: opt.dzoom||20,
	        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
	        handleSize: '80%',
	        handleStyle: {
	            color: '#fff',
	            shadowBlur: 3,
	            shadowColor: 'rgba(0, 0, 0, 0.6)',
	            shadowOffsetX: 2,
	            shadowOffsetY: 2
	        }
	    }],*/
	    series :opt.series
	};

	// myChart.setOption(option);
	return option;
}





//search_select
function select_type_search(type,year,month,day){

	if(type.val()==1){
        year.show();
        month.hide();
        day.hide();
    };
    if(type.val()==2){
        year.hide();
        month.show();
        day.hide();
    };
    if(type.val()==3){
        year.hide();
        month.hide();
        day.show();
    };

}

/*keybox*/
function key_spacenum(keyid){
	$(keyid+" .keyinput").on("input focus",function(){
	    var html="";
	    var val=$(keyid+" .keyinput").val().trim();
	    $(keyid+" .keybox").show();
	    if(val){
	        $.ajax({
		        url :  get_api_rep(),
		        async:true,
		        cache:false,
		        // timeout:2000,
		        type : "POST",
		        dataType : "json",
		        data: {
		            params:'{"api_name":"space_fuzzy_search","params":{"spaceNum":"'+val+'"}}'
		        },
		        contentType : "application/x-www-form-urlencoded;charset=utf-8",
		        success : function(data) //data是返回数据处理后的结果 
		        {
		            var result=data.result;
		            if(data.code!=100||result.length==0){
		            	$(keyid+" .keyinput").attr("data-id","");
		                return;
		            };
	                for(var i=0;i<result.length;i++){
	                    html+='<li style="cursor:default;" data-id="'+result[i].spaceId+'">'+result[i].spaceNum+'</li>'
	                };
	                $(keyid+" .keybox").html(html);
	                if($(keyid+" .keyinput").val()==result[0].spaceNum){
	                	$(keyid+" .keyinput").attr("data-id",result[0].spaceId);
	                }else{
	                	$(keyid+" .keyinput").attr("data-id","");
	                }

		        },
		        error: function (a, b, c) {
		            console.log(c);
		        }
		    });


	    }
	});

	$(keyid+" .keybox").on("click","li",function(){
		console.log('s',$(this).text())
		$(keyid+" .keyinput").val($(this).text());
		$(keyid+" .keyinput").attr("data-id",$(this).attr("data-id"));
		$(keyid+" .keybox").html("");
	});

	$(document).on("click",function(){
	    $(keyid+" .keybox").hide();
	});
	$(keyid+" .keyinput").click(function(event) {
		event.stopPropagation ? event.stopPropagation() : event.cancelBubble=true;
	});

}



// axis-time
/*function x_time(berth_data){
	console.log(berth_data)
	var bsdate=berth_data.beginDate.split("-").join(",");
    var base = +new Date(bsdate);
    var oneDay = 24 * 3600 * 1000;
    var oneMonth = 31*24 * 3600 * 1000;
    var oneYear = 365*24 * 3600 * 1000;
    date = [berth_data.beginDate];
    for (var i = 1; i < 60; i++) {
        if(berth_data.type==1){
            var now = new Date(base += oneYear);
            date.push([now.getFullYear()].join('-'));
        };
        if(berth_data.type==2){
            var now = new Date(base += oneMonth);
            var mon2=now.getMonth() + 1<10 ? "0"+(now.getMonth() + 1) : now.getMonth() + 1;
            date.push([now.getFullYear(), mon2].join('-'));
        };
        if(berth_data.type==3){
            var now = new Date(base += oneDay);
            var mon3=now.getMonth() + 1<10 ? "0"+(now.getMonth() + 1) : now.getMonth() + 1;
            var day3=now.getDate()<10 ? "0"+(now.getDate()) : now.getDate();
            date.push([now.getFullYear(), mon3, day3].join('-'));
        };
    }
    return date
}*/



