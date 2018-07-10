<template>
  	<div style="position:relative;">
  		<div class="showBig" id="showMax" v-bind:style="{ zIndex: showIndex}">
	        <button class="btnClose" id="btnMin" v-on:click="handleMaxOrmin(0)">X</button>
	        <div id="maxMap" class="tryMap" style="height: 100%;width: 100%;"></div>
	    </div>
	    
	    <div class="showMin" style="height: 100%;background:#fff;">
	        <div class="navsearch boxbgcolor">
	            <ul class="nav-tabs" role="tablist">
	                <li role="presentation" class="active"><a href="javascript:;">轨迹平面图</a></li>
	                <li role="presentation" class=""><router-link to="/main/hall/addmagcard" id="addmagcard">磁卡管理</router-link></li>

	                <li class="" style="float:right;"><a href="./datanalysis.html">数据分析</a></li>
	                <li style="float:right;"><a href=""  style="padding:0 0;">|</a></li>
	                <li class="" style="float:right;"><a href="./record.html">体验机记录</a></li>
	            </ul>

	            <div class="tab-content">
	                <div role="tabpanel" class="tab-pane active" id="logSearch">
	                    <form action="#" method="get" class="form-inline">
	                        <div class="form-group">
	                            <label for="">磁卡编号</label>
	                            
	                            <select class="form-control" id="magnum" v-model="search.cardId">  
								  	<option v-for="option in magnumOptions" v-bind:value="option.value">  
								    	{{ option.text }}  
								  	</option>  
								</select>  
	                        </div>
	                        <div class="form-group">
	                            <label for="bdate">时间</label>
	                            <input class="form-control datainp wicon" id="bdate" type="text" placeholder="YYYY-MM-DD hh:mm:ss" value=""  readonly>
	                        </div>
	                        <div class="form-group">
	                            <label for="edate">至</label>
	                            <input class="form-control datainp wicon" id="edate" type="text" placeholder="YYYY-MM-DD hh:mm:ss" value=""  readonly>
	                        </div>
	                        
	                        <div class="form-group">
	                            <label for="">缩放</label>
	                            <select class="form-control" id="scale_zoom" v-model="search.scale" @change="handleChange">
	                                <option v-for="option in diagScale" v-bind:value="option.value">  
								    	{{ option.text }}  
								  	</option>  
	                            </select>
	                        </div>
	                        <button type="button" class="btn btn-primary" id="search_btn" v-on:click="handleSearch">查询</button>
	                        <button type="button" class="btn btn-default" id="reset_btn" v-on:click="handleReset">清空</button>
	                        
	                    </form>
	                </div>
	            </div>
	        </div>
	        <!-- <div class="marginbox"></div> -->
	        <div class="navtable boxbgcolor clearfix">
	            <!-- <ul class="nav-tabs" role="tablist">
	                <li role="presentation" class="active"><a href="#logList" aria-controls="logList" role="tab" data-toggle="tab">日志列表</a></li>
	            </ul> -->
	            
	            <div class="tab-content" style="padding-top:0;">
	                <div role="tabpanel" class="tab-pane active" id="logList">

	                    <div style="padding:0 20px 20px;">
	                        <div class="reportbox" style="border:1px solid #999;position: relative;">
	                            <button type="button" id="btnMax" class="btnOpen" v-on:click="handleMaxOrmin(1)"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>
	                            <div id="myDiagramDiv" style="height: 500px;width: 100%;"></div>
	                        </div>
	                    </div>

	                    <table class="table">
	                        <thead>
	                            <tr>
	                                <td width="80">磁卡编号</td>
	                                <td width="100">姓名</td>
	                                <td width="80">读卡器编号</td>
	                                <td width="80">开始时间</td>
	                                <td width="80">结束时间</td>
	                                <td width="80">所用时长</td>
	                                <td width="80">备注</td>
	                            </tr>
	                        </thead>
	                        <tbody id="tbody">
	                            <tr v-for="item in resultList.items">
	                                <td>{{item.cardNumber}}</td>
	                                <td>{{item.name}}</td>
	                                <td>{{item.deviceName}}</td>
	                                <td>{{item.startTime}}</td>
	                                <td>{{item.endTime}}</td>
	                                <td>{{item.residenceTime}}</td>
	                                <td>{{item.remarks}}</td>
	                            </tr>
	                        </tbody>
	                    </table>
	                </div>
	            </div>

	            <div id="Pagination" class="pagination fr"></div>
	        </div>
	    </div>


  	</div>
</template>

