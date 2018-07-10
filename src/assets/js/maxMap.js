/*
* @Author: Administrator
* @Date:   2018-04-08 15:06:53
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-12 14:05:23
*/
/*
* @Author: Administrator
* @Date:   2018-03-28 16:11:05
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-08 15:05:21
*/
// var cardId=location.search.split("=")[1];
// var shedId=sessionStorage.getItem("shedId");
var locationSearch=location.search;


// if (window.goSamples) goSamples();
// var gj = go.GraphObject.make;
var myDiagram_1 =gj(go.Diagram, "maxMap",  // Diagram refers to its DIV HTML element by id
{
  	initialContentAlignment: go.Spot.Center,
  	allowHorizontalScroll:true,
  	allowVerticalScroll:true,
  	allowDelete:false,
  	isReadOnly: true,
  	allowSelect: false,
  	initialScale:0.43,
  	isEnabled:true,
  	minScale:0.1,
  	maxScale:2.5,
  	"animationManager.isEnabled":false,
   	"grid.visible":false, //table
  	"commandHandler.copiesTree":false,
   	"commandHandler.deletesTree":false,
   	"toolManager.mouseWheelBehavior":go.ToolManager.WheelZoom,
  	"undoManager.isEnabled": true,
  	maxSelectionCount: 1,
  	defaultCursor:"auto",
  	padding:0

});


// define the node template
myDiagram_1.nodeTemplate =gj(go.Node, "Auto",
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

      		// search.equipId=node.data.id;
			// trajeList(true,search.pageNumber);
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
myDiagram_1.linkTemplate =gj(go.Link,
	{
		selectionAdornmentTemplate:
		gj(go.Adornment,
			gj(go.Shape,
				{ isPanelMain: true, stroke: "dodgerblue", strokeWidth: 2 })
			/*gj(go.Shape,
				{ toArrow: "Standard", fill: "dodgerblue", stroke: null, scale: 1 })*/
		),
		
		routing: go.Link.Normal,
		// curve: go.Link.Bezier,
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


trajedata_1(0,true);

function trajedata_1(pageN,bgfl,initialScale){
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
			myDiagram_1.model = new go.GraphLinksModel();
			myDiagram_1.model.nodeKeyProperty="id";
			myDiagram_1.model.nodeDataArray=nodeArr;
			myDiagram_1.model.linkDataArray=linkArr;

			//背景
			if(result.backgroundImage&&bgfl){
				myDiagram_1.add(
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
				myDiagram_1.initialScale=search.scale;
			}
			
		},
		error: function (a, b, c) {
			// parent.modal_loading("error");
		 	console.log(c);
		 }
		 
	});
};



/*Big or Small*/
$("#btnMin").click(function(event) {
	$("#showMax").css("zIndex",-10);
});


$("#btnMax").click(function(event) {
	$("#showMax").css("zIndex",6);
});