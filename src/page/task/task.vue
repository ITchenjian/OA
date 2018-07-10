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
	                        <label for="mag_name">任务名称</label>
	                        <input class="form-control" id="mag_num" type="text" placeholder="" value="">
	                    </div>
	                    <button type="button" class="btn btn-primary" id="search_btn">查询</button>
	                    <button type="reset" class="btn btn-default">清空</button>
	                    <button type="button" class="btn btn-default" id="addarea" data-target="#addmagcardModal" data-toggle="modal" @click="handleEditorOrAdd('')">添加任务</button>
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
	                            <td width="100">任务名称</td>
	                            
	                            <td width="140">开始时间</td>
	                            <td width="140">结束时间</td>
	                            <td width="100">所属项目</td>
	                            <td width="100">任务说明</td>
	                            <td width="100">操作</td>
	                        </tr>
	                    </thead>
	                    <tbody id="tbody">
	                        <tr v-for="item in resultList.items">
                                <td>{{item.taskName}}</td>
                                
                                <td>{{Boolean(item.taskBeiginDate)?item.taskBeiginDate:''}}</td>
                                <td>{{Boolean(item.taskEndDate)?item.taskEndDate:''}}</td>
                                <td>{{item.projectName}}</td>
                                <td>{{item.taskDetail}}</td>
                                <td>
                                	<!-- <a title="" href="javascript:;" @click="dialogFormVisible = true"><span>编辑</span></a>&nbsp;&nbsp; -->
                                	<el-button @click="handleEditorOrAdd(item.taskId)" type="text" size="medium">编辑</el-button>
                                	<el-button type="text" size="medium" @click="handleDel(item.taskId)">删除</el-button>
                                </td>
                            </tr>
	                    </tbody>
	                </table>
	            </div>
	        </div>

	        <div id="Pagination" class="pagination fr"></div>
	    </div>


		<el-dialog title="任务" :visible.sync="dialogFormVisible" width="500px" @open="openDialog" @close="closeDialog">
		 	<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
				<el-form-item label="所属项目" prop="projectId">
					<el-col :span="18">
			      		<el-select v-model="form.projectId">
			        		<el-option  v-for="item in form.proOptions" :key="item.projectId" :label="item.projectName" :value="item.projectId"></el-option>
			      		</el-select>
		      		</el-col>
		      	</el-form-item>

		    	<el-form-item label="任务名称" prop="taskName">
		    		<el-col :span="18">
		      			<el-input v-model="form.taskName" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="开始时间">
		    		<el-col :span="18">
		    			<el-date-picker v-model="form.taskBeiginDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
		      		</el-col>
		    	</el-form-item>
		    	<el-form-item label="结束时间">
		    		<el-col :span="18">
		      			<el-date-picker v-model="form.taskEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
		      		</el-col>
		    	</el-form-item>
		    	<el-form-item label="任务说明">
		    		<el-col :span="18">
				    	<el-input type="textarea" v-model="form.taskDetail"></el-input>
				    </el-col>
				</el-form-item>

			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="submitForm('form')">确 定</el-button>
		 	</div>
			
		</el-dialog>

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
					projectId:"",
					taskId:"",
					taskName:"",
					taskBeiginDate:"",
					taskEndDate:"",
					taskDetail:""
				},
				resultList:{},
				// getEditorData:{},

				dialogFormVisible: false,
		        form: {
		        	proOptions:[],
		        	projectId:"",
					taskId:"",
					taskName:"",
					taskBeiginDate:"",
					taskEndDate:"",
					taskDetail:""
		        },
		        rules:{
		        	taskName: [
			            { required: true, message: '请输入任务名称', trigger: 'blur' },
			            { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
			        ],
			        projectId: [
            			{ required: true, message: '请选择项目编号', trigger: 'change' }
          			]
		        },
		        formLabelWidth: '100px'
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
				    	params:'{"api_name":"queryTaskList","params":{"pageNumber":"'+pageN+'","pageSize":"'+this.search.pageSize+'","projectId":"'+this.search.projectId+'","taskName":"'+this.search.taskName+'","taskBeiginDate":"'+this.search.taskBeiginDate+'","taskEndDate":"'+this.search.taskEndDate+'","userId":"'+this.userId+'"}}'
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
			},

			handleEditorOrAdd:function(id){
				console.log(id)
				this.dialogFormVisible = true;
				
				if(id=="") return this.form.taskId="";

				var _this=this;
				$.ajax({
					url:this.get_api_url(),
					async:true,
					cache:false,
					// timeout:2000,
					type:"post",
					dataType:"json",
					data: {
				    	params:'{"api_name":"beforeUpdateTask","params":{"taskId":"'+id+'","userId":"'+this.userId+'"}}'
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

						_this.form.projectId=result.projectId;
						_this.form.taskId=result.taskId;
						_this.form.taskName=result.taskName;
						_this.form.taskDetail=result.taskDetail;
						_this.form.taskBeiginDate=result.taskBeiginDate;
						_this.form.taskEndDate=result.taskEndDate;
						
					},
					error: function (a, b, c) {
						// parent.modal_loading("error");
					 	console.log(c);
					 }
					 
				});
			},
			getProject:function(){
				var _this=this;
				$.ajax({
					url:this.get_api_url(),
					type: 'POST',
					dataType:"json",
					data: {
				    	params:'{"api_name":"queryProject","params":{"userId":"'+this.userId+'"}}'
				    },
					success:function(data,status,xhr){
						// parent.modal_loading("");
						// jump_index(data);
						if(data.code!=100) return;
						_this.form.proOptions=data.result;
					}
					 
				});
			},
			submitForm:function(formName){
				var _this=this;
				this.$refs[formName].validate(function(valid,noStri){
					console.log(valid,noStri);
					if(valid){
						_this.dialogFormVisible=false;

						$.ajax({
							url:_this.get_api_url(),
						  	type: 'POST',
						  	dataType:"json",
						  	data: {
						    	params:'{"api_name":"addTask","params":{"taskId":"'+_this.form.taskId+'","taskName":"'+_this.form.taskName+'","taskDetail":"'+_this.form.taskDetail+'","taskBeiginDate":"'+_this.form.taskBeiginDate+'","taskEndDate":"'+_this.form.taskEndDate+'","projectId":"'+_this.form.projectId+'","userId":"'+_this.userId+'"}}'
						    },
						  	success:function(data,status,xhr){
						  		_this.tableList(true,_this.search.pageNumber);
						  	}
						});

					}else{
						_this.dialogFormVisible=true;
						console.log(_this.form)
					}
				})
			},
			openDialog:function(){
				console.log("打开")
			},
			closeDialog:function(){
				this.$refs['form'].resetFields();
			},
			handleDel:function(id){
				var _this=this;
				
				this.$layer.confirm('您确定删除该条任务？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.closeAll();
					$.ajax({
						url:_this.get_api_url(),
						type:"post",
						dataType:"json",
						data: {
					    	params:'{"api_name":"deleteTask","params":{"taskId":"'+id+'"}}'
					    },
						success:function(data,status,xhr){
							_this.tableList(true,_this.search.pageNumber);
							
						}
						 
					});
				});

			}
		},
		mounted:function(){
			this.userId=sessionStorage.getItem("user_id");
			this.tableList(true,this.search.pageNumber);
			this.getProject();
		}
	}
</script>

<style scoped>
	.el-select,.el-date-editor.el-input, .el-date-editor.el-input__inner{
		width: 270px;
	}
</style>