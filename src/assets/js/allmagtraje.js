/*
* @Author: Administrator
* @Date:   2017-10-15 14:09:04
* @Last Modified by:   Administrator
* @Last Modified time: 2018-01-29 12:06:19
*/
var readcardId=0;
var shedIdSpace=sessionStorage.getItem("shedIdSpace");
// function init() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var gj = go.GraphObject.make;  // for conciseness in defining templates
    myDiagram =gj(go.Diagram, "myDiagramDiv",  // Diagram refers to its DIV HTML element by id
    {
      	initialContentAlignment: go.Spot.TopLeft,
      	allowHorizontalScroll:true,
      	allowVerticalScroll:true,
      	allowDelete:false,
      	initialScale:0.4,
      	isEnabled:true,
      	isReadOnly: true,
      	minScale:0.1,
      	maxScale:2.5,
      	"animationManager.isEnabled":false,
       	"grid.visible":false, //table
      	"clickCreatingTool.archetypeNodeData": { key: "n" },
      	"clickCreatingTool.isDoubleClick": false,
      	"commandHandler.copiesTree":false,
       	"commandHandler.deletesTree":false,
       	// "toolManager.mouseWheelBehavior":go.ToolManager.WheelZoom,
      	"undoManager.isEnabled": true,
      	maxSelectionCount: 1,
      	defaultCursor:"auto",
      	padding:0

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
				if(node.data.type==1){
					readcardId=node.data.id.split(":")[1];
					magpass(true,1,10,readcardId);
					
				}
	      	}
      	},
      	gj(go.Shape, 
      	{
      		figure:"Rectangle",
      		name: "OBJSHAPE",
      		stroke: "#fff",
      		opacity: 0,
      		desiredSize: new go.Size(50, 50)
      	},
      	new go.Binding("figure","shape").makeTwoWay(),
      	new go.Binding("desiredSize","desize").makeTwoWay()),
      	gj(go.Picture,{
	      		source: "../../images/readcard.png",
	      		margin: 0
	      	},
	      	new go.Binding("source", "src")
      	),
      	gj(go.TextBlock,{
      		textAlign:"center",
      		// width:50,
      		// height:50,
      		stroke: '#000',
      		font: "normal small-caps 200 12px Georgia, Serif"
      	},
      	new go.Binding("text", "key"))
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
      
	
	/*缩放*/
	$("#scale_zoom").change(function(event) {
		myDiagram.scale=Number($(this).val());
	});


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
				if(list[i].sceneId==shedIdSpace){
					arr.push('<option value="'+list[i].sceneId+'" selected>'+list[i].sceneName+'</option>');
				}else{
					arr.push('<option value="'+list[i].sceneId+'">'+list[i].sceneName+'</option>');
				}
			};
			html=arr.join("");
			$("#shedsel").html(html);
			sessionStorage.removeItem("shedIdSpace");
			trajedata($("#shedsel").val(),"","");

		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});



	//位置处理
	function trajedata(zone_id,starttime,endtime){
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
				var nodeObj={};
				var manObj={};

				var node=result.equipmentList;
				for(var i=0;i<node.length;i++){
					nodeObj={};
					nodeObj.id=node[i].equId;
					nodeObj.key=node[i].deviceName;
					var x=Number(node[i].longitude);
					var y=Number(node[i].latitude);
					nodeObj.loc=new go.Point(x,y);

					nodeObj.shape="Rectangle";
					nodeObj.desize=new go.Size(50, 50);
					nodeObj.type=node[i].type;
					
					nodeArr.push(nodeObj);
				}

				var man=result.cardNumberDataList;
				for(var j=0;j<man.length;j++){
					manObj={};
					manObj.id="m:"+man[j].equId;
					manObj.key="";
					var x=Number(man[j].longitude);
					var y=Number(man[j].latitude)+50;
					manObj.loc=new go.Point(x,y);

					manObj.shape="Rectangle";
					manObj.src="../../images/mag.png";
					manObj.desize=new go.Size(36, 36);
					manObj.type=man[j].type;

					nodeArr.push(manObj);
				}


				myDiagram.model = new go.GraphLinksModel();
				myDiagram.model.nodeKeyProperty="id";
				myDiagram.model.nodeDataArray=nodeArr;

				//背景
				if(result.backgoundImage){
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

		sessionStorage.setItem("shedIdSpace",zoneId);
		var hf=window.location.href;
		window.location.href=hf;
	});


	//经过磁卡列表
	function magpass(fl,page_num,page_limit,equ_id){
		$.ajax({
			url:get_api_urle(),
			async:true,
			cache:false,
			// timeout:2000,
			type:"post",
			dataType:"json",
			data: {
		    	params:'{"api_name":"historicalRecord","params":{"page_num":"'+page_num+'","page_limit":"'+page_limit+'","equ_id":"'+equ_id+'"}}'
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
				var list=result.items;
				if(fl){
					allmag_page(result.rowsCount,result.pageSize);
				}
				var html="";
                var arr=[];
                for(var i=0;i<list.length;i++){
                    arr.push('<tr>');
                    arr.push('<td>'+list[i].name+'</td>');
                    arr.push('<td>'+list[i].cardNumber+'</td>');
                    arr.push('<td>'+list[i].phone+'</td>');
                    arr.push('<td>'+list[i].company+'</td>');
                    arr.push('<td>'+list[i].address+'</td>');
                    arr.push('<td>'+list[i].residenceTime+'</td>');
                    
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



// }