<template>
  	<div>
  		<div class="navsearch boxbgcolor">
	        <ul class="nav-tabs" role="tablist">
	            <li role="presentation" class="active"><a href="javascript:;">查询</a></li>
	        </ul>
	        
	        <div class="tab-content">
	            <div role="tabpanel" class="tab-pane active" id="sensorSearch">
	                <form action="#" method="get" class="form-inline">
	                    <div class="form-group">
	                        <label for="mag_name">计划名称</label>
	                        <input class="form-control" id="mag_num" type="text" placeholder="" value="">
	                    </div>
	                    <button type="button" class="btn btn-primary" id="search_btn">查询</button>
	                    <button type="reset" class="btn btn-default">清空</button>
	                    
	                </form>
	            </div>
	        </div>
	    </div>
	    <div class="marginbox"></div>
	    <div class="navtable boxbgcolor clearfix">
	        <ul class="nav-tabs" role="tablist">
	            <li role="presentation" class="active"><a href="#sensorList" aria-controls="sensorList" role="tab" data-toggle="tab">列表</a></li>
	        </ul>
	        
	        <div class="tab-content">
	            <div role="tabpanel" class="tab-pane active" id="sensorList">
	                <table class="table">
	                    <thead>
	                        <tr>
	                            <td width="100">成果名称</td>
	                            
	                            <td width="140">提交时间</td>
	                            <td width="140">结束时间</td>
	                            <td width="100">所属计划</td>
	                            <td width="100">下载</td>
	                        </tr>
	                    </thead>
	                    <tbody id="tbody">
	                        <tr v-for="item in resultList.items">
                                <td>{{item.planName}}</td>
                                
                                <td>{{Boolean(item.planBeginDate)?item.planBeginDate:''}}</td>
                                <td>{{Boolean(item.planEndDate)?item.planEndDate:''}}</td>
                                <td>{{item.taskName}}</td>
                                <td>
                                	<!-- <el-button @click="handleEditorOrAdd(item.planId)" type="text" size="medium">编辑</el-button> -->
                                	<el-button type="text" size="medium" @click="handleDel(item.planId)">下载</el-button>
                                </td>
                            </tr>
	                    </tbody>
	                </table>
	            </div>
	        </div>

	        <div id="Pagination" class="pagination fr"></div>
	    </div>

  	</div>
</template>

<script>
	export default {
		data(){
			return{
				userId:'',
				search:{
					pageNumber:"1",
					pageSize:"10",
					resultName:""
				},
				resultList:{}
			}
		},
		methods:{
			tableList:function(pag,pageN){
				var _this=this;
				$.ajax({
					url:this.get_api_url(),
					async:true,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
				    	params:'{"api_name":"queryResultsDocumentList","params":{"pageNumber":"'+pageN+'","pageSize":"'+this.search.pageSize+'","resultsDocumentName":"'+this.search.resultName+'","userId":"'+this.userId+'"}}'
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
							_this.page_curBase(data.result.rowsCount,data.result.pageSize,_this);
						}
						_this.resultList=data.result;
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					 }
					 
				});
			}
		},
		mounted:function(){
			this.userId=sessionStorage.getItem("user_id");
			this.tableList(true,this.search.pageNumber);
			
		}
	}
</script>

<style scoped>
	.el-select,.el-date-editor.el-input, .el-date-editor.el-input__inner{
		width: 270px;
	}
</style>