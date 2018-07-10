<template>
  	<div>
	  	<div class="navsearch boxbgcolor">
	        <ul class="nav-tabs" role="tablist">
	            <li role="presentation" class="active"><a href="#sensorSearch" aria-controls="sensorSearch" role="tab" data-toggle="tab">传感器查询</a></li>
	        </ul>
	        
	        <div class="tab-content">
	            <div role="tabpanel" class="tab-pane active" id="sensorSearch">
	                <form action="#" method="get" class="form-inline">
	                    <div class="form-group">
	                        <label for="dev_name">传感器名称</label>
	                        <input class="form-control" id="dev_name" type="text" placeholder="" value="">
	                    </div>
	                    <button type="button" class="btn btn-primary" id="search_btn">查询</button>
	                    <button type="reset" class="btn btn-default">清空</button>
	                    <button type="button" class="btn btn-default" data-toggle="modal" data-target="#addequipModal" id="addequip">添加设备</button>
	                    <button type="button" class="btn btn-default dnequ" data-toggle="modal" data-target="#localModal" id="allLocal" @click="getAllLocal">位置信息总览</button>
	                </form>
	            </div>
	        </div>
	    </div>
	    <div class="marginbox"></div>
	    <div class="navtable boxbgcolor clearfix">
	        <ul class="nav-tabs" role="tablist">
	            <li role="presentation" class="active"><a href="#sensorList" aria-controls="sensorList" role="tab" data-toggle="tab">传感器列表</a></li>
	        </ul>
	        
	        <div class="tab-content">
	            <div role="tabpanel" class="tab-pane active" id="sensorList">
	                <table class="table">
	                    <thead>
	                        <tr>
	                            <td width="50">标识</td>
	                            <td width="100">传感器名称</td>
	                            <td width="100">传感器类型</td>
	                            <td width="100">SN</td>
	                            <td width="100">创建时间</td>
	                            <td width="70">设备数据</td>
	                            <td width="80">关联</td>
	                            <td width="120">所在位置</td>
	                            <td width="100">操作</td>
	                        </tr>
	                    </thead>
	                    <tbody id="tbody">
	                        <tr v-for="item in resultList.items">
	                        	<td v-if="item.runningStatus==0">
	                        		<div v-if="item.devStatus==''" v-bind:class="'type_'+item.runningStatus+'1'">
	                        			<img v-bind:src="item.webStatePicture|imgSrc" alt="" width="32">
	                        		</div>
	                        		<div v-else v-bind:class="'type_'+item.runningStatus+item.devStatus+'1'">
	                        			<img v-bind:src="item.webStatePicture|imgSrc" alt="" width="32">
	                        		</div>
	                        	</td>
	                        	<td v-else>
	                        		<div class="type_1">
	                        			<img v-bind:src="item.webStatePicture|imgSrc" alt="" width="32">
	                        		</div>
	                        	</td>

	                        	<td>{{item.deviceName}}</td>
	                        	<td>{{item.typeName}}</td>
	                        	<td>{{item.onerankdevDevSn}}</td>
	                        	<td>{{item.createdDate}}</td>

	                        	<td v-if="item.controlClass==1">{{item.devValue=='0.0'||item.devValue=='0'?'开':'关'}}</td>
	                        	<td v-else>{{item|equipData}}</td>

	                        	<td>{{item.associationNumber?'已关联':'未关联'}}</td>
	                        	<td>{{item.address}}</td>
	                        	<td v-if="item.controlClass==1">
									<a v-if="item.devValue=='1'||item.devValue==''" title="" href="javascript:;" @click=""><span>开起</span></a>&nbsp;&nbsp;
									<a v-if="item.devValue=='0'||item.devValue=='0.0'" title="" href="javascript:;" @click=""><span>关闭</span></a>&nbsp;&nbsp;

									<a title="" href="#" data-target="#editdevModal" data-toggle="modal" @click=""><span>查看</span></a>&nbsp;&nbsp;
									<router-link :to="{path:'/main/sensor/hisdataTemp',query:{typeCode:item.typeCode,devSn:item.onerankdevDevSn}}">历史数据</router-link>&nbsp;&nbsp;
									<a title="" href="javascript:;" @click="handleDel(item.equId)" class=""><span>删除</span></a>
	                        	</td>
	                        	<td v-else-if>
									<a title="" href="#" data-target="#editdevModal" data-toggle="modal" @click="handleDetail(item.equId,item.gwId)"><span>查看</span></a>&nbsp;&nbsp;
									<router-link :to="{path:'/main/sensor/hisdataTemp',query:{typeCode:item.typeCode,devSn:item.onerankdevDevSn}}">历史数据</router-link>&nbsp;&nbsp;
									<a title="" href="javascript:;" @click="handleDel(item.equId)" class=""><span>删除</span></a>
	                        	</td>
	                        </tr>
	                    </tbody>
	                </table>
	            </div>
	        </div>

	        <div id="Pagination" class="pagination fr"></div>
	    </div>
		
		<!--详情 -->
	    <div class="modal fade" id="editdevModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	        <div class="modal-dialog modal-lg" role="document">
	            <div class="modal-content">
	                <div class="modal-header">
	                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	                    <h4 class="modal-title">查看详情</h4>
	                </div>
	                <form class="form-horizontal" action="#" method="#" id="editdev_form">
	                    <div class="modal-body clearfix">
	                        <div class="m-left fl">
	                            <ul>
	                                <li>传感器类型：<span id="deves_type">{{results.typeName}}</span></li>
	                                <li>设备名称：<span id="deves_name">{{results.deviceName}}</span></li>
	                                <li id="devsVal" v-if="results.list" v-html="$options.filters.detailEquipData(results)"></li>
	                                <li>SN/ID：<span id="sns">{{results.onerankdevDevSn}}</span></li>
	                                <li>设备地址：<span id="deves_address">{{results.address}}</span></li>
	                            </ul>
	                            <ul>
	                                <li><span class="fontcolor">关联设备</span></li>
	                                <li>传感器类型：<span id="deve_type">{{result.typeName}}</span></li>
	                                <li>设备名称：<span id="deve_name">{{result.deviceName}}</span></li>
	                                <li id="devVal" v-if="result.list" v-html="$options.filters.detailEquipData(result)"></li>
	                                <li>SN/ID：<span id="snid">{{result.onerankdevDevSn}}</span></li>
	                                <li>设备地址：<span id="deve_address">{{result.address}}</span></li>
	                            </ul>
	                        </div>
	                        <div class="m-right fr mapborder" id="devMap">
	                            <!-- <img src="../../images/map.png" height="340" width="451" alt=""> -->
	                        </div>
	                    </div>
	                    <div class="modal-footer">
	                        <!-- <button type="button" class="btn btn-primary" id="edit_true">确认</button> -->
	                        <button type="button" class="btn btn-primary" data-dismiss="modal">确认</button>
	                    </div>
	                </form>
	            </div>
	        </div>
	    </div>

	    <!-- 位置总览 -->
	    <div class="modal fade" id="localModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	        <div class="modal-dialog modal-lg" role="document">
	            <div class="modal-content">
	                <div class="modal-header">
	                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	                    <h4 class="modal-title">位置总览</h4>
	                </div>
	                <div class="modal-body">
	                    <form class="form-horizontal" action="#" method="#">
	                        <div id="total_local" class="mapborder" style="height:400px;"></div>
	                    </form>
	                </div>
	                <div class="modal-footer">
	                    <button type="button" class="btn btn-primary" data-dismiss="modal">确认</button>
	                </div>
	            </div>
	        </div>
	    </div>

  	</div>
