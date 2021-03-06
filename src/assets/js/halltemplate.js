/*
* @Author: Administrator
* @Date:   2018-03-28 16:11:05
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-12 17:10:16
*/
// var cardId=location.search.split("=")[1];
// var shedId=sessionStorage.getItem("shedId");
var locationSearch=location.search;

// function init() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var gj = go.GraphObject.make;  // for conciseness in defining templates
    var myDiagram =gj(go.Diagram, "myDiagramDiv",  // Diagram refers to its DIV HTML element by id
    {
      	initialContentAlignment: go.Spot.Center,
      	allowHorizontalScroll:true,
      	allowVerticalScroll:true,
      	allowDelete:false,
      	isReadOnly: true,
      	allowSelect: true,
      	initialScale:0.25,
      	isEnabled:true,
      	minScale:0.1,
      	maxScale:2.5,
      	"animationManager.isEnabled":false,
       	"grid.visible":false, //table
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
      	new go.Binding("location", "loc").makeTwoWay(),
      	
      	// new go.Binding("location", "loc", go.Point.parse).makeTwoWay(),
      	{   
      		selectionAdornmentTemplate:
			gj(go.Adornment,
				gj(go.Shape,"Ellipse",
					{ 
						name: "OBJSHAPE",
			      		fill: "#eb29c5",
			      		stroke: "#eb29c5",
			      		// opacity: 0,
			      		desiredSize: new go.Size(50, 50)
					}
				),
				gj(go.Picture,
			      	{
			      		source: "../../images/readcard.png",
			      		width:50,
			      		height:50
			      	}
			    )
			),
      		locationSpot: go.Spot.Center,
      		toEndSegmentLength: 30, 
      		fromEndSegmentLength: 30,
      		click:function(e,node){
	      		console.log(node.data);

	      		search.equipId=node.data.id;
				trajeList(true,search.pageNumber);
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
      	gj(go.Picture,
      	{
      		source: "../../images/readcard.png",
      		width:40,
      		height:40
      	}),
      	gj(go.TextBlock,
      		{ 
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
					{ isPanelMain: true, stroke: "dodgerblue", strokeWidth: 2 })
				/*gj(go.Shape,
					{ toArrow: "Standard", fill: "dodgerblue", stroke: null, scale: 1 })*/
			),
			
			routing: go.Link.Normal,
			curve: go.Link.None,
			// curviness: 10,
			toShortLength: 0
		},
		new go.Binding("points").makeTwoWay(),
		// new go.Binding("curviness"),

      	gj(go.Shape,  //  the link shape
      		{ name: "OBJSHAPE" ,strokeWidth: 3},
      		new go.Binding("stroke","color").makeTwoWay()
      	)
      	/*gj(go.Shape,  //  the arrowhead--箭头
      		{ name: "ARWSHAPE", toArrow: "Standard", stroke: null, scale: 1 },
      		new go.Binding("fill","color").makeTwoWay()
      	),*/

      	//line-lable设置
        /*gj(go.Panel, "Auto",
          
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
            new go.Binding("text","line").makeTwoWay()
            )
        )*/
    );
    
	//事件
	myDiagram.addDiagramListener("BackgroundSingleClicked", function(e) {
        // console.log("back",e)
    });


	/*缩放*/
	$("#scale_zoom").change(function(event) {
		search.scale=Number($(this).val());
		myDiagram.scale=Number($(this).val());
	});

	
	/*查询参数*/
	var search={
		pageNumber:"1",
		pageSize:"4",
		startTime:"",
		endTime:"",
		zoneId:"",
		cardId:$("#magnum").val(),

		equipId:"",
		name:"",

		scale:0.25
	};

	search.zoneId=locationSearch.split("=")[1];
	$("#addmagcard").attr("href","./addmagcard.html?zoneId="+search.zoneId);
	
	//磁卡选择框
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
			var arr=[];
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

	
	
	trajedata(0,true);

	function trajedata(pageN,bgfl,initialScale){
		$.ajax({
			url:get_api_urle(),
			async:true,
			cache:false,
			// timeout:2000,
			type:"post",
			dataType:"json",
			data: {
		    	params:'{"api_name":"getListCardReaderData","params":{"page_num":"'+pageN+'","page_limit":"0","zone_id":"'+search.zoneId+'","card_number":"'+search.cardId+'","start_time":"'+search.startTime+'","end_time":"'+search.endTime+'"}}'
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
				var linkArr=[];
				var nodeObj={};
				var linkObj={};

				var node=result.equipmentList;
				var link=result.cardNumberDataList;
				for(var i=0;i<node.length;i++){
					nodeObj={};
					nodeObj.id=node[i].equId;
					// nodeObj.key=node[i].deviceName;
					nodeObj.key="";
					var x=Number(node[i].longitude);
					var y=Number(node[i].latitude);
					nodeObj.loc=new go.Point(x,y);
					nodeArr.push(nodeObj);
				}

				for(var j=0;j<link.length-1;j++){
					linkObj={};
					if(link[j].gwId!=link[j+1].gwId) continue;
					linkObj.from=link[j].equId;
					linkObj.to=link[j+1].equId;
					linkObj.color="#eb6100";
					linkObj.line=String(j);
					linkArr.push(linkObj);
				}


				// console.log(nodeArr);
				myDiagram.model = new go.GraphLinksModel();
				myDiagram.model.nodeKeyProperty="id";
				myDiagram.model.nodeDataArray=nodeArr;
				myDiagram.model.linkDataArray=linkArr;

				//背景
				if(result.backgroundImage&&bgfl){
					myDiagram.add(
				      	gj(go.Part, 
				      		{ layerName: "Background", 
				      		position: new go.Point(0, 0),
				      		selectable: false, 
				      		pickable: false 
				      		},
				      		gj(go.Picture, result.backgroundImage,{
				      			imageAlignment:go.Spot.TopLeft
				      		})
				      	)
				    );
				}

				if(Boolean(initialScale)){
					myDiagram.initialScale=search.scale;
				}
				
			},
			error: function (a, b, c) {
				// parent.modal_loading("error");
			 	console.log(c);
			 }
			 
		});
	};


	$("#search_btn").click(function(event) {
		console.log(search.scale);
		

		search.cardId=$("#magnum").val();
		search.startTime=$("#bdate").val();
		search.endTime=$("#edate").val();
		search.equipId="";
		trajedata(0,false,true);
	
		trajeList(true,search.pageNumber);

		trajedata_1(0,false,false);

	});



	/*列表处理*/
	trajeList(true,search.pageNumber);
	function trajeList(pag,pageN){
		$.ajax({
            url:get_api_urle(),
            async:true,
            cache:false,
            // timeout:2000,
            type:"post",
            dataType:"json",
            data: {
                params:'{"api_name":"getCardNumberDataPage","params":{"page_num":"'+pageN+'","page_limit":"'+search.pageSize+'","zone_id":"'+search.zoneId+'","card_number":"'+search.cardId+'","start_time":"'+search.startTime+'","end_time":"'+search.endTime+'","equ_id":"'+search.equipId+'","name":"'+search.name+'"}}'
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

                if(pag){
					traje_page(data.result.rowsCount,data.result.pageSize);
				}

                var list=result.items;
                var html="";
                var arr=[];
                for(var i=0;i<list.length;i++){
                    arr.push('<tr>');
                    arr.push('<td>'+list[i].cardNumber+'</td>');
                    arr.push('<td>'+list[i].name+'</td>');
                    arr.push('<td>'+list[i].deviceName+'</td>');
                    arr.push('<td>'+list[i].startTime+'</td>');
                    arr.push('<td>'+list[i].endTime+'</td>');
                    arr.push('<td>'+list[i].residenceTime+'</td>');
                    arr.push('<td>'+list[i].remarks+'</td>');
                    
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
	};









	//轨迹、列表处理
	/*myDiagram.model = new go.GraphLinksModel();

	var nodeArr=[
    	{ "id": 0, loc: new go.Point(100, 100),"key": 0},
    	{ "id": 1, loc: new go.Point(1000, 100),"key": 1},
    	{ "id": 2, loc: new go.Point(250, 225),"key": 2},
    	{ "id": 3, loc: new go.Point(270, 325),"key": 3},
  	];

  	var linkArr= [
    	{ "from": 0, "to": 0, "line":1,"color":"#ff8a18"},
    	{ "from": 0, "to": 1, "line":2,"color":"#ff8a18"},
    	{ "from": 1, "to": 0, "line":3,"color":"#ff8a18"},
    	{ "from": 1, "to": 1, "line":4,"color":"#ff8a18"},

    	{ "from": 2, "to": 3, "line":1,"color":"#ff8a18"},
    	{ "from": 3, "to": 1, "line":2,"color":"#ff8a18"},
    	{ "from": 1, "to": 3, "line":2,"color":"#ff8a18"},
    	{ "from": 3, "to": 1, "line":2,"color":"#ff8a18"},
    	{ "from": 3, "to": 1, "line":3,"color":"#ff8a18"}
    ]



	myDiagram.model.nodeKeyProperty="id";
	myDiagram.model.nodeDataArray=nodeArr;
	myDiagram.model.linkDataArray=linkArr;*/
	
	// console.log(myDiagram.findNodeForKey(3).data)
	/*function trajedata(page_num,page_limit,zone_id,card_number,starttime,endtime,bg){
		$.ajax({
			url:get_api_urle(),
			async:true,
			cache:false,
			// timeout:2000,
			type:"post",
			dataType:"json",
			data: {
		    	params:'{"api_name":"getListCardReaderData","params":{"page_num":"'+page_num+'","page_limit":"'+page_limit+'","zone_id":"'+zone_id+'","card_number":"'+card_number+'","start_time":"'+starttime+'","end_time":"'+endtime+'"}}'
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
				var list=result.page.items;
				
				//翻页
				traje_page(result.page.rowsCount,result.page.pageSize);
				

				var html="";
				var arr=[];
				for(var i=0;i<list.length;i++){
					arr.push('<tr>');
					arr.push('<td>'+list[i].deviceName+'</td>');
					arr.push('<td>'+list[i].startTime+'</td>');
					arr.push('<td>'+list[i].endTime+'</td>');
					arr.push('<td>'+list[i].onerankdevDevSn+'</td>');
					arr.push('<td>'+list[i].residenceTime+'</td>');
					
					arr.push('</tr>');
				}
				html=arr.join("");
				$("#tbody").html(html);



				var nodeArr=[];
				var linkArr=[];
				var nodeObj={};
				var linkObj={};

				var node=result.equipmentList;
				var link=result.cardNumberDataList;
				for(var i=0;i<node.length;i++){
					nodeObj={};
					nodeObj.id=node[i].equId;
					nodeObj.key=node[i].deviceName;
					var x=Number(node[i].longitude);
					var y=Number(node[i].latitude);
					nodeObj.loc=new go.Point(x,y);
					nodeArr.push(nodeObj);
				}

				for(var j=0;j<link.length-1;j++){
					linkObj={};
					linkObj.from=link[j].equId;
					linkObj.to=link[j+1].equId;
					linkObj.line=String(j);
					linkArr.push(linkObj);
				}


				console.log(nodeArr);
				myDiagram.model = new go.GraphLinksModel();
				myDiagram.model.nodeKeyProperty="id";
				myDiagram.model.nodeDataArray=nodeArr;
				myDiagram.model.linkDataArray=linkArr;

				//背景
				if(result.backgroundImage&&bg){
					myDiagram.add(
				      	gj(go.Part, 
				      		{ layerName: "Background", 
				      		position: new go.Point(0, 0),
				      		selectable: false, 
				      		pickable: false 
				      		},
				      		gj(go.Picture, result.backgroundImage,{
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
	};*/


	//pagina列表处理
	/*function trajeList(page_num,page_limit,zone_id,card_number,starttime,endtime){
		$.ajax({
            url:get_api_urle(),
            async:true,
            cache:false,
            // timeout:2000,
            type:"post",
            dataType:"json",
            data: {
                params:'{"api_name":"getListCardReaderData","params":{"page_num":"'+page_num+'","page_limit":"'+page_limit+'","zone_id":"'+zone_id+'","card_number":"'+card_number+'","start_time":"'+starttime+'","end_time":"'+endtime+'"}}'
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
                var list=result.page.items;
                

                var html="";
                var arr=[];
                for(var i=0;i<list.length;i++){
                    arr.push('<tr>');
                    arr.push('<td>'+list[i].deviceName+'</td>');
                    arr.push('<td>'+list[i].startTime+'</td>');
                    arr.push('<td>'+list[i].endTime+'</td>');
                    arr.push('<td>'+list[i].onerankdevDevSn+'</td>');
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
	};*/

	/*$("#search_btn").click(function(event) {
		cardId=$("#cardsel").val();
		search.zoneId=$("#shedsel").val();
		search.startTime=$("#start_time").val();
		search.endTime=$("#end_time").val();
		trajedata(search.pageNumber,search.pageSize,search.zoneId,cardId,search.startTime,search.endTime,false);

	});*/


	/*$("#shedsel").change(function(event) {
		var zoneId=$("#shedsel").val();
		sessionStorage.setItem("shedId",zoneId);
		var hf=window.location.href;
		window.location.href=hf;
	});*/



	/*$("#cardsel").change(function(event) {
		cardId=$("#cardsel").val();
		trajedata(search.pageNumber,search.pageSize,search.zoneId,cardId,search.startTime,search.endTime,false);
	});*/
// }