<script>
	import '../../assets/lib/gojsP.js'
	// import '../../assets/js/halltemplate.js'
	// import '../../assets/js/maxMap.js'

	export default {
		data(){
			return{
				magnumOptions:[],
				diagScale:[{
					value:0.1,
					text:'10%'
				},{
					value:0.2,
					text:'20%'
				},{
					value:0.25,
					text:'25%',
				},{
					value:0.4,
					text:'40%'
				},{
					value:0.6,
					text:'60%'
				},{
					value:0.8,
					text:'80%'
				},{
					value:1,
					text:'100%'
				},{
					value:2,
					text:'200%'
				}],
				search:{
					pageNumber:"1",
					pageSize:"4",
					startTime:"",
					endTime:"",
					zoneId:"60",
					cardId:"",

					equipId:"",
					name:"",

					scale:0.25
				},
				globalVar:{
					gj:{},
					myDiagram:{},
					myDiagram1:{}
				},
				showIndex:-10,
				resultList:{}

			}
		},
		methods:{
			traje_page:function(total,num) {
				var _this=this;
			    $("#Pagination").pagination(
			        total,
			        {
			            items_per_page : num,
			            num_edge_entries : 1,
			            num_display_entries : 2,
			            callback :function(id,jp){
			                _this.trajeList(false,id+1);
			            }
			        });
			},
			myDiagramInit:function(){
				if (window.goSamples) goSamples();
    			var gj = go.GraphObject.make; 
    			var myDiagram =gj(go.Diagram, "myDiagramDiv",
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
						      		source: "./static/images/readcard.png",
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
			      		source: "./static/images/readcard.png",
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
				
				this.globalVar.gj=gj;
				this.globalVar.myDiagram=myDiagram;
				this.trajedata(0,true,false,myDiagram,gj);


				var myDiagram1 =gj(go.Diagram, "maxMap",
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
			    myDiagram1.nodeTemplate =gj(go.Node, "Auto",
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
						      		source: "./static/images/readcard.png",
						      		width:50,
						      		height:50
						      	}
						    )
						),
			      		locationSpot: go.Spot.Center,
			      		toEndSegmentLength: 30, 
			      		fromEndSegmentLength: 30
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
			      		source: "./static/images/readcard.png",
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
			   	myDiagram1.linkTemplate =gj(go.Link,
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
			    );

			   	this.globalVar.myDiagram1=myDiagram1;
				this.trajedata(0,true,false,myDiagram1,gj);

				
			},
			trajedata:function(pageN,bgfl,initialScale,myDiagram,gj){
				console.log('traj');
				var _this=this;
				$.ajax({
					url:this.get_api_urle(),
					async:true,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
				    	params:'{"api_name":"getListCardReaderData","params":{"page_num":"'+pageN+'","page_limit":"0","zone_id":"'+this.search.zoneId+'","card_number":"'+this.search.cardId+'","start_time":"'+this.search.startTime+'","end_time":"'+this.search.endTime+'"}}'
				    },
					contentType:"application/x-www-form-urlencoded;charset=utf-8", 
					beforeSend:function(xhr){
						// parent.modal_loading("正在获取数据！");
					},
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
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
							myDiagram.initialScale=_this.search.scale;
						}
						
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					 }
					 
				});
			},
			getMagnum:function(){
				var _this=this;
				$.ajax({
					url:this.get_api_urle(),
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
						// jump_index(data);
						if(data.code!=100) return;
						var list = data.result.items;
						_this.search.cardId=list[0].cardNumber;
						for(var i=0;i<list.length;i++){
							_this.magnumOptions.push({ text: list[i].cardNumber, value: list[i].cardNumber })
							
						};
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					}
					 
				});
			},
			trajeList:function(pag,pageN){
				var _this=this;
				$.ajax({
		            url:this.get_api_urle(),
		            async:true,
		            cache:false,
		            // timeout:2000,
		            type:"post",
		            dataType:"json",
		            data: {
		                params:'{"api_name":"getCardNumberDataPage","params":{"page_num":"'+pageN+'","page_limit":"'+this.search.pageSize+'","zone_id":"'+this.search.zoneId+'","card_number":"'+this.search.cardId+'","start_time":"'+this.search.startTime+'","end_time":"'+this.search.endTime+'","equ_id":"'+this.search.equipId+'","name":"'+this.search.name+'"}}'
		            },
		            contentType:"application/x-www-form-urlencoded;charset=utf-8", 
		            beforeSend:function(xhr){
		                // parent.modal_loading("正在获取数据！");
		            },
		            success:function(data,status,xhr){
		                // parent.modal_loading("");
		                // jump_index(data);
		                if(data.code!=100) return;
		               _this.resultList=data.result;

		                if(pag){
		                	console.log('s')
							_this.traje_page(data.result.rowsCount,data.result.pageSize);
						}

		                // _this.list=result.items;

		            },
		            error: function (a, b, c) {
		                // parent.modal_loading("error");
		                console.log(c);
		            }
		             
		        });
			},
			handleSearch:function(){
				console.log(this.search);
				this.trajedata(0,false,true,this.globalVar.myDiagram,this.globalVar.gj);

				this.trajedata(0,false,false,this.globalVar.myDiagram1,this.globalVar.gj);
			},
			handleChange:function(){
				this.globalVar.myDiagram.scale=this.search.scale;
			},
			handleReset:function(){
				this.search.scale=0.25;
				// this.globalVar.myDiagram.scale=this.search.scale;
			},
			handleMaxOrmin:function(type){
				if(type==1){
					this.showIndex=6;
				}else{
					this.showIndex=-10;
				}
			}
		},
		mounted:function(){
			this.getMagnum();
			console.log($("#myDiagramDiv"));
			this.myDiagramInit();

			this.trajeList(true,this.search.pageNumber);


	        /*this.$nextTick(function () {
			    alert('message')
			})*/

			


	    }
	}
</script>

<style scoped>
	.tryMap{
		overflow: hidden;
	}
</style>