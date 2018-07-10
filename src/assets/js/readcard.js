/*
* @Author: Administrator
* @Date:   2017-10-15 14:09:04
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-10 14:04:40
*/
var shedId=location.search.split("=")[1];
console.log(shedId);
$('#addreadModal').on('hidden.bs.modal', function (e) {
  	$("#addreadcard_form").Validform().resetForm();
  	$("#addreadModal .Validform_checktip").html("");
})

function init() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var gj = go.GraphObject.make;  // for conciseness in defining templates
    myDiagram =gj(go.Diagram, "myDiagramDiv",  // Diagram refers to its DIV HTML element by id
    {
      	initialContentAlignment: go.Spot.TopLeft,
      	allowHorizontalScroll:true,
      	allowVerticalScroll:true,
      	allowDelete:false,
      	initialScale:0.45,
      	isEnabled:true,
      	minScale:0.1,
      	maxScale:2.5,
      	"animationManager.isEnabled":false,
       	"grid.visible":false, //table
      	"clickCreatingTool.archetypeNodeData": { key: "n" },
      	"clickCreatingTool.isDoubleClick": false,
      	"commandHandler.copiesTree":false,
       	"commandHandler.deletesTree":false,
       	"toolManager.mouseWheelBehavior":go.ToolManager.WheelZoom,
      	"undoManager.isEnabled": true,
      	maxSelectionCount: 1,
      	defaultCursor:"auto",
      	padding:0

    });

    //增加底图

    $("#addbkg").click(function(event) {
    	$("#bg_zone_id").val($("#shedsel").val());
    });
    $("#bg_true").click(function() {
		/*调用接口*/
		$("#addbgcard_form").ajaxSubmit({
			url : get_api_bkg(),
	        type : 'POST',
	        dataType : "json",
	        clearForm: true,  
	        success : function(data) { 
	        	jump_index(data);
	        	if(data.code!=100) return;
	            var hf=window.location.href;
				window.location.href=hf;
	        }  
		});

	    $("#addbgModal").modal('hide');
	    return false;

	});

	//创建新节点完成事件PartCreated -单击空白处
	myDiagram.addDiagramListener("PartCreated", function(e) {
        var Select_Port = e.subject.part.data;
        // var Select_Port = e.subject;
        console.log(Select_Port);
        if(true){
        	myDiagram.remove(e.subject);//删除节点
        }
		$("#readbtn").click();
		$("#x_val").val(Select_Port.loc.x);
		$("#y_val").val(Select_Port.loc.y);

		bindequ($("#shedsel").val(),"");


    });

	//删除读卡器
	$("#delreadcard").click(function(event) {
		var zone_id=$("#shedsel").val();
		$.ajax({
			url:get_api_urle(),
			async:true,
			cache:false,
			// timeout:2000,
			type:"post",
			dataType:"json",
			data: {
		    	params:'{"api_name":"preview","params":{"zone_id":"'+zone_id+'"}}'
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
				var html='';
				var arr=[];
				var readE=result.equipmentList;
				for(var i=0;i<readE.length;i++){
					arr.push('<option value="'+readE[i].equId+'">'+readE[i].deviceName+'</option>')
				}
				html=arr.join("");
				$("#read_name").html(html);
			},
			error: function (a, b, c) {
				// parent.modal_loading("error");
			 	console.log(c);
			 }
			 
		});
	});

	$("#del_true").click(function(event) {
		var read_id=$("#read_name").val();
		$.ajax({
			url:get_api_urle(),
			async:true,
			cache:false,
			// timeout:2000,
			type:"post",
			dataType:"json",
			data: {
		    	params:'{"api_name":"deleteEquipment","params":{"equ_id":"'+read_id+'"}}'
		    },
			contentType:"application/x-www-form-urlencoded;charset=utf-8", 
			beforeSend:function(xhr){
				// parent.modal_loading("正在获取数据！");
			},
			success:function(data,status,xhr){
				// parent.modal_loading("");
				jump_index(data);
				if(data.code!=100) return;
				trajedata($("#shedsel").val(),"","",false);
			},
			error: function (a, b, c) {
				// parent.modal_loading("error");
			 	console.log(c);
			 }
			 
		});
		$("#delreadModal").modal('hide');
	});

	//获取绑定设备
	function bindequ(zone_id,equ_id){
		$.ajax({
			url:get_api_url(),
			async:true,
			cache:false,
			// timeout:2000,
			type:"post",
			dataType:"json",
			data: {
		    	params:'{"api_name":"deviceList","params":{"zone_id":"'+zone_id+'","equ_id":"'+equ_id+'"}}'
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
				var arr=[];
				var html='';
				if(equ_id!=""){
					$("#equip_remarks").val(result.equipment.remarks);
					for(var i=0;i<result.lists.length;i++){
						arr.push('<option value="'+result.lists[i].gatewayId+','+result.lists[i].onerankdevDevSn+'">'+result.lists[i].onerankdevDevSn+'</option>');
					}
				};
				for(var i=0;i<result.onerankdevList.length;i++){
					arr.push('<option value="'+result.onerankdevList[i].gatewayId+','+result.onerankdevList[i].onerankdevDevSn+'">'+result.onerankdevList[i].onerankdevDevSn+'</option>');
				};
				
				html=arr.join("");
				$("#dev_sn").html(html);
				
			},
			error: function (a, b, c) {
				// parent.modal_loading("error");
			 	console.log(c);
			 }
			 
		});
	}
	

	//添加、编辑确认
	$("#add_true").click(function(event) {
		if(!readsetinfo) return;
		$.ajax({
			url:get_api_url(),
			async:true,
			cache:false,
			// timeout:2000,
			type:"post",
			dataType:"json",
			data: {
		    	params:'{"api_name":"addOrModifyEquipment","params":{"zone_id":"'+$("#shedsel").val()+'","equ_id":"'+$("#readcard_id").val()+'","devName":"'+$("#readcard_name").val()+'","longitude":"'+$("#x_val").val()+'","latitude":"'+$("#y_val").val()+'","gatewayId":"'+$("#dev_sn").val()+'","remarks":"'+$("#equip_remarks").val()+'","type":"1"}}'
		    },
			contentType:"application/x-www-form-urlencoded;charset=utf-8", 
			beforeSend:function(xhr){
				// parent.modal_loading("正在获取数据！");
			},
			success:function(data,status,xhr){
				// parent.modal_loading("");
				jump_index(data);
				if(data.code!=100) return;
				trajedata($("#shedsel").val(),"","",false);
					
				
			},
			error: function (a, b, c) {
				// parent.modal_loading("error");
			 	console.log(c);
			 }
			 
		});
		readsetinfo=false;
		$("#addreadModal").modal('hide');
	});

    //拖动节点改变位置
    
  	myDiagram.addDiagramListener("SelectionMoved", function(e) {
        // var Select_Port = e.subject.part.data;
        var Select_Port = e.subject.ji.key.data;
        console.log(Select_Port);
        
        //传值ajax
  		$.ajax({
			url:get_api_urle(),
			async:true,
			cache:false,
			// timeout:2000,
			type:"post",
			dataType:"json",
			data: {
		    	params:'{"api_name":"updateEquipment","params":{"equ_id":"'+Select_Port.id+'","longitude":"'+Select_Port.loc.x+'","latitude":"'+Select_Port.loc.y+'"}}'
		    },
			contentType:"application/x-www-form-urlencoded;charset=utf-8", 
			beforeSend:function(xhr){
				// parent.modal_loading("正在获取数据！");
			},
			success:function(data,status,xhr){
				// parent.modal_loading("");
				jump_index(data);
				if(data.code!=100){
					setTimeout(function(){
						myDiagram.commandHandler.undo() //重做
					}, 0);
				};
				// trajedata($("#shedsel").val(),"","");
			},
			error: function (a, b, c) {
				// parent.modal_loading("error");
			 	console.log(c);
			 }
			 
		});

		
    });


    // define the node template
    myDiagram.nodeTemplate =gj(go.Node, "Auto",
    	{
    		padding:0
    	},
      	new go.Binding("location", "loc").makeTwoWay(),
      	// new go.Binding("location", "loc", go.Point.parse).makeTwoWay(),
      	{   locationSpot: go.Spot.Center,
      		toEndSegmentLength: 30, 
      		fromEndSegmentLength: 30,
      		click:function(e,node){
	      		console.log(node.data);
	    		$("#readbtn").click();
				$("#readcard_name").val(node.data.key);
				$("#readcard_id").val(node.data.id);
				$("#x_val").val(node.data.loc.x);
				$("#y_val").val(node.data.loc.y);
				bindequ($("#shedsel").val(),node.data.id);
	      	}
      	},
      	gj(go.Shape, "Ellipse",
      	{
      		name: "OBJSHAPE",
      		fill: "#299ceb",
      		stroke: "#299ceb",
      		// opacity: 0,
      		desiredSize: new go.Size(50, 50)
      	}),
      	gj(go.Picture,{
      		source: "../../images/readcard.png",
      		width:40,
			height:40
      	}),
      	gj(go.TextBlock,{ 
      			textAlign:"center",
      			// width:50,
      			// height:50,
      			stroke: '#000',
      			font: "normal small-caps 200 12px Georgia, Serif"
      		},
      		new go.Binding("text", "key")
      	)
	);
    // define the link template
   	myDiagram.linkTemplate =gj(go.Link,
		{
			selectionAdornmentTemplate:
			gj(go.Adornment,
				gj(go.Shape,
					{ isPanelMain: true, stroke: "dodgerblue", strokeWidth: 3 }),
				gj(go.Shape,
					{ toArrow: "Standard", fill: "dodgerblue", stroke: null, scale: 1 })
			),
			routing: go.Link.Normal,
			curve: go.Link.Bezier,
			toShortLength: 0
		},
		new go.Binding("points").makeTwoWay(),
      	gj(go.Shape,  //  the link shape
      	{ name: "OBJSHAPE" ,strokeWidth: 2, stroke: '#0782c9'}),
      	gj(go.Shape,  //  the arrowhead
      	{ name: "ARWSHAPE", toArrow: "Standard" }),

      	//line-lable设置
        gj(go.Panel, "Auto",
          gj(go.Shape,  // the label background, which becomes transparent around the edges
            {
              fill: gj(go.Brush, "Radial",
                      { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
              stroke: null
            }),
          gj(go.TextBlock, "transition",  // the label text
            {
              textAlign: "center",
              font: "9pt helvetica, arial, sans-serif",
              margin: 4,
              editable: false  // enable in-place editing
            },
            // editing the text automatically updates the model data
            new go.Binding("text","line").makeTwoWay())
        )
    );
      
	
/*ajax动态*/
	
	//大棚列表
	$.ajax({
		url:get_api_url(),
		async:true,
		cache:false,
		// timeout:2000,
		type:"post",
		dataType:"json",
		data: {
	    	params:'{"api_name":"web_get_area_level_list","params":{"pageNumber":"0","pageSize":"0","type":"1"}}'
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
				if(list[i].sceneId==shedId){
					arr.push('<option value="'+list[i].sceneId+'" selected>'+list[i].sceneName+'</option>');
				}else{
					arr.push('<option value="'+list[i].sceneId+'">'+list[i].sceneName+'</option>');
				}
			}
			html=arr.join("");
			$("#shedsel").html(html);

		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});


	//位置处理
	trajedata(shedId,"","",true);
	function trajedata(zone_id,starttime,endtime,bg){
		$.ajax({
			url:get_api_urle(),
			async:true,
			cache:false,
			// timeout:2000,
			type:"post",
			dataType:"json",
			data: {
		    	params:'{"api_name":"preview","params":{"zone_id":"'+zone_id+'","start_time":"'+starttime+'","end_time":"'+endtime+'"}}'
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

				var nodeArr=[];
				// var linkArr=[];
				var nodeObj={};

				var node=result.equipmentList;
				for(var i=0;i<node.length;i++){
					nodeObj={};
					nodeObj.id=node[i].equId;
					nodeObj.key=node[i].deviceName;
					var x=Number(node[i].longitude);
					var y=Number(node[i].latitude);
					nodeObj.loc=new go.Point(x,y);
					console.log(node[i].type);
					nodeObj.shape="Circle";
					nodeObj.desize=new go.Size(50, 50);
				
					nodeArr.push(nodeObj);
				}

				console.log(nodeArr);
				myDiagram.model = new go.GraphLinksModel();
				myDiagram.model.nodeKeyProperty="id";
				myDiagram.model.nodeDataArray=nodeArr;

				//背景
				if(result.backgoundImage&&bg){
					myDiagram.add(
				      	gj(go.Part, 
				      		{ layerName: "Background", 
				      		position: new go.Point(0, 0),
				      		selectable: false, 
				      		pickable: false 
				      		},
				      		gj(go.Picture, result.backgoundImage,{
				      			imageAlignment:go.Spot.TopLeft
				      		})
				      	)
				    );
				}
				
			},
			error: function (a, b, c) {
				// parent.modal_loading("error");
			 	console.log(c);
			 }
			 
		});
	};


	//切换大棚
	$("#shedsel").change(function(event) {
		var zoneId=$("#shedsel").val();
		window.location.href="./readcard.html?wd="+zoneId;
		// trajedata(zoneId,"","");
	});
	

}