</template>

<script>
	import BMap from 'BMap';
	export default{
		data(){
			return{
				search:{
					pageNumber:"1",
					pageSize:"10",
					name:"",
					typeCode:"",
					zoneId:""
				},
				resultList:{},
				defaultSrc:"../../../static/images/blank.png",

				userId:"",
				results:{},
				result:{},
				map:{},
				map2:{}
				
			}
		},
		methods:{
			tableList:function(pag,pageN){
				var _this=this;
				$.ajax({
					url:this.get_api_urle(),
					async:true,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
				    	params:'{"api_name":"getOnerankdev","params":{"page_num":"'+pageN+'","page_limit":"'+this.search.pageSize+'","name":"'+this.search.name+'","type_code":"'+this.search.typeCode+'","zone_id":"'+this.search.zoneId+'","type":"1"}}'
				    },
					contentType:"application/x-www-form-urlencoded;charset=utf-8", 
					beforeSend:function(xhr){
						// parent.modal_loading("正在获取数据！");
					},
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
						if(data.code!=100) return;

						//翻页
						if(pag){
							_this.page_curBase(data.result.page.rowsCount,data.result.page.pageSize,_this);
						}
						_this.resultList=data.result.page;
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					 }
					 
				});
			},
			getAllLocal:function() {
				var _this=this;
			    $.ajax({
			        url :  this.get_api_urle(),
			        type : "POST",
			        dataType : "json",
			        data: {
			            params:'{"api_name":"getOnerankdev","params":{"page_num":"0","page_limit":"0","type_code":"'+this.search.typeCode+'","zone_id":"'+this.search.zoneId+'","type":"1"}}'
			        },
			        contentType : "application/x-www-form-urlencoded;charset=utf-8",
			        success : function(data) //data是返回数据处理后的结果 
			        {

			            if(data.code!=100) return;
			            
			            var markers = data.result.page.items;
			            
			            // map2.clearOverlays();
			            _this.addMapOverlay(_this.map2,markers);
			        }
			    });

			},
			handleDetail:function(equId,gwId){
				var _this=this;
				if(!this.userId) return this.$router.push('/');
				$.ajax({
					url:this.get_api_urle(),
					async:true,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
						params:'{"api_name":"getOnerankdevDetail","params":{"equ_id":"'+equId+'","gw_id":"'+gwId+'","user_id":"'+this.userId+'"}}'
				    },
					contentType:"application/x-www-form-urlencoded;charset=utf-8", 
					beforeSend:function(xhr){
						// parent.modal_loading("正在获取数据！");
					},
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
						if(data.code!=100) return;
						_this.results=data.result.maps;
						_this.result=data.result.map;

						_this.addMapOverlayl(_this.results.latitude, _this.results.longitude, _this.map, _this.results.webMapPicture);
						setTimeout(function(){
							_this.map.panTo(new BMap.Point(_this.results.longitude,_this.results.latitude),{noAnimation:true});
						}, 200);
						
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					}
					 
				});
			},
			handleDel:function(equId){
				var _this=this;
				this.$layer.confirm('您确定删除该设备？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(index){
					this.$layer.close(index);
					$.ajax({
						url:this.get_api_url(),
						async:true,
						cache:false,
						// timeout:2000,
						type:"post",
						dataType:"json",
						data: {
					    	params:'{"api_name":"deleteEquipment","params":{"equ_id":"'+equId+'"}}'
					    },
						contentType:"application/x-www-form-urlencoded;charset=utf-8", 
						beforeSend:function(xhr){
							// parent.modal_loading("正在获取数据！");
							
						},
						success:function(data,status,xhr){
							_this.tableList(true,_this.search.pageNumber);
							
						},
						error: function (a, b, c) {
							// parent.modal_loading("error");
						 	console.log(c);
						 }
						 
					});
				});
			}
		},
		mounted:function(){
			console.log(this.$route.query);
			this.userId=sessionStorage.getItem("user_id");

			this.search.typeCode=this.$route.query.typeCode;
			this.tableList(true,this.search.pageNumber);

			this.map = new BMap.Map("devMap"); 
			this.map.centerAndZoom(new BMap.Point(113.937122, 22.542874), 12);   
			this.setMapEvent(this.map);
			this.addMapControl(this.map);

			this.map2 = new BMap.Map("total_local"); 
			this.map2.centerAndZoom(new BMap.Point(113.834212, 22.6299), 12);   
			this.setMapEvent(this.map2);
			this.addMapControl(this.map2);
		},
		filters: {
            imgSrc: function (val) {
                return val ? val : '../../../static/images/blank.png'
            },
            equipData:function(val){
            	if(val.typeCode=="173"){
					return val.devValue=='1.0'?'正常':'异常';
				}else if(val.typeCode=="85"){
					return val.devValue=='1.0'?'有人':'无人';
				}else{
					var devValue=val.devValue.split(":")[1]
					return devValue?devValue:'';
				}
            },
            detailEquipData:function(val){
            	console.log(val);
            	if(val.controlClass==1){
					return '<span class="fontcolor">设备数据：'+(val.list[0]=='1'||val.list[0]==''?'关':'开')+'</span>';
				}else{
					if(val.typeCode=="173"){
						return  '<span class="fontcolor">设备数据：'+(val.list[0]=='1.0'?'正常':'异常')+'</span>';
					}else if(val.typeCode=="85"){
						return  '<span class="fontcolor">设备数据：'+(val.list[0]=='1.0'?'有人':'无人')+'</span>';
					}else{
						var devshtmls="";
						var devsValArrs=[];
						var addCounts=val.list.length%4==0?4:3;
						for(var n=0; n<val.list.length;n+=addCounts){
							devsValArrs.push(val.list.slice(n,n+addCounts));
						}

						var strArrs=[];
						for(var m=0;m<devsValArrs.length;m++){
							var strDatas='';

							console.log(devsValArrs[m])
							for(var k=0;k<devsValArrs[m].length;k++){
								console.log(devsValArrs[m][k])
								var devsValkeys=devsValArrs[m][k].split(":");
								
								var devsValhtmls='<span>'+devsValkeys[0]+'：</span><span class="fontcolor">'+devsValkeys[1]+'</span>';

								strDatas+=devsValhtmls+"&nbsp;&nbsp;&nbsp;"
							}
							strArrs.push('<div style="line-height:24px;">'+strDatas+'</div>');
						}
						devshtmls=strArrs.join("");
						
						return devshtmls;
					}
				}
            }
        }
	} 

</script>

<style scoped>
	
</